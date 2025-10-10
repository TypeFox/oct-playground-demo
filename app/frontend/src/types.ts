export type CustomerType = 'REGULAR' | 'VIP' | 'LOYALTY';

export interface DiscountRequest {
  customerType: CustomerType;
  amount: number;
}

export interface DiscountResponse {
  originalAmount: number;
  discountedAmount: number;
  discountPercentage: number;
  customerType: CustomerType;
}
