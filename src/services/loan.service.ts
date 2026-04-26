import { LoanApplicationStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { LoanApplicationInput } from "@/schemas/loan.schema";

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
  }
};
