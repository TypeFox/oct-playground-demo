export type CustomerType = 'REGULAR' | 'VIP' | 'LOYALTY' | 'ENTERPRISE';

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

export interface DiscountConfig {
  vipDiscount: number;
  loyaltyDiscount: number;
}
