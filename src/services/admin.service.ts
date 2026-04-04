import { prisma } from "@/lib/prisma";

export const AdminService = {
  async getDashboardSummary() {
    try {
      const loanApplications = await prisma.loanApplication.findMany({
        include: {
          borrower: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const donations = await prisma.donorFund.findMany({
        include: {
          donor: {
            select: {
              name: true,
              email: true,
            },
          },
          paymentTransactions: {
            select: {
              status: true,
              paymentType: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const safeLoans = loanApplications.map((loan) => ({
        ...loan,
        requestedAmount: Number(loan.requestedAmount),
      }));

      const safeDonations = donations.map((donation) => ({
        ...donation,
        amount: Number(donation.amount),
        remaining: Number(donation.remaining),
      }));

      const totalLoans = safeLoans.length;
      const pendingLoans = safeLoans.filter((loan) => loan.status === "PENDING").length;
      
      const totalDonations = safeDonations.length;
      const totalDonationAmount = safeDonations.reduce((sum, current) => sum + current.amount, 0);

      return {
        statistics: {
          totalLoans,
          pendingLoans,
          totalDonations,
          totalDonationAmount,
        },
        recentLoans: safeLoans,
        recentDonations: safeDonations,
      };
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw new Error("Gagal mengambil data rekapitulasi dashboard.");
    }
  },
  async updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED") {
    try {
      const updatedLoan = await prisma.loanApplication.update({
        where: { id: loanId },
        data: { status: status },
      });
      return updatedLoan;
    } catch (error) {
      console.error("Error updating loan status:", error);
      throw new Error("Gagal memperbarui status pinjaman.");
    }
  },
};