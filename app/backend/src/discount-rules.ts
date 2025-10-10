/**
 * Discount Rules Module
 * 
 * This module contains the core business logic for calculating customer discounts
 * in the e-commerce system. It supports multiple customer tiers with different
 * discount rates.
 */

export type CustomerType = 'REGULAR' | 'VIP' | 'LOYALTY' | 'ENTERPRISE';

/**
 * Calculate the discounted amount based on customer type and purchase amount.
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
 * Get the discount percentage for a given customer type.
 * 
 * @param customerType - The type of customer
 * @returns The discount percentage as a decimal (e.g., 0.10 for 10%)
 */
export function getDiscountRate(customerType: CustomerType): number {
    switch (customerType) {
        case 'ENTERPRISE':
            return 0.15;
        case 'VIP':
            return 0.10;
        case 'LOYALTY':
            return 0.05;
        case 'REGULAR':
        default:
            return 0;
    }
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
 * 
 * @param customerType - The type of customer
 * @param amount - The original purchase amount
 * @returns The amount saved due to the discount
 */
export function calculateSavings(customerType: string, amount: number): number {
    const discountedAmount = calculateDiscount(customerType, amount);
    return amount - discountedAmount;
}
