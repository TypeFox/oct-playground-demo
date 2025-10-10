/**
 * Business Validation Rules for Discount System
 * 
 * This module ensures discount calculations comply with business policies
 * and catches edge cases that require special handling.
 */

import { CustomerType } from './discount-rules';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Validate a discount request against business rules.
 * 
 * Validation rules:
 * 1. Amount must be positive
 * 2. Customer type must be valid (REGULAR, LOYALTY, VIP, ENTERPRISE)
 * 3. ENTERPRISE customers require minimum $5000 order (warning, downgrades to VIP)
 * 4. During promotional periods, orders under $100 don't get seasonal multiplier
 * 5. Tier bonuses only apply to orders $500+
 * 6. Large orders over $50,000 flagged for manual review
 * 
 * @param customerType - The customer type
 * @param amount - The order amount
 * @param orderDate - The order date
 * @returns Validation result with errors and warnings
 */
export function validateDiscountRequest(
    customerType: string,
    amount: number,
    orderDate: Date
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Rule 1: Amount must be positive
    if (amount <= 0) {
        errors.push('Order amount must be greater than zero');
    }
    
    // Rule 2: Valid customer type
    const validTypes: CustomerType[] = ['REGULAR', 'LOYALTY', 'VIP', 'ENTERPRISE'];
    if (!validTypes.includes(customerType as CustomerType)) {
        errors.push(`Invalid customer type: ${customerType}. Must be one of: ${validTypes.join(', ')}`);
    }
    
    // Rule 3: ENTERPRISE minimum (warning, will apply VIP pricing)
    if (customerType === 'ENTERPRISE' && amount < 5000) {
        warnings.push('Order below $5000 minimum for ENTERPRISE. Applying VIP pricing instead.');
    }
    
    // Rule 4: Promotional period minimum for seasonal multiplier
    const isPromotionalPeriod = checkPromotionalPeriod(orderDate);
    if (isPromotionalPeriod && amount < 100) {
        warnings.push('Orders under $100 do not qualify for seasonal multiplier during promotions');
    }
    
    // Rule 5: Tier bonus minimum (informational only)
    // Tier bonuses simply won't apply for orders under $500
    // This is handled automatically by getTierBonus() function
    
    // Rule 6: Large order review
    if (amount > 50000) {
        warnings.push('Large order flagged for manual review. Discount will be applied pending approval.');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Check if a given date falls within a promotional period.
 * 
 * Note: This is a simplified implementation. In production, this would
 * load promotional periods from config.json and check date ranges.
 * 
 * @param orderDate - The order date to check
 * @returns True if the date is within a promotional period
 */
function checkPromotionalPeriod(orderDate: Date): boolean {
    // TODO: Load from config.json promotional periods
    // Check if orderDate falls within any active promotional period
    
    // For demo purposes, check if it's Black Friday (last Friday of November)
    // or Cyber Monday (first Monday of December)
    const month = orderDate.getMonth();
    const date = orderDate.getDate();
    
    // Simplified check - in production, use config.json
    if (month === 10 && date >= 24 && date <= 30) { // Late November (Black Friday week)
        return true;
    }
    if (month === 11 && date >= 1 && date <= 5) { // Early December (Cyber Monday week)
        return true;
    }
    if (month === 11 && date >= 15) { // Holiday season (Dec 15-31)
        return true;
    }
    
    return false;
}

/**
 * Validate discount stacking rules.
 * 
 * Note: Promotional codes are handled separately and may have stacking restrictions.
 * See promo-code-rules.ts for details on how promo codes interact with tier discounts.
 * 
 * General rule: Promotional codes apply AFTER tier discounts are calculated.
 * Some promo codes may disable tier bonuses (check code.disablesTierBonuses flag).
 * 
 * @param hasPromoCode - Whether a promotional code is being applied
 * @param promoCodeDisablesTierBonuses - Whether the promo code disables tier bonuses
 * @returns Validation result
 */
export function validateDiscountStacking(
    hasPromoCode: boolean,
    promoCodeDisablesTierBonuses: boolean
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (hasPromoCode && promoCodeDisablesTierBonuses) {
        warnings.push('Promotional code disables tier bonuses. Only base discount and promo code will apply.');
    }
    
    return {
        isValid: true,
        errors,
        warnings
    };
}

/**
 * Validate that a customer type meets minimum order requirements.
 * 
 * @param customerType - The customer type
 * @param amount - The order amount
 * @returns The effective customer type to use (may be downgraded)
 */
export function getEffectiveCustomerType(
    customerType: CustomerType,
    amount: number
): CustomerType {
    // ENTERPRISE customers with orders under $5000 are treated as VIP
    if (customerType === 'ENTERPRISE' && amount < 5000) {
        return 'VIP';
    }
    
    return customerType;
}

/**
 * Check if an order qualifies for seasonal multiplier during promotional periods.
 * 
 * @param amount - The order amount
 * @param orderDate - The order date
 * @returns True if the order qualifies for seasonal multiplier
 */
export function qualifiesForSeasonalMultiplier(
    amount: number,
    orderDate: Date
): boolean {
    const isPromotionalPeriod = checkPromotionalPeriod(orderDate);
    
    // During promotional periods, orders must be at least $100 to qualify
    if (isPromotionalPeriod && amount < 100) {
        return false;
    }
    
    return isPromotionalPeriod;
}
