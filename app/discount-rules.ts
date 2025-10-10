/**
 * Discount Rules Module
 * 
 * This module contains the core business logic for calculating customer discounts
 * in the e-commerce system. It supports multiple customer tiers with complex
 * discount rules including:
 * - Base discounts by customer type
 * - Tiered bonuses based on order amount
 * - Seasonal promotional multipliers
 * - Maximum discount caps per customer type
 */

export type CustomerType = 'REGULAR' | 'VIP' | 'LOYALTY' | 'ENTERPRISE';

export interface DiscountContext {
    customerType: CustomerType;
    amount: number;
    orderDate: Date;
    isPromotionalPeriod?: boolean;
}

export interface DiscountResult {
    baseDiscount: number;
    tierBonus: number;
    seasonalMultiplier: number;
    totalDiscount: number;
    finalAmount: number;
    originalAmount: number;
    savingsAmount: number;
    appliedCap: boolean;
}

/**
 * Calculate the discounted amount based on customer type and purchase amount.
 * Legacy function maintained for backward compatibility.
 * 
 * @param customerType - The type of customer (REGULAR, VIP, LOYALTY, or ENTERPRISE)
 * @param amount - The original purchase amount before discount
 * @returns The final amount after applying the appropriate discount
 */
export function calculateDiscount(customerType: string, amount: number): number {
    // VIP customers receive a 10% discount on all purchases
    if (customerType === 'VIP') {
        return amount * 0.9; // 10% discount
    }
    
    // Loyalty card holders receive a 5% discount on all purchases
    if (customerType === 'LOYALTY') {
        return amount * 0.95; // 5% discount
    }
    
    // ENTERPRISE customers receive a 15% discount on all purchases
    if (customerType === 'ENTERPRISE') {
        return amount * 0.85; // 15% discount
    }
    
    // Regular customers pay full price
    return amount;
}

/**
 * Calculate tiered discount with full context including seasonal multipliers and tier bonuses.
 * This is the primary discount calculation function for the new system.
 * 
 * Formula: totalDiscount = (baseDiscount × seasonalMultiplier) + tierBonus
 * Then apply maximum cap per customer type.
 * 
 * @param context - The discount calculation context
 * @returns Detailed breakdown of discount calculation
 */
export function calculateTieredDiscount(context: DiscountContext): DiscountResult {
    const baseDiscount = getBaseDiscount(context.customerType);
    const tierBonus = getTierBonus(context.amount);
    const seasonalMultiplier = context.isPromotionalPeriod ? 2.0 : 1.0;
    
    // Combine: (base * seasonal) + tier
    // Seasonal multiplier only applies to base discount, not tier bonuses
    let totalDiscount = (baseDiscount * seasonalMultiplier) + tierBonus;
    
    // Apply caps per customer type
    const maxDiscount = getMaxDiscountForCustomerType(context.customerType);
    const appliedCap = maxDiscount !== null && totalDiscount > maxDiscount;
    if (appliedCap) {
        totalDiscount = maxDiscount!;
    }
    
    const finalAmount = context.amount * (1 - totalDiscount);
    const savingsAmount = context.amount - finalAmount;
    
    return {
        baseDiscount,
        tierBonus,
        seasonalMultiplier,
        totalDiscount,
        finalAmount,
        originalAmount: context.amount,
        savingsAmount,
        appliedCap
    };
}

/**
 * Get the base discount rate for a customer type.
 * 
 * @param customerType - The type of customer
 * @returns The base discount rate as a decimal (e.g., 0.10 for 10%)
 */
export function getBaseDiscount(customerType: CustomerType): number {
    switch (customerType) {
        case 'ENTERPRISE':
            return 0.15; // 15% base discount
        case 'VIP':
            return 0.10; // 10% base discount
        case 'LOYALTY':
            return 0.05; // 5% base discount
        case 'REGULAR':
        default:
            return 0; // No base discount
    }
}

/**
 * Calculate tier bonus based on order amount.
 * 
 * Tier structure:
 * - $500-$999: 5% bonus
 * - $1000+: 10% bonus
 * 
 * @param amount - The order amount
 * @returns The tier bonus as a decimal
 */
export function getTierBonus(amount: number): number {
    if (amount >= 1000) {
        return 0.10; // 10% bonus for orders $1000+
    } else if (amount >= 500) {
        return 0.05; // 5% bonus for orders $500-$999
    }
    return 0; // No tier bonus for orders under $500
}

/**
 * Get the maximum allowed discount for a customer type.
 * 
 * @param customerType - The type of customer
 * @returns The maximum discount as a decimal, or null for no cap
 */
export function getMaxDiscountForCustomerType(customerType: CustomerType): number | null {
    switch (customerType) {
        case 'ENTERPRISE':
            return null; // No cap for ENTERPRISE customers
        case 'VIP':
            return 0.60; // 60% maximum
        case 'LOYALTY':
            return 0.50; // 50% maximum
        case 'REGULAR':
            return 0.40; // 40% maximum
        default:
            return 0.40;
    }
}

/**
 * Get the discount percentage for a given customer type.
 * Legacy function maintained for backward compatibility.
 * 
 * @param customerType - The type of customer
 * @returns The discount percentage as a decimal (e.g., 0.10 for 10%)
 */
export function getDiscountRate(customerType: CustomerType): number {
    return getBaseDiscount(customerType);
}

/**
 * Validate if a customer type is supported by the system.
 * 
 * @param customerType - The customer type to validate
 * @returns True if the customer type is valid, false otherwise
 */
export function isValidCustomerType(customerType: string): customerType is CustomerType {
    return ['REGULAR', 'VIP', 'LOYALTY', 'ENTERPRISE'].includes(customerType);
}

/**
 * Calculate the savings amount for a customer.
 * Legacy function maintained for backward compatibility.
 * 
 * @param customerType - The type of customer
 * @param amount - The original purchase amount
 * @returns The amount saved due to the discount
 */
export function calculateSavings(customerType: string, amount: number): number {
    const discountedAmount = calculateDiscount(customerType, amount);
    return amount - discountedAmount;
}
