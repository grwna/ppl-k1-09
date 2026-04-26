import { prisma } from "@/lib/prisma";

export class DonorTrackingService {
  /**
   * Retrieves the detailed breakdown of where a specific donor's funds were allocated.
   * This handles the multi-donor to single loan tracking logic.
   * 
   * @param donorId The UUID of the authenticated donor user
   * @param limit Optional limit for pagination/recent views
   */
  static async getDonorDistributions(donorId?: string, limit?: number) {
    // We query LoanFunding where the connected DonorFund belongs to the requested donorId
    const fundings = await prisma.loanFunding.findMany({
      where: {
        sourceType: "DONOR",
        ...(donorId ? {
          donorFund: {
            donorId: donorId
          }
        } : {})
      },
      include: {
        loan: {
          include: {
            application: {
              include: {
                borrower: {
                  select: {
                    name: true,
                    image: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        // Since LoanFunding lacks a createdAt, we order by the Loan's approval or the application's creation
        loan: {
          approvedAt: "desc"
        }
      },
      take: limit
    });

    // Map the database response to the API contract format
    return fundings.map(funding => {
      const loan = funding.loan;
      const application = loan.application;
      const borrower = application.borrower;

      return {
        id: funding.id,
        loanId: funding.loanId,
        beneficiaryName: borrower.name,
        description: application.description,
        allocatedAmount: Number(funding.amount),
        allocatedAt: loan.approvedAt.toISOString()
      };
    });
  }
}
