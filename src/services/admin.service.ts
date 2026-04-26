import { prisma } from "@/lib/prisma";

/**
 * TODO : 
 * 1. total loan funding (done)
 * 2. total disbursed (SUM approvedamount FROM Loan)
 * 3. pending applications (done)
 * 4. default rate : COUNT(*) FROM Loan.status = 'DEFAULTED' / COUNT(*) FROM Loan.status = 'ACTIVE'
 * 5. monthly donations/monthly disbursement (not done)
 * 6. logs : only logs the pending ones
 */

// export const AdminService = {
//   async getDashboardSummary() {
//     try {
//       const loanApplications = await prisma.loanApplication.findMany({
//         include: {
//           borrower: {
//             select: {
//               name: true,
//               email: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       const donations = await prisma.donorFund.findMany({
//         include: {
//           donor: {
//             select: {
//               name: true,
//               email: true,
//             },
//           },
//           paymentTransaction: {
//             select: {
//               status: true,
//               paymentType: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       const safeLoans = loanApplications.map((loan) => ({
//         ...loan,
//         requestedAmount: Number(loan.requestedAmount),
//       }));

//       const safeDonations = donations.map((donation) => ({
//         ...donation,
//         amount: Number(donation.amount),
//         remaining: Number(donation.remaining),
//       }));

//       const totalLoans = safeLoans.length;
//       const pendingLoans = safeLoans.filter((loan) => loan.status === "PENDING").length;
      
//       const totalDonations = safeDonations.length;
//       const totalDonationAmount = safeDonations.reduce((sum, current) => sum + current.amount, 0);

//       return {
//         statistics: {
//           totalLoans,
//           pendingLoans,
//           totalDonations,
//           totalDonationAmount,
//         },
//         recentLoans: safeLoans,
//         recentDonations: safeDonations,
//       };
//     } catch (error) {
//       console.error("Error fetching dashboard summary:", error);
//       throw new Error("Gagal mengambil data rekapitulasi dashboard.");
//     }
//   },
//   async updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED") {
//     try {
//       const updatedLoan = await prisma.loanApplication.update({
//         where: { id: loanId },
//         data: { status: status },
//       });
//       return updatedLoan;
//     } catch (error) {
//       console.error("Error updating loan status:", error);
//       throw new Error("Gagal memperbarui status pinjaman.");
//     }
//   },
// };

export const AdminService = {
  async getDashboardSummary() {
    try {
      // ===============================
      // 1. BASIC COUNTS
      // ===============================
      const totalLoans = await prisma.loanApplication.count();

      const pendingLoans = await prisma.loanApplication.count({
        where: { status: "PENDING" },
      });

      // ===============================
      // 2. TOTAL DONATIONS
      // ===============================
      const donationAgg = await prisma.donorFund.aggregate({
        _sum: { amount: true },
        _count: true,
      });

      // ===============================
      // 3. TOTAL DISBURSED
      // ===============================
      const disbursedAgg = await prisma.loan.aggregate({
        _sum: { approvedAmount: true },
      });

      // ===============================
      // 4. DEFAULT RATE
      // ===============================
      const defaultedCount = await prisma.loan.count({
        where: { status: "DEFAULTED" },
      });

      const activeCount = await prisma.loan.count({
        where: { status: "ACTIVE" },
      });

      const defaultRate =
        activeCount === 0 ? 0 : defaultedCount / activeCount;

      // ===============================
      // 5. MONTHLY DONATIONS
      // ===============================
      const monthlyDonationsRaw = await prisma.donorFund.groupBy({
        by: ["createdAt"],
        _sum: { amount: true },
        orderBy: { createdAt: "asc" },
      });

      const monthlyDonations = monthlyDonationsRaw.map((item) => ({
        month: item.createdAt.toISOString().slice(0, 7), // YYYY-MM
        total: Number(item._sum.amount || 0),
      }));

      // ===============================
      // 6. MONTHLY DISBURSEMENT
      // ===============================
      const monthlyDisbursementRaw = await prisma.loan.groupBy({
        by: ["approvedAt"],
        _sum: { approvedAmount: true },
        orderBy: { approvedAt: "asc" },
      });

      const monthlyDisbursement = monthlyDisbursementRaw.map((item) => ({
        month: item.approvedAt.toISOString().slice(0, 7),
        total: Number(item._sum.approvedAmount || 0),
      }));

      // ===============================
      // 7. PENDING LOGS
      // ===============================
      const pendingLogsRaw = await prisma.loanApplication.findMany({
        where: { status: "PENDING" },
        select: {
          id: true,
          requestedAmount: true,
          createdAt: true,
          borrower: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const pendingLogs = pendingLogsRaw.map((log) => ({
        id: log.id,
        borrower: log.borrower,
        requestedAmount: Number(log.requestedAmount),
        requestedAt: log.createdAt,
      }));

      // ===============================
      // FINAL RESPONSE
      // ===============================
      return {
        statistics: {
          totalLoans,
          pendingLoans,
          totalDonations: donationAgg._count,
          totalDonationAmount: Number(donationAgg._sum.amount || 0),
          totalDisbursed: Number(disbursedAgg._sum.approvedAmount || 0),
          defaultRate,
        },

        analytics: {
          monthlyDonations,
          monthlyDisbursement,
        },

        pending_logs: {
          pendingRequests: pendingLogs,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw new Error("Gagal mengambil data dashboard.");
    }
  },

  // TODO: INI GANTI KE WORKING HANDLER
  async updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED") {
    try {
      const updatedLoan = await prisma.loanApplication.update({
        where: { id: loanId },
        data: { status: status as any },
      });
      return updatedLoan;
    } catch (error) {
      console.error("Error updating loan status:", error);
      throw new Error("Gagal memperbarui status pinjaman.");
    }
  },
};