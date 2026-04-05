

export type Donation = {
    amount : number
    payment_method : string
    va_bank : string
}

export type PaymentMethod = 'qris' | 'va' | null;
export type VABank =
  | 'bca'
  | 'bri'
  | 'bni'
  | 'permata'
  | 'cimb'
  | 'mandiri_bill'
  | 'danamon'
  | 'bsi'
  | 'seabank';
export type TransactionType = 'donation' | 'repayment';