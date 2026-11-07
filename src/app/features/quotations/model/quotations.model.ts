
export type QuotationStatus = 'Available' | 'Expired';

export interface Quotation {
  quotationId: string;
  customerName: string;
  insuranceCompany: string;
  premium: number;
  deductible: number;
  status: QuotationStatus;
}
