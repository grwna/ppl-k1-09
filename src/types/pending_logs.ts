

export type PendingLogs = {
  pendingRequests: {
    id: string;
    borrower: {
      name: string;
      email: string;
    };
    requestedAmount: number;
    requestedAt: Date;
  }[];
}