# Scenario: Aligning on a New Feature with Stakeholder and Developer

## Context

### Conference presentation

Title: **Collaborative Editing Across Web Applications and Theia-based IDEs**

Collaboration in software projects shouldn't be limited to developers inside an IDE. With Eclipse Theia as the foundation and Eclipse Open Collaboration Tools (OCT) providing shared editing, we can now connect Theia-based IDEs with arbitrary web applications—making live collaboration a first-class experience for everyone involved in a project.

This talk will highlight how Theia enables real-time collaboration not only between developers, but also with project leads, stakeholders, and domain experts directly in their domain-specific tools. Key themes include:

- Why extending live sharing beyond IDEs to custom web applications changes team dynamics and accelerates feedback
- How OCT's Monaco integration enables shared editing and cross-application synchronization
- The OCT Playground as a lightweight environment to experiment with collaborative features
- Forward-looking opportunities for building truly collaborative development environments on top of Theia

Attendees will leave with a clear picture of how Theia can power collaborative development environments that bridge the gap between traditional IDE workflows and domain-specific web applications.

### Goals

During the presentation, I want to give a demo together with my colleague. I will share my screen and act like a stakeholder in a software development project. I don't have any IDE installed, but would like to collaborate on specific content with one of the senior engineers in the project.

- The scenario should make the advantages of OCT's web integration (as explained in the blog post) obvious.
- It should be realistic and closely related to how communication takes place in modern software projects.
- Ideally, the scenario also involves multiple files so we can show how changing the active editor is synchronized during the session.

Important: If the scenario is just about communication, a regular meeting without shared editing is sufficient. If it's just about editing something, it can be done independently. So we need a scenario where both communication and editing by both sides is crucial.

### Roles

 - You: Project stakeholder (no IDE, just browser). You care about business rules and documentation clarity.
 - Jan: Senior engineer (working in Theia IDE with OCT integration). He owns the technical implementation.

### Scene Setup

You call Jan to discuss urgent changes to the discount system. Marketing wants to launch a tiered discount promotion next week, but the current system only supports simple percentage discounts. The requirements are complex: tiered bonuses based on order amount, seasonal multipliers, discount stacking rules, and maximum caps per customer type. You need to ensure the new rules are both technically feasible and aligned with business strategy—and you need to finalize this today.

Jan starts an OCT session from Theia and sends you a room ID. You join via the OCT Playground in your browser.

## Act 1 – Discovering Complex Business Requirements

 - Jan opens discount-rules.ts in Theia. You see it instantly in the Playground.
 - The file contains basic logic:

```typescript
export function calculateDiscount(customerType: string, amount: number): number {
    if (customerType === 'VIP') {
        return amount * 0.9; // 10% discount
    }
    if (customerType === 'LOYALTY') {
        return amount * 0.95; // 5% discount
    }
    return amount;
}
```

 - You (stakeholder) start typing comments directly in the code:
   ```
   // URGENT: Marketing needs tiered discounts - spend $500 get extra 5%, spend $1000 get extra 10%
   // Question: Can VIP customers stack their 10% with tier bonuses? That could be 20% total!
   // Also need seasonal multipliers for Black Friday (2x all discounts)
   ```

 - Jan responds by typing:
   ```
   // Performance concern: Multiple discount calculations per order. Need to optimize.
   // Business question: What's the maximum discount allowed? 50%? 75%?
   ```

 - You both realize this needs a more sophisticated structure. Jan starts refactoring while you watch:

```typescript
interface DiscountContext {
    customerType: CustomerType;
    amount: number;
    orderDate: Date;
    isPromotionalPeriod?: boolean;
}

export function calculateTieredDiscount(context: DiscountContext): DiscountResult {
    // Base discount by customer type
    let baseDiscount = getBaseDiscount(context.customerType);
    
    // Tier bonus based on amount
    const tierBonus = getTierBonus(context.amount);
    
    // Seasonal multiplier
    const seasonalMultiplier = getSeasonalMultiplier(context.orderDate);
    
    // TODO: How do we combine these? Add? Multiply? Cap at max?
}
```

 - You type: `// Let's multiply base by seasonal, then ADD tier bonus. Cap at 50% for LOYALTY, 60% for VIP`
 - Jan types: `// That means a VIP spending $1000 on Black Friday gets: (10% * 2) + 10% = 30%. Correct?`
 - You type: `// Yes! But regular customers should cap at 40% even with tier bonuses`
 - Jan types: `// Got it. Let me add the calculation logic...`

 - Jan implements while you both see the code evolve:

```typescript
export function calculateTieredDiscount(context: DiscountContext): DiscountResult {
    const baseDiscount = getBaseDiscount(context.customerType);
    const tierBonus = getTierBonus(context.amount);
    const seasonalMultiplier = context.isPromotionalPeriod ? 2.0 : 1.0;
    
    // Combine: (base * seasonal) + tier
    let totalDiscount = (baseDiscount * seasonalMultiplier) + tierBonus;
    
    // Apply caps
    const maxDiscount = getMaxDiscountForCustomerType(context.customerType);
    totalDiscount = Math.min(totalDiscount, maxDiscount);
    
    return {
        baseDiscount,
        tierBonus,
        seasonalMultiplier,
        totalDiscount,
        finalAmount: context.amount * (1 - totalDiscount)
    };
}
```

 - You type: `// Perfect! But what about ENTERPRISE customers? They should get 15% base + no cap`
 - Jan types: `// Good point - let me add that customer type to the enum and update the logic`

Value shown: 
- Complex business logic requires real-time discussion and immediate clarification
- Both parties contribute domain knowledge (business rules + technical constraints)
- Comments become a conversation medium within the code itself
- Synchronous editing prevents misunderstandings about calculation logic
- Developer can implement while stakeholder validates business rules in real-time
- Questions are answered immediately, preventing costly rework

## Act 2 – Synchronizing Documentation with Complex Rules

 - Jan switches to README.md in Theia. Instantly, your Playground view follows.
 - The file contains simple feature documentation. You both need to update it with the complex new rules.
 - You start editing the discount tiers section:

```markdown
### Customer Discount Tiers

The system supports four customer types with sophisticated discount rules:

| Type | Base Discount | Tier Bonuses | Seasonal Multiplier | Max Total Discount |
|------|---------------|--------------|---------------------|-------------------|
| REGULAR | 0% | Yes | Yes | 40% |
| LOYALTY | 5% | Yes | Yes | 50% |
| VIP | 10% | Yes | Yes | 60% |
| ENTERPRISE | 15% | Yes | Yes | No cap |

#### Tier Bonuses (All Customer Types)
- Orders $500-$999: Additional 5% discount
- Orders $1000+: Additional 10% discount
```

 - Jan types: `Wait - do tier bonuses apply BEFORE or AFTER the seasonal multiplier?`
 - You type: `After! So it's (base * seasonal) + tier. Let me clarify...`
 - You add:

```markdown
#### Discount Calculation Formula

totalDiscount = (baseDiscount × seasonalMultiplier) + tierBonus
finalDiscount = min(totalDiscount, maxDiscountForCustomerType)

**Example:** VIP customer spending $1000 during Black Friday (2x seasonal):
- Base: 10%
- Seasonal: 10% × 2 = 20%
- Tier bonus: 10% (for $1000+ order)
- Total: 20% + 10% = 30%
- Final: 30% (under 60% VIP cap) ✓
```

 - Jan types: `Perfect! But we should add an example that HITS the cap to make it clear`
 - You type: `Good idea!` and add:

```markdown
**Example 2:** LOYALTY customer spending $1000 during Black Friday:
- Base: 5%
- Seasonal: 5% × 2 = 10%
- Tier bonus: 10%
- Total: 10% + 10% = 20%
- Final: 20% (under 50% LOYALTY cap) ✓

**Example 3:** REGULAR customer spending $1000 during Black Friday:
- Base: 0%
- Seasonal: 0% × 2 = 0%
- Tier bonus: 10%
- Total: 0% + 10% = 10%
- Final: 10% (under 40% REGULAR cap) ✓
```

 - Jan types: `Hmm, that last example shows regular customers only get tier bonuses. Is that what marketing wants?`
 - You type: `Actually, let me check... [pause] Yes, confirmed. Regular customers can still benefit from tier bonuses and promotions, just no base discount.`
 - Jan types: `Got it. That's actually a nice incentive for them to upgrade to LOYALTY.`

Value shown: 
- Cross-file navigation is synchronized automatically
- Complex business rules require detailed documentation with examples
- Both parties validate that documentation matches implementation
- Real-time discussion catches potential misunderstandings
- Stakeholder ensures customer-facing language is clear
- Developer ensures technical accuracy of formulas and examples
- Examples are refined collaboratively to cover edge cases

## Act 3 – Complex Configuration Structure

 - Jan switches to config.json. Your view follows instantly.
 - The current config is too simple for the new requirements:

```json
{
  "discountRules": {
    "vipDiscount": 0.10,
    "loyaltyDiscount": 0.05
  },
  "currency": "USD",
  "minimumOrderAmount": 0,
  "maxDiscountPerOrder": 1000
}
```

 - You type in the file: `// Need to restructure this for tiered system`
 - Jan types: `// Let me create a proper structure...` and starts refactoring:

```json
{
  "customerTypes": {
    "REGULAR": {
      "baseDiscount": 0.0,
      "maxTotalDiscount": 0.40,
      "allowTierBonuses": true,
      "allowSeasonalMultiplier": true
    },
    "LOYALTY": {
      "baseDiscount": 0.05,
      "maxTotalDiscount": 0.50,
      "allowTierBonuses": true,
      "allowSeasonalMultiplier": true
    },
    "VIP": {
      "baseDiscount": 0.10,
      "maxTotalDiscount": 0.60,
      "allowTierBonuses": true,
      "allowSeasonalMultiplier": true
    }
  }
}
```

 - You type: `// Add ENTERPRISE with 15% base and no cap`
 - Jan adds:

```json
    "ENTERPRISE": {
      "baseDiscount": 0.15,
      "maxTotalDiscount": null,
      "allowTierBonuses": true,
      "allowSeasonalMultiplier": true
    }
```

 - You type: `// Now add the tier thresholds`
 - Jan continues:

```json
  "tierBonuses": [
    {
      "minAmount": 500,
      "maxAmount": 999.99,
      "bonusDiscount": 0.05
    },
    {
      "minAmount": 1000,
      "maxAmount": null,
      "bonusDiscount": 0.10
    }
  ]
```

 - You type: `// What about seasonal periods? Black Friday, Cyber Monday, etc.`
 - Jan types: `// Good point. Let me add a promotional periods section:`

```json
  "promotionalPeriods": [
    {
      "name": "Black Friday",
      "startDate": "2024-11-29",
      "endDate": "2024-11-29",
      "seasonalMultiplier": 2.0,
      "enabled": true
    },
    {
      "name": "Cyber Monday",
      "startDate": "2024-12-02",
      "endDate": "2024-12-02",
      "seasonalMultiplier": 2.0,
      "enabled": true
    },
    {
      "name": "Holiday Season",
      "startDate": "2024-12-15",
      "endDate": "2024-12-31",
      "seasonalMultiplier": 1.5,
      "enabled": true
    }
  ]
```

 - You type: `// Perfect! But we need a way to disable specific promotions if needed`
 - Jan types: `// Already added "enabled" flag - we can toggle without deleting the config`
 - You type: `// Smart! Also add currency and minimum order`
 - Jan completes:

```json
  "currency": "USD",
  "minimumOrderAmount": 0,
  "businessRules": {
    "allowDiscountStacking": true,
    "requireMinimumForTierBonus": false,
    "applySeasonalToBaseOnly": true
  }
}
```

 - You type: `// Wait, what does "applySeasonalToBaseOnly" mean?`
 - Jan types: `// It means seasonal multiplier only applies to base discount, not tier bonuses. That's what we agreed in Act 1.`
 - You type: `// Right! Just wanted to make sure. This looks good.`

Value shown:
- Complex nested configuration requires careful structuring
- Stakeholder proposes business requirements, developer implements valid JSON
- Real-time validation prevents syntax errors
- Both parties ensure configuration matches code implementation
- Configuration becomes self-documenting with clear field names
- Edge cases are discussed and resolved immediately (null for no cap, enabled flags, etc.)
- Business rules are made explicit in configuration

## Act 4 – Validation Rules and Edge Cases

 - Jan types in chat: `We should add a validation file to ensure business rules are enforced`
 - You type: `Good idea - I want to make sure we catch invalid combinations`
 - Jan creates a new file: validation-rules.ts and shares it. Your view switches to the new file.

```typescript
/**
 * Business validation rules for discount system
 * These rules ensure discount calculations comply with business policies
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export function validateDiscountRequest(
    customerType: string,
    amount: number,
    orderDate: Date
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // TODO: Add validation rules
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
```

 - You start typing validation rules as comments:
   ```
   // 1. Amount must be positive
   // 2. Customer type must be valid (REGULAR, LOYALTY, VIP, ENTERPRISE)
   // 3. ENTERPRISE customers require minimum $5000 order
   // 4. During promotional periods, orders under $100 don't get seasonal multiplier
   // 5. Tier bonuses only apply to orders $500+
   ```

 - Jan types: `// Let me implement these...` and starts coding:

```typescript
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
    const validTypes = ['REGULAR', 'LOYALTY', 'VIP', 'ENTERPRISE'];
    if (!validTypes.includes(customerType)) {
        errors.push(`Invalid customer type: ${customerType}`);
    }
    
    // Rule 3: ENTERPRISE minimum
    if (customerType === 'ENTERPRISE' && amount < 5000) {
        errors.push('ENTERPRISE customers require minimum order of $5000');
    }
```

 - You type: `// Wait - should that be an error or just downgrade them to VIP pricing?`
 - Jan types: `// Good question. What's the business rule?`
 - You type: `// Let's make it a warning and apply VIP pricing instead. We don't want to lose the sale.`
 - Jan updates:

```typescript
    // Rule 3: ENTERPRISE minimum (warning, will apply VIP pricing)
    if (customerType === 'ENTERPRISE' && amount < 5000) {
        warnings.push('Order below $5000 minimum for ENTERPRISE. Applying VIP pricing instead.');
    }
```

 - Jan continues:

```typescript
    // Rule 4: Promotional period minimum for seasonal multiplier
    const isPromotionalPeriod = checkPromotionalPeriod(orderDate);
    if (isPromotionalPeriod && amount < 100) {
        warnings.push('Orders under $100 do not qualify for seasonal multiplier during promotions');
    }
    
    // Rule 5: Tier bonus minimum
    if (amount < 500) {
        // This is informational, not a warning
        // Tier bonuses simply won't apply
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
```

 - You type: `// Should we add a maximum order amount check? For fraud prevention?`
 - Jan types: `// Good idea. What's the threshold?`
 - You type: `// Let's flag orders over $50,000 for manual review`
 - Jan adds:

```typescript
    // Rule 6: Large order review
    if (amount > 50000) {
        warnings.push('Large order flagged for manual review. Discount will be applied pending approval.');
    }
```

 - You type: `// Also, what if someone tries to use a promotional code with these discounts?`
 - Jan types: `// That's a separate system, but we should add a note about stacking rules`
 - Jan adds a comment:

```typescript
/**
 * Note: Promotional codes are handled separately and may have stacking restrictions.
 * See promo-code-rules.ts for details on how promo codes interact with tier discounts.
 * 
 * General rule: Promotional codes apply AFTER tier discounts are calculated.
 * Some promo codes may disable tier bonuses (check code.disablesTierBonuses flag).
 */
```

 - You type: `// Perfect. This covers all the edge cases we discussed with marketing.`
 - Jan types: `// Agreed. Let me add one more function for checking promotional periods...`

```typescript
function checkPromotionalPeriod(orderDate: Date): boolean {
    // Load from config.json promotional periods
    // Check if orderDate falls within any active promotional period
    return false; // TODO: Implement
}
```

Value shown:
- New file creation is synchronized across participants
- Complex business validation rules require discussion of edge cases
- Stakeholder identifies business scenarios that need handling
- Developer implements technical validation logic
- Real-time discussion resolves ambiguities (error vs warning, thresholds, etc.)
- Both parties ensure all edge cases from marketing requirements are covered
- Documentation is added inline to clarify complex interactions
- The validation file becomes a living document of business rules

## Act 5 – Wrap-Up and Verification

 - Jan types in chat: `Let's review what we've built together`
 - You both navigate back through the files:

**discount-rules.ts:**
- ✅ Complex tiered discount calculation with seasonal multipliers
- ✅ Support for 4 customer types with different caps
- ✅ Proper formula: (base × seasonal) + tier, capped at max
- ✅ Returns detailed breakdown for transparency

**README.md:**
- ✅ Comprehensive documentation with discount matrix
- ✅ Clear calculation formula with multiple examples
- ✅ Examples that demonstrate both normal cases and cap scenarios
- ✅ Customer-facing language validated by stakeholder

**config.json:**
- ✅ Structured configuration for all customer types
- ✅ Flexible tier bonus thresholds
- ✅ Promotional period definitions with enable/disable flags
- ✅ Business rules made explicit and configurable

**validation-rules.ts:**
- ✅ Comprehensive validation covering all edge cases
- ✅ Distinction between errors (blocking) and warnings (informational)
- ✅ Special handling for ENTERPRISE customers
- ✅ Fraud prevention for large orders
- ✅ Documentation of interaction with promo code system

 - You type: `// This is exactly what marketing needs. And we did it in one session!`
 - Jan types: `// Agreed. Without this real-time collaboration, we would have had multiple rounds of revisions.`
 - You type: `// The key was being able to discuss trade-offs immediately - like the ENTERPRISE minimum being a warning vs error.`
 - Jan types: `// And you could validate the business logic as I coded it. Saved us from implementing the wrong formula.`

**Summary of what synchronous collaboration enabled:**

1. **Immediate clarification of complex requirements** - No waiting for email responses about calculation formulas
2. **Real-time validation of business logic** - Stakeholder caught the ENTERPRISE edge case immediately
3. **Collaborative problem-solving** - Both parties contributed to the solution (e.g., seasonal multiplier application)
4. **Prevention of costly rework** - Formula was validated before implementation was complete
5. **Comprehensive edge case coverage** - Discussion surfaced scenarios neither party had initially considered
6. **Aligned documentation** - README examples were validated against actual implementation
7. **Flexible configuration design** - Config structure evolved through discussion of business needs
8. **Shared understanding** - Both parties now fully understand the system, not just their part

**Why asynchronous communication would have failed:**

- Complex formula would require multiple clarification rounds
- Edge cases would be discovered during testing, requiring rework
- Documentation might not match implementation
- Configuration structure might not support all business needs
- Validation rules might miss important scenarios
- Overall: 3-5 days of back-and-forth vs. 1 hour of synchronous collaboration

**Value demonstrated:**

✅ Complex business logic requires synchronous discussion
✅ Multiple files edited collaboratively with synchronized navigation
✅ Both technical and business expertise needed simultaneously
✅ Real-time validation prevents expensive mistakes
✅ Edge cases discovered and resolved immediately
✅ No IDE setup required for stakeholder
✅ True collaboration on code, docs, config, and validation rules
