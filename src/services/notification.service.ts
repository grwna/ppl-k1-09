import { prisma } from "@/lib/prisma";
import { NotificationEmailService } from "@/services/notification-email.service";

type NotificationClient = Pick<typeof prisma, "notification" | "user">;

type LoanApplicationNotificationInput = {
  borrowerId: string;
  applicationId: string;
  approvedAmount?: string | number;
  reason?: string | null;
};

type LoanFundingNotificationInput = {
  borrowerId: string;
  donorId: string;
  loanId: string;
  amount: string | number;
};

type BorrowerLoanFundingNotificationInput = {
  borrowerId: string;
  loanId: string;
  amount: string | number;
};

type LatestNotificationsInput = {
  userId: string;
  limit?: number;
};

type NotificationPayload = {
  userId: string;
  type: string;
  message: string;
  scheduledAt: Date;
};

function formatAmount(amount: string | number) {
  return Number(amount).toLocaleString("id-ID");
}

function notificationSubject(type: string) {
  if (type === "LOAN_APPROVED") return "Loan application approved";
  if (type === "LOAN_REJECTED") return "Loan application rejected";
  if (type === "LOAN_FUNDING_ALLOCATED") return "Loan funding allocated";
  if (type === "DONATION_ALLOCATED") return "Donation allocated";
  return "New notification";
}

async function sendNotificationEmail(
  notification: NotificationPayload,
  client: NotificationClient
) {
  const user = await client.user.findUnique({
    where: { id: notification.userId },
    select: { email: true },
  });

  if (!user?.email) return;

  void NotificationEmailService.send({
    to: user.email,
    subject: notificationSubject(notification.type),
    message: notification.message,
  });
}

export const NotificationService = {
  async createLoanApprovalNotification(
    input: LoanApplicationNotificationInput,
    client: NotificationClient = prisma
  ) {
    const amountText =
      input.approvedAmount === undefined
        ? ""
        : ` dengan nominal Rp ${formatAmount(input.approvedAmount)}`;

    const data = {
      userId: input.borrowerId,
      type: "LOAN_APPROVED",
      message: `Pengajuan pinjaman ${input.applicationId} telah disetujui${amountText}.`,
      scheduledAt: new Date(),
    };

    const notification = await client.notification.create({
      data,
    });

    await sendNotificationEmail(data, client);

    return notification;
  },

  async createLoanRejectionNotification(
    input: LoanApplicationNotificationInput,
    client: NotificationClient = prisma
  ) {
    const reasonText = input.reason ? ` Alasan: ${input.reason}` : "";

    const data = {
      userId: input.borrowerId,
      type: "LOAN_REJECTED",
      message: `Pengajuan pinjaman ${input.applicationId} ditolak.${reasonText}`,
      scheduledAt: new Date(),
    };

    const notification = await client.notification.create({
      data,
    });

    await sendNotificationEmail(data, client);

    return notification;
  },

  async createLoanFundingNotifications(
    input: LoanFundingNotificationInput,
    client: NotificationClient = prisma
  ) {
    const amountText = formatAmount(input.amount);
    const scheduledAt = new Date();
    const data = [
      {
        userId: input.borrowerId,
        type: "LOAN_FUNDING_ALLOCATED",
        message: `Dana sebesar Rp ${amountText} telah dialokasikan ke pinjaman ${input.loanId}.`,
        scheduledAt,
      },
      {
        userId: input.donorId,
        type: "DONATION_ALLOCATED",
        message: `Donasi Anda sebesar Rp ${amountText} telah dialokasikan ke pinjaman ${input.loanId}.`,
        scheduledAt,
      },
    ];

    const result = await client.notification.createMany({
      data,
    });

    await Promise.all(data.map((notification) => sendNotificationEmail(notification, client)));

    return result;
  },

  async createBorrowerLoanFundingNotification(
    input: BorrowerLoanFundingNotificationInput,
    client: NotificationClient = prisma
  ) {
    const amountText = formatAmount(input.amount);
    const data = {
      userId: input.borrowerId,
      type: "LOAN_FUNDING_ALLOCATED",
      message: `Dana sebesar Rp ${amountText} telah dialokasikan ke pinjaman ${input.loanId}.`,
      scheduledAt: new Date(),
    };

    const notification = await client.notification.create({
      data,
    });

    await sendNotificationEmail(data, client);

    return notification;
  },

  async getLatestForUser(input: LatestNotificationsInput) {
    const limit = Math.min(Math.max(input.limit ?? 5, 1), 20);
    const now = new Date();

    const [notifications, pendingCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: input.userId,
          scheduledAt: {
            lte: now,
          },
        },
        orderBy: {
          scheduledAt: "desc",
        },
        take: limit,
        select: {
          id: true,
          type: true,
          message: true,
          scheduledAt: true,
          sentAt: true,
        },
      }),
      prisma.notification.count({
        where: {
          userId: input.userId,
          sentAt: null,
          scheduledAt: {
            lte: now,
          },
        },
      }),
    ]);

    return {
      pendingCount,
      notifications: notifications.map((notification) => ({
        ...notification,
        isPending: notification.sentAt === null,
      })),
    };
  },

  async getUndeliveredForUser(input: LatestNotificationsInput) {
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 50);
    const now = new Date();

    const notifications = await prisma.notification.findMany({
      where: {
        userId: input.userId,
        sentAt: null,
        scheduledAt: {
          lte: now,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: limit,
      select: {
        id: true,
        type: true,
        message: true,
        scheduledAt: true,
        sentAt: true,
      },
    });

    if (notifications.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: {
            in: notifications.map((notification) => notification.id),
          },
        },
        data: {
          sentAt: now,
        },
      });
    }

    return notifications.map((notification) => ({
      ...notification,
      isPending: true,
    }));
  },
};
