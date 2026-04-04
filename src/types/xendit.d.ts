/**
 * Xendit API Types and Interfaces
 */

export interface XenditConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
}

export interface XenditCustomer {
  given_names: string;
  email?: string;
  mobile_number?: string;
  surname?: string;
  middle_name?: string;
  nationality?: string;
  phone_number?: string;
  addresses?: XenditAddress[];
}

export interface XenditAddress {
  country?: string;
  province?: string;
  city?: string;
  postal_code?: string;
  street_line1?: string;
  street_line2?: string;
}

export interface XenditInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  url?: string;
  description?: string;
  reference_id?: string;
}

export interface XenditInvoiceRequest {
  external_id: string;
  amount: number;
  description: string;
  invoice_expiry?: number;
  customer?: XenditCustomer;
  items?: XenditInvoiceItem[];
  payment_methods?: string[];
  should_send_email?: boolean;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  metadata?: Record<string, unknown>;
}

export interface XenditInvoiceResponse {
  id: string;
  external_id: string;
  user_id: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount: number;
  description: string;
  invoice_url: string;
  qr_code?: string;
  expiry_date: string;
  payment_methods: string[];
  payment_method?: string;
  payment_channel?: string;
  paid_at?: string;
  created?: string;
  updated?: string;
  customer?: XenditCustomer;
  items?: XenditInvoiceItem[];
  metadata?: Record<string, unknown>;
}

export interface XenditBankTransferRequest {
  external_id: string;
  bank_code: string;
  name: string;
  amount: number;
  description?: string;
  expected_bank_account_owner_name?: string;
  is_single_use?: boolean;
  should_validate_for_single_use_bank_account?: boolean;
}

export interface XenditBankTransferResponse {
  id: string;
  external_id: string;
  user_id: string;
  bank_code: string;
  account_number: string;
  merchant_name: string;
  amount: number;
  expected_bank_account_owner_name: string;
  expiration_date: string;
  status: string;
  is_single_use: boolean;
  created?: string;
}
