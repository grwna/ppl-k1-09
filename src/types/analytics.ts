

export type Analytics = {
  monthlyDonations: {
    month: string; // "YYYY-MM"
    total: number;
  }[];

  monthlyDisbursement: {
    month: string; // "YYYY-MM"
    total: number;
  }[];
}