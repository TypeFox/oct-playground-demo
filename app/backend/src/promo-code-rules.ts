/**
 * Promotional Code Rules Module
 * 
 * This module handles promotional code validation and discount calculation.
 * Promo codes can be combined with tier discounts based on specific rules.
 */

import { CustomerType } from './types';

export interface PromoCode {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  allowedCustomerTypes?: CustomerType[];
  disablesTierBonuses: boolean;
  stacksWithSeasonalMultiplier: boolean;
  description: string;
  active: boolean;
}

export interface PromoCodeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  promoCode?: PromoCode;
}

export interface PromoCodeDiscount {
  promoCode: string;
  discountAmount: number;
  discountPercentage: number;
  appliedAfterTierDiscount: boolean;
}

const promoCodes: Map<string, PromoCode> = new Map();

export function initializePromoCodes(): void {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const sampleCodes: PromoCode[] = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 50,
      validFrom: now,
      validUntil: futureDate,
      usageCount: 0,
      disablesTierBonuses: false,
      stacksWithSeasonalMultiplier: true,
      description: 'Welcome discount - 10% off orders over $50',
      active: true
    },
    {
      code: 'SAVE20',
      discountType: 'FIXED_AMOUNT',
      discountValue: 20,
      minOrderAmount: 100,
      maxDiscountAmount: 20,
      validFrom: now,
      validUntil: futureDate,
      usageCount: 0,
      disablesTierBonuses: false,
      stacksWithSeasonalMultiplier: true,
      description: 'Save $20 on orders over $100',
      active: true
    },
    {
      code: 'VIP25',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minOrderAmount: 200,
      validFrom: now,
      validUntil: futureDate,
      usageCount: 0,
      allowedCustomerTypes: ['VIP', 'ENTERPRISE'],
      disablesTierBonuses: true,
      stacksWithSeasonalMultiplier: false,
      description: 'VIP exclusive - 25% off (disables tier bonuses)',
      active: true
    },
    {
      code: 'BULK50',
      discountType: 'FIXED_AMOUNT',
      discountValue: 50,
      minOrderAmount: 500,
      maxDiscountAmount: 50,
      validFrom: now,
      validUntil: futureDate,
      usageLimit: 100,
      usageCount: 0,
      disablesTierBonuses: false,
      stacksWithSeasonalMultiplier: true,
      description: 'Bulk order discount - $50 off orders over $500',
      active: true
    },
    {
      code: 'FREESHIP',
      discountType: 'FIXED_AMOUNT',
      discountValue: 15,
      minOrderAmount: 75,
      maxDiscountAmount: 15,
      validFrom: now,
      validUntil: futureDate,
      usageCount: 0,
      disablesTierBonuses: false,
      stacksWithSeasonalMultiplier: true,
      description: 'Free shipping equivalent - $15 off orders over $75',
      active: true
    }
  ];

  sampleCodes.forEach(code => {
    promoCodes.set(code.code.toUpperCase(), code);
  });
}

export function validatePromoCode(
  code: string,
  customerType: CustomerType,
  orderAmount: number
): PromoCodeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const promoCode = promoCodes.get(code.toUpperCase());

  if (!promoCode) {
    errors.push('Invalid promotional code');
    return { isValid: false, errors, warnings };
  }

  if (!promoCode.active) {
    errors.push('This promotional code is no longer active');
    return { isValid: false, errors, warnings };
  }

  const now = new Date();
  if (now < promoCode.validFrom) {
    errors.push('This promotional code is not yet valid');
    return { isValid: false, errors, warnings };
  }

  if (now > promoCode.validUntil) {
    errors.push('This promotional code has expired');
    return { isValid: false, errors, warnings };
  }

  if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
    errors.push('This promotional code has reached its usage limit');
    return { isValid: false, errors, warnings };
  }

  if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
    errors.push(`Minimum order amount of $${promoCode.minOrderAmount} required for this code`);
    return { isValid: false, errors, warnings };
  }

  if (promoCode.allowedCustomerTypes && !promoCode.allowedCustomerTypes.includes(customerType)) {
    errors.push(`This promotional code is only available for ${promoCode.allowedCustomerTypes.join(', ')} customers`);
    return { isValid: false, errors, warnings };
  }

  if (promoCode.disablesTierBonuses) {
    warnings.push('This promotional code disables tier bonuses. Only base discount and promo code will apply.');
  }

  if (!promoCode.stacksWithSeasonalMultiplier) {
    warnings.push('This promotional code does not stack with seasonal multipliers.');
  }

  return {
    isValid: true,
    errors,
    warnings,
    promoCode
  };
}

export function calculatePromoCodeDiscount(
  promoCode: PromoCode,
  amountAfterTierDiscount: number
): PromoCodeDiscount {
  let discountAmount = 0;

  if (promoCode.discountType === 'PERCENTAGE') {
    discountAmount = amountAfterTierDiscount * (promoCode.discountValue / 100);
  } else {
    discountAmount = promoCode.discountValue;
  }

  if (promoCode.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, promoCode.maxDiscountAmount);
  }

  discountAmount = Math.min(discountAmount, amountAfterTierDiscount);

  const discountPercentage = amountAfterTierDiscount > 0
    ? (discountAmount / amountAfterTierDiscount) * 100
    : 0;

  return {
    promoCode: promoCode.code,
    discountAmount,
    discountPercentage,
    appliedAfterTierDiscount: true
  };
}

export function incrementPromoCodeUsage(code: string): void {
  const promoCode = promoCodes.get(code.toUpperCase());
  if (promoCode) {
    promoCode.usageCount++;
  }
}

export function getActivePromoCodes(): PromoCode[] {
  const now = new Date();
  return Array.from(promoCodes.values())
    .filter(code => 
      code.active && 
      now >= code.validFrom && 
      now <= code.validUntil &&
      (!code.usageLimit || code.usageCount < code.usageLimit)
    );
}

export function getPromoCode(code: string): PromoCode | undefined {
  return promoCodes.get(code.toUpperCase());
}

initializePromoCodes();
