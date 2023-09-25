export interface TutorialBreadcrumb {
  id: "KINGSPAY" | "TUTORIALS" | "MERCHANT" | "INSTITUTION" | "POS";
  title: string;
  url: string;
  active: boolean;
}
export interface PaymentFormData {
  name: string;
  number: string;
  date: string;
  cvv: string;
  pin?: string;
}

export interface UnifiedPaymentFormData {
  card_number: string;
  cardholder: string;
  cvv: string;
  expiry: string;
  pin?: string;
}
export interface PaymentFormDataAndStatus {
  data: PaymentFormData;
  status: boolean;
}

export interface PerformRequestData {
  path: string;
  method: string;
  data?: any;
  params?: any;
}

export interface PerformRequestHeaders {
  Accept: string;
  "Content-Type": string;
}

export interface RequestData {
  headers: PerformRequestHeaders;
  responseType: string;
  withCredentials: boolean;
  method: string;
  url: string;
  params?: any;
  data?: any;
}

export interface MerchantData {
  amount: string;
  currencty: string;
  merchantName: string;
  merchant_callback_url: string;
  customer_email: string;
  customer_name: string;
  environment: string;
  status: string;
  transactionId: string;
  description: string;
  payment_id: string;
  currency: string;
  three_d_secure_data?: { asc_url: string; md: string; pa_req: string };
  message?: string;
}

export interface InterswitchResponseData {
  card_data: PaymentFormData;
  email: string;
  paymentId: string;
}

export interface CardDetailsData {
  pan: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  card_holder?: string;
  pin?: string;
}

export interface ThreeDSecureData {
  asc_url: string;
  eci_flag: string;
  md: string;
  pa_req: string;
  payment_id: string;
  term_url: string;
}

export interface PaymentStripeData {
  publishableKey: string;
  stripeClientSecret: string;
}

export interface FormFieldData {
  name: string;
  type: string;
  mask?: string;
  value?: string;
  error?: string;
  placeholder?: string;
  pattern?: string;
  hint?: string;
  disabled?: boolean;
  minlength?: number;
  maxlength?: number;
  counter?: boolean;
  label?: string;
  class?: string;
  options?: Array<{ title: string; value: string }>;
  required?: boolean;
}
