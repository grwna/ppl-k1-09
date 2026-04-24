import { LoanApplicationStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { LoanApplicationInput } from "@/schemas/loan.schema";

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

      return {
        data: {
          loans: loanApplications,
          total: totalCount
        }
      };
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      throw new Error("Gagal mengambil data pengajuan pinjaman.");
    }
  }
};