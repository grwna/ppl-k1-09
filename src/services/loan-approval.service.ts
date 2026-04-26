import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function processLoanApproval(data: {
  applicationId: string;
  status: "APPROVED" | "REJECTED";
  amount?: number;
  reason?: string;
  adminId: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.loanApplication.findUnique({
      where: { id: data.applicationId },
    });

    if (!application) {
      throw new Error("Data aplikasi tidak ditemukan");
    }

    if (application.status !== "PENDING") {
      throw new Error("Aplikasi sudah tidak berstatus PENDING");
    }

    if (data.status === "APPROVED" && data.amount) {
      const totalFundsNeeded = new Prisma.Decimal(data.amount);
      
      if (totalFundsNeeded.gt(application.requestedAmount)) {
        throw new Error("Nominal persetujuan tidak boleh melebihi nominal permintaan");
      }

      const availableFunds = await tx.donorFund.aggregate({
        _sum: { remaining: true },
        where: { remaining: { gt: 0 } },
      });

      const totalAvailable = availableFunds._sum.remaining || new Prisma.Decimal(0);

      if (totalAvailable.lt(totalFundsNeeded)) {
        throw new Error("Total dana donatur tidak mencukupi untuk nominal pinjaman ini");
      }

      await tx.loanApplication.update({
        where: { id: data.applicationId },
        data: { status: data.status },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: data.applicationId,
          adminId: data.adminId,
          fromStatus: "PENDING",
          toStatus: data.status,
          notes: data.reason || null,
        },
      });

      const dateNow = new Date();
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);

      const loan = await tx.loan.create({
        data: {
          applicationId: data.applicationId,
          approvedAmount: totalFundsNeeded,
          status: "ACTIVE",
          approvedAt: dateNow,
          dueDate: dueDate,
        },
      });

      let remainingToFund = totalFundsNeeded;
      
      const donorFunds = await tx.donorFund.findMany({
        where: { remaining: { gt: 0 } },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          remaining: true,
        },
      });

      for (const fund of donorFunds) {
        if (remainingToFund.lte(0)) {
          break;
        }

        const amountToTake = Prisma.Decimal.min(fund.remaining, remainingToFund);
        
        await tx.donorFund.update({
          where: { id: fund.id },
          data: { remaining: fund.remaining.minus(amountToTake) },
        });

        await tx.loanFunding.create({
          data: {
            loanId: loan.id,
            sourceType: "DONOR",
            donorFundId: fund.id,
            amount: amountToTake,
          },
        });

        remainingToFund = remainingToFund.minus(amountToTake);
      }
    } else {
      await tx.loanApplication.update({
        where: { id: data.applicationId },
        data: { status: data.status },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: data.applicationId,
          adminId: data.adminId,
          fromStatus: "PENDING",
          toStatus: data.status,
          notes: data.reason || null,
        },
      });
    }

    return true;
  });
}

export async function getAllLoanApplications() {
  const applications = await prisma.loanApplication.findMany({
    include: {
      borrower: true,
      attachments: true,
      loan: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return applications.map((app: any) => ({
    id: app.id,
    borrowerId: app.borrowerId,
    requestedAmount: Number(app.requestedAmount),
    description: app.description,
    collateralUrl: app.collateralUrl,
    collateralDescription: app.collateralDescription,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    borrower: {
      name: app.borrower?.name,
    },
    attachments: app.attachments.map((att: any) => ({
      id: att.id,
      documentType: att.documentType,
      fileUrl: att.fileUrl,
    })),
    approvedAmount: app.loan ? Number(app.loan.approvedAmount) : null,
  }));
}

export async function getAvailableDonorBalance() {
  const availableFunds = await prisma.donorFund.aggregate({
    _sum: { remaining: true },
    where: { remaining: { gt: 0 } },
  });
  return Number(availableFunds._sum.remaining || 0);
}