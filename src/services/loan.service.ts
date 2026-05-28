import { LoanApplicationStatus, LoanStatus, Prisma, RepaymentStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase";
import { batchGenerateSignedUrls } from "@/lib/supabase-batch";
import { LoanApplicationInput } from "@/schemas/loan.schema";
import { AccountVerificationService } from "@/services/account-verification.service";
import { NotificationService } from "@/services/notification.service";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "loan-documents";
const JAKARTA_TIME_ZONE = "Asia/Jakarta";

function toJakartaDateKey(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAKARTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function differenceInJakartaCalendarDays(from: Date, to: Date) {
  const fromKey = toJakartaDateKey(from);
  const toKey = toJakartaDateKey(to);

  const fromUtc = new Date(`${fromKey}T00:00:00.000Z`);
  const toUtc = new Date(`${toKey}T00:00:00.000Z`);

  return Math.round((toUtc.getTime() - fromUtc.getTime()) / 86400000);
}

/**
 * OPTIMIZED: Batch generates signed URLs for all attachments in all loans
 * BEFORE: 60-300 Supabase API calls per page load (Promise.all per loan)
 * AFTER: 1-3 API calls total (batch all paths first)
 * 
 * @param applications - Array of loan applications with attachments
 * @returns Applications with signed URLs
 */
async function withSignedAttachmentUrls<
  T extends { attachments?: { id: string; fileUrl: string }[] }[]
>(applications: T): Promise<T> {
  // Collect all unique file paths first
  const allPaths = new Set<string>();
  for (const app of applications) {
    if (app.attachments) {
      app.attachments.forEach((att) => {
        if (att.fileUrl) allPaths.add(att.fileUrl);
      });
    }
  }

  // Generate all signed URLs in batch (1-3 API calls instead of N*M)
  const signedUrlMap = await batchGenerateSignedUrls(Array.from(allPaths));

  // Map signed URLs back to attachments
  return applications.map((app) => ({
    ...app,
    attachments: (app.attachments || []).map((att) => ({
      ...att,
      fileUrl: signedUrlMap.get(att.fileUrl) || `/api/attachments/${att.id}`,
    })),
  })) as T;
}

export const LoanService = {
  async createLoanApplication(userId: string, data: LoanApplicationInput) {
    try {
      // Add verification check
      await AccountVerificationService.assertRoleVerified(userId, ROLES.BORROWER);

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
      // Handle verification errors
      if (error instanceof Error) {
        if (
          error.message === "ROLE_NOT_FOUND" ||
          error.message === "ACCOUNT_NOT_VERIFIED"
        ) {
          throw error;
        }
      }

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
            requestedAmount: true,
            createdAt: true,
            status: true,
            // Using the relation from your schema: 'borrower'
            borrower: {
              select: {
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
            requestedAmount: true,
            createdAt: true,
            status: true,
            // Using the relation from your schema: 'borrower'
            borrower: {
              select: {
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

      const loansWithSignedAttachments = await withSignedAttachmentUrls(loanApplications || []);

      return {
      
        loans: loanApplications,
        total: totalCount
      };
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      throw new Error("Gagal mengambil data pengajuan pinjaman.");
    }
  },

  async getLoanApplicationsByUserId(userId: string) {
    try {
      // OPTIMIZED: Batch all 3 queries in single transaction
      // BEFORE: 3 sequential queries + N repayment queries
      // AFTER: 1 transaction with 3 queries in parallel
      const [applications, repaymentTotals, aggregate] = await prisma.$transaction([
        // Query 1: Get user's loan applications with loan details
        prisma.loanApplication.findMany({
          where: {
            borrowerId: userId,
          },
          include: {
            loan: {
              select: {
                id: true,
                approvedAmount: true,
                status: true,
                dueDate: true,
                approvedAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        
        // Query 2: Get repayment totals for all user's loans in batch
        prisma.repayment.groupBy({
          by: ["loanId"],
          where: {
            loan: {
              application: {
                borrowerId: userId,
              },
            },
            status: RepaymentStatus.CONFIRMED,
          },
          _sum: {
            amount: true,
          },
          orderBy: {
            loanId: "asc",
          },
        }),
        
        // Query 3: Get aggregate approved amount
        prisma.loan.aggregate({
          where: {
            application: {
              borrowerId: userId,
            },
          },
          _sum: {
            approvedAmount: true,
          },
        }),
      ]);

      const repaymentTotalsMap = new Map(
        repaymentTotals.map((entry) => [entry.loanId, Number(entry._sum?.amount || 0)])
      );

      return {
        totalLoanedValue: Number(aggregate._sum.approvedAmount || 0),
        applications: applications.map((app) => ({
          id: app.id,
          requestedAmount: Number(app.requestedAmount),
          status: app.status,
          description: app.description,
          createdAt: app.createdAt,
          dueDate: app.loan?.dueDate || null,
          loanDetails: app.loan
            ? {
                loanId: app.loan.id,
                approvedAmount: Number(app.loan.approvedAmount),
                status: app.loan.status,
                dueDate: app.loan.dueDate,
                approvedAt: app.loan.approvedAt,
                totalPaid: repaymentTotalsMap.get(app.loan.id) || 0,
              }
            : null,
          userid: userId,
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

  async getAllLoans(start: number, end: number, loanStatus?: LoanStatus) {
    try {
      const skip = Math.max(0, start);
      const take = Math.max(0, end - start);
      const whereClause = loanStatus ? { status: loanStatus } : {};

      const [loans, totalCount] = await prisma.$transaction([
        prisma.loan.findMany({
          where: whereClause,
          skip: skip,
          take: take,
          orderBy: {
            approvedAt: 'desc',
          },
          include: {
            application: {
              select: {
                description: true,
                borrower: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
            // 1. Sum the amount of repayments for each loan
            repayments: {
              where: {
                status: RepaymentStatus.CONFIRMED, // Adjust this to match your RepaymentStatus enum
              },
              select: {
                amount: true,
              },
            },
            _count: {
              select: { repayments: true },
            },
          },
        }),
        prisma.loan.count({
          where: whereClause,
        }),
      ]);

      // 2. Map the data to flatten the totalPaid field
      const formattedLoans = loans.map((loan) => {
        const totalPaid = loan.repayments.reduce(
          (sum, repayment) => sum + Number(repayment.amount),
          0
        );

        return {
          id: loan.id,
          applicationId: loan.applicationId,
          approvedAmount: loan.approvedAmount,
          status: loan.status,
          approvedAt: loan.approvedAt,
          dueDate: loan.dueDate,
          application: loan.application,
          _count: loan._count,
          totalPaid: totalPaid, // Now aligned with application field
        };
      });

      return {
        loans: formattedLoans,
        total: totalCount,
      };
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw new Error("Gagal mengambil data pinjaman.");
    }
  },

  async getBorrowersWithDueReminders() {
    try {
      const now = new Date();
      const upperBound = addDays(now, 15);

      const loans = await prisma.loan.findMany({
        where: {
          status: LoanStatus.ACTIVE,
          dueDate: {
            gte: now,
            lt: upperBound,
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        include: {
          application: {
            select: {
              borrower: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone_number: true,
                },
              },
            },
          },
          repayments: {
            where: {
              status: RepaymentStatus.CONFIRMED,
            },
            select: {
              amount: true,
            },
          },
        },
      });

      const reminders = loans
        .map((loan) => {
          const totalPaid = loan.repayments.reduce(
            (sum, repayment) => sum + Number(repayment.amount),
            0
          );
          const approvedAmount = Number(loan.approvedAmount);
          const remainingAmount = Math.max(approvedAmount - totalPaid, 0);
          const daysUntilDue = differenceInJakartaCalendarDays(now, loan.dueDate);

          return {
            loanId: loan.id,
            applicationId: loan.applicationId,
            borrowerId: loan.application.borrower.id,
            borrowerName: loan.application.borrower.name,
            borrowerEmail: loan.application.borrower.email,
            borrowerPhoneNumber: loan.application.borrower.phone_number,
            dueDate: loan.dueDate,
            approvedAmount,
            totalPaid,
            remainingAmount,
            daysUntilDue,
          };
        })
        .filter(
          (loan) =>
            loan.remainingAmount > 0 &&
            (loan.daysUntilDue === 14 || loan.daysUntilDue === 7)
        );

      return {
        dueIn14Days: reminders.filter((loan) => loan.daysUntilDue === 14),
        dueIn7Days: reminders.filter((loan) => loan.daysUntilDue === 7),
      };
    } catch (error) {
      console.error("Error fetching due reminder borrowers:", error);
      throw new Error("Gagal mengambil data peminjam jatuh tempo.");
    }
  },

  async getBorrowersWithDueReminderByDays(days: 7 | 14) {
    const result = await this.getBorrowersWithDueReminders();

    return days === 14 ? result.dueIn14Days : result.dueIn7Days;
  },

};
