import { LoanApplicationStatus, LoanStatus, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { LoanApplicationInput } from "@/schemas/loan.schema";
import { NotificationService } from "@/services/notification.service";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "loan-documents";

async function withSignedAttachmentUrls<T extends { attachments?: { fileUrl: string }[] }>(application: T) {
  const attachments = await Promise.all(
    (application.attachments || []).map(async (attachment) => {
      const { data } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .createSignedUrl(attachment.fileUrl, 3600);

      return {
        ...attachment,
        fileUrl: data?.signedUrl || attachment.fileUrl,
      };
    })
  );

  return {
    ...application,
    attachments,
  };
}

export const LoanService = {
  async createLoanApplication(userId: string, data: LoanApplicationInput) {
    try {
      const loanApp = await prisma.loanApplication.create({
        data: {
          borrowerId: userId,
          requestedAmount: data.requestedAmount,
          description: data.description,
          collateralUrl : "",
          collateralDescription : "",
          status: "PENDING",
        },
      });

      return loanApp;
    } catch (error) {
      console.error("Error creating loan application:", error);
      throw new Error("Gagal merekam pengajuan pinjaman ke database.");
    }
  },

  async getLoanApplication(start: number, end: number, loanStatus? : LoanApplicationStatus) {
    try {
      // Calculate the number of items to take
      let loanApplications = null;
      let totalCount = 0;
      const skip = Math.max(0, start);
      const take = Math.max(0, end - start);

      // ==========================================
      // 1. Fetch paginated loan applications
      // ==========================================
      if (loanStatus) {

        loanApplications = await prisma.loanApplication.findMany({
          where: { 
            status: loanStatus
          },
          skip: skip,
          take: take,
          select: {
            id: true,
            description: true,
            collateralDescription: true,
            requestedAmount: true,
            createdAt: true,
            status: true,
            loan: {
              select: {
                id: true,
                approvedAmount: true,
                status: true,
              },
            },
            attachments: {
              select: {
                id: true,
                documentType: true,
                fileUrl: true,
                uploadedAt: true,
              },
              orderBy: {
                uploadedAt: "desc",
              },
            },
            // Using the relation from your schema: 'borrower'
            borrower: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true, // Included so your frontend Table can show the profile pic
              },
            },
          },
          orderBy: { 
            createdAt: "desc" 
          },
        });
  
        // ==========================================
        // 2. Get total count for frontend pagination
        // ==========================================
        totalCount = await prisma.loanApplication.count({
          where: { status: loanStatus }
        });
        
      } else {
        
        loanApplications = await prisma.loanApplication.findMany({
          skip: skip,
          take: take,
          select: {
            id: true,
            description: true,
            collateralDescription: true,
            requestedAmount: true,
            createdAt: true,
            status: true,
            loan: {
              select: {
                id: true,
                approvedAmount: true,
                status: true,
              },
            },
            attachments: {
              select: {
                id: true,
                documentType: true,
                fileUrl: true,
                uploadedAt: true,
              },
              orderBy: {
                uploadedAt: "desc",
              },
            },
            // Using the relation from your schema: 'borrower'
            borrower: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true, // Included so your frontend Table can show the profile pic
              },
            },
          },
          orderBy: { 
            createdAt: "desc" 
          },
        });
  
        // ==========================================
        // 2. Get total count for frontend pagination
        // ==========================================
        totalCount = await prisma.loanApplication.count();

      }

      const loansWithSignedAttachments = await Promise.all(
        (loanApplications || []).map((application) => withSignedAttachmentUrls(application))
      );

      return {
      
        loans: loansWithSignedAttachments,
        total: totalCount
      };
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      throw new Error("Gagal mengambil data pengajuan pinjaman.");
    }
  },

  async getLoanApplicationsByUserId(userId: string) {
    try {
      const applications = await prisma.loanApplication.findMany({
        where: {
          borrowerId: userId,
        },
        include: {
          loan: {
            select: {
              id: true,
              approvedAmount: true,
              status: true,
              dueDate: true, // This is already being fetched here
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const aggregate = await prisma.loan.aggregate({
        where: {
          application: {
            borrowerId: userId,
          },
        },
        _sum: {
          approvedAmount: true,
        },
      });

      return {
        totalLoanedValue: Number(aggregate._sum.approvedAmount || 0),
        applications: applications.map((app) => ({
          id: app.id,
          requestedAmount: Number(app.requestedAmount),
          status: app.status,
          description: app.description,
          createdAt: app.createdAt,
          // We extract dueDate here so the frontend doesn't have to reach into loanDetails
          dueDate: app.loan?.dueDate || null, 
          loanDetails: app.loan ? {
            loanId: app.loan.id,
            approvedAmount: Number(app.loan.approvedAmount),
            status: app.loan.status,
            dueDate: app.loan.dueDate,
          } : null,
          userid: userId
        })),
      };
    } catch (error) {
      console.error("Error in getLoanApplicationsByUserId:", error);
      throw new Error("Failed to fetch user loan statistics.");
    }
  },

  async approveLoanApplication(input: {
    applicationId: string;
    adminId: string;
    approvedAmount: number;
    notes?: string | null;
  }) {
    const approvedAmount = new Prisma.Decimal(input.approvedAmount);
    const approvedAt = new Date();
    const dueDate = new Date(approvedAt);
    dueDate.setFullYear(dueDate.getFullYear() + 1);

    return prisma.$transaction(async (tx) => {
      const application = await tx.loanApplication.findUnique({
        where: { id: input.applicationId },
        select: {
          id: true,
          borrowerId: true,
          status: true,
          loan: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!application) {
        throw new Error("APPLICATION_NOT_FOUND");
      }

      const updatedApplication = await tx.loanApplication.update({
        where: { id: input.applicationId },
        data: {
          status: LoanApplicationStatus.APPROVED,
        },
      });

      if (application.status !== LoanApplicationStatus.APPROVED) {
        await tx.applicationStatusHistory.create({
          data: {
            applicationId: input.applicationId,
            adminId: input.adminId,
            fromStatus: application.status,
            toStatus: LoanApplicationStatus.APPROVED,
            notes: input.notes || null,
          },
        });
      }

      const loan = await tx.loan.upsert({
        where: {
          applicationId: input.applicationId,
        },
        update: {
          approvedAmount,
          status: LoanStatus.ACTIVE,
        },
        create: {
          applicationId: input.applicationId,
          approvedAmount,
          status: LoanStatus.ACTIVE,
          approvedAt,
          dueDate,
        },
      });

      if (application.status !== LoanApplicationStatus.APPROVED) {
        await NotificationService.createLoanApprovalNotification(
          {
            borrowerId: application.borrowerId,
            applicationId: input.applicationId,
            approvedAmount: input.approvedAmount,
          },
          tx
        );
      }

      return {
        application: updatedApplication,
        loan: {
          ...loan,
          approvedAmount: Number(loan.approvedAmount),
        },
      };
    });
  },

  async rejectLoanApplication(input: {
    applicationId: string;
    adminId: string;
    notes?: string | null;
  }) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.loanApplication.findUnique({
        where: { id: input.applicationId },
        select: {
          id: true,
          borrowerId: true,
          status: true,
        },
      });

      if (!application) {
        throw new Error("APPLICATION_NOT_FOUND");
      }

      const updatedApplication = await tx.loanApplication.update({
        where: { id: input.applicationId },
        data: {
          status: LoanApplicationStatus.REJECTED,
        },
      });

      if (application.status !== LoanApplicationStatus.REJECTED) {
        await tx.applicationStatusHistory.create({
          data: {
            applicationId: input.applicationId,
            adminId: input.adminId,
            fromStatus: application.status,
            toStatus: LoanApplicationStatus.REJECTED,
            notes: input.notes || null,
          },
        });
      }

      if (application.status !== LoanApplicationStatus.REJECTED) {
        await NotificationService.createLoanRejectionNotification(
          {
            borrowerId: application.borrowerId,
            applicationId: input.applicationId,
            reason: input.notes,
          },
          tx
        );
      }

      return updatedApplication;
    });
  },
};
