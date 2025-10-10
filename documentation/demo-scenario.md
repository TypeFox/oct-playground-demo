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

You call Jan on a video call to discuss urgent changes to the discount system. Marketing wants to launch a tiered discount promotion next week, but the current system only supports simple percentage discounts. The requirements are complex: tiered bonuses based on order amount, seasonal multipliers, discount stacking rules, and maximum caps per customer type. You need to ensure the new rules are both technically feasible and aligned with business strategy—and you need to finalize this today.

Jan starts an OCT session from Theia and sends you a room ID. You join via the OCT Playground in your browser. You're both on the video call and can see each other's cursors in the shared editor.

**Presentation Note:** During the demo, you and Jan will speak naturally to each other over the video call while simultaneously editing the shared files. The audience will see both your screen (OCT Playground in browser) and hear your conversation. This demonstrates how voice communication + shared editing creates a powerful collaboration experience that's impossible with either tool alone.

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

 - **You (on call):** "Okay, so this is what we have now. But marketing needs something more complex. They want tiered discounts—like if you spend $500, you get an extra 5%, and if you spend $1000, you get an extra 10%."
 
 - **Jan:** "Interesting. So that would stack with the VIP discount? A VIP spending $1000 would get 10% plus 10%?"
 
 - **You:** "Exactly! And they also want seasonal multipliers for Black Friday—like 2x all discounts."
 
 - **Jan:** "Hmm, that could get complicated. Let me think about the formula..." *(starts typing a comment in the code)*
   ```typescript
   // TODO: Need to figure out: (base * seasonal) + tier? Or (base + tier) * seasonal?
   ```

 - **You:** "What's the difference?"
 
 - **Jan:** "Well, if we multiply the base by seasonal first, then add tier bonuses, a VIP on Black Friday would get (10% × 2) + 10% = 30%. But if we add first then multiply, it would be (10% + 10%) × 2 = 40%."
 
 - **You:** "Oh! Yeah, let's do the first one—multiply base by seasonal, then add tier. That seems more reasonable. But we need caps, right? We can't give away 50% discounts."
 
 - **Jan:** "Good point. What should the caps be?"
 
 - **You:** "Let's say... 40% for regular customers, 50% for loyalty, 60% for VIP."
 
 - **Jan:** "Got it. Let me refactor this..." *(starts coding while you watch)*

```typescript
interface DiscountContext {
    customerType: CustomerType;
    amount: number;
    orderDate: Date;
    isPromotionalPeriod?: boolean;
}

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

 - **You:** "Wait, what about our enterprise customers? They should get better treatment—maybe 15% base and no cap?"
 
 - **Jan:** "No cap at all? That could be risky..."
 
 - **You:** "Well, enterprise orders are huge—minimum $5,000. We can afford to be generous."
 
 - **Jan:** "Fair enough. Let me add that customer type..." *(adds ENTERPRISE to the enum and updates the logic)*

Value shown: 
- Complex business logic requires real-time discussion and immediate clarification
- Both parties contribute domain knowledge (business rules + technical constraints)
- Voice communication allows natural back-and-forth about trade-offs
- Synchronous editing prevents misunderstandings about calculation logic
- Developer can implement while stakeholder validates business rules in real-time
- Questions are answered immediately, preventing costly rework

## Act 2 – Synchronizing Documentation with Complex Rules

 - **Jan:** "Okay, let me switch to the README so we can document this..." *(switches to README.md in Theia)*
 - Your Playground view instantly follows to the same file.
 
 - **Jan:** "I'll start with a table showing all the customer types..."
 - You watch as Jan types the table structure, then you jump in and start editing:

```markdown
### Customer Discount Tiers

The system supports four customer types with sophisticated discount rules:

| Type | Base Discount | Tier Bonuses | Seasonal Multiplier | Max Total Discount |
|------|---------------|--------------|---------------------|-------------------|
| REGULAR | 0% | Yes | Yes | 40% |
| LOYALTY | 5% | Yes | Yes | 50% |
| VIP | 10% | Yes | Yes | 60% |
| ENTERPRISE | 15% | Yes | Yes | No cap |
```

 - **You:** "Let me add the tier bonus info..." *(types tier bonus section)*
   ```markdown
   #### Tier Bonuses (All Customer Types)
   - Orders $500-$999: Additional 5% discount
   - Orders $1000+: Additional 10% discount
   ```

 - **Jan:** "Wait, we should clarify the formula. Do tier bonuses apply before or after the seasonal multiplier?"
 
 - **You:** "After! Remember, we said (base times seasonal) plus tier. Let me add that..." *(starts typing the formula)*

```markdown
#### Discount Calculation Formula

totalDiscount = (baseDiscount × seasonalMultiplier) + tierBonus
finalDiscount = min(totalDiscount, maxDiscountForCustomerType)
```

 - **Jan:** "Good. We should add examples. Let me do a VIP on Black Friday..." *(types example)*

```markdown
**Example:** VIP customer spending $1000 during Black Friday (2x seasonal):
- Base: 10%
- Seasonal: 10% × 2 = 20%
- Tier bonus: 10% (for $1000+ order)
- Total: 20% + 10% = 30%
- Final: 30% (under 60% VIP cap) ✓
```

 - **You:** "Perfect! But we should show an example where someone hits the cap, so it's really clear."
 
 - **Jan:** "Good idea. And maybe one for regular customers too, since they have no base discount."
 
 - **You:** "Yeah, let me add those..." *(types two more examples)*

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

 - **Jan:** "Hmm, so regular customers only get tier bonuses, no base discount. Is that really what marketing wants?"
 
 - **You:** "Yeah, it's intentional. It gives them an incentive to upgrade to loyalty. They can still save money on big orders, but loyalty members get more."
 
 - **Jan:** "Makes sense. That's actually pretty smart."

Value shown: 
- Cross-file navigation is synchronized automatically
- Complex business rules require detailed documentation with examples
- Both parties validate that documentation matches implementation
- Voice communication allows natural discussion of edge cases
- Stakeholder ensures customer-facing language is clear
- Developer ensures technical accuracy of formulas and examples
- Examples are refined collaboratively in real-time

## Act 3 – Complex Configuration Structure

 - **Jan:** "Now we need to update the config file to match all this..." *(switches to config.json)*
 - Your view follows instantly. You see the current simple config:

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

 - **You:** "Yeah, this won't work anymore. We need to restructure it."
 
 - **Jan:** "Right. Let me create a proper structure for customer types..." *(starts typing)*

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

 - **You:** "Don't forget ENTERPRISE—15% base and no cap. How do we represent 'no cap'?"
 
 - **Jan:** "We can use null for that..." *(adds ENTERPRISE)*

```json
    "ENTERPRISE": {
      "baseDiscount": 0.15,
      "maxTotalDiscount": null,
      "allowTierBonuses": true,
      "allowSeasonalMultiplier": true
    }
```

 - **You:** "Perfect. Now we need the tier thresholds—$500 and $1000."
 
 - **Jan:** "I'll add those as an array..." *(types tier bonuses section)*

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

 - **You:** "Great! And we need the promotional periods—Black Friday, Cyber Monday, Holiday Season."
 
 - **Jan:** "Okay, let me add those with dates..." *(adds promotional periods)*

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

 - **You:** "Nice! I like that you added an 'enabled' flag. So we can turn off a promotion without deleting it?"
 
 - **Jan:** "Exactly. Makes it easier to manage."
 
 - **You:** "Smart. Should we add anything else?"
 
 - **Jan:** "Maybe a business rules section to make our policies explicit..." *(adds final section)*

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

 - **You:** "What's 'applySeasonalToBaseOnly'?"
 
 - **Jan:** "That's the rule we decided earlier—seasonal multiplier only applies to the base discount, not the tier bonuses."
 
 - **You:** "Oh right! Yeah, that's important to document. This looks good!"

Value shown:
- Complex nested configuration requires careful structuring
- Voice communication allows natural discussion of structure decisions
- Real-time validation prevents syntax errors
- Both parties ensure configuration matches code implementation
- Configuration becomes self-documenting with clear field names
- Edge cases are discussed and resolved immediately (null for no cap, enabled flags)
- Business rules are made explicit in configuration

## Act 4 – Validation Rules and Edge Cases

 - **Jan:** "We should probably add some validation to catch edge cases. Let me create a new file..." *(creates validation-rules.ts)*
 - Your view switches to the new file automatically.

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

 - **You:** "Good idea. What kind of validation do we need?"
 
 - **Jan:** "Well, basic stuff like positive amounts, valid customer types..."
 
 - **You:** "And ENTERPRISE customers need a minimum order of $5,000, right?"
 
 - **Jan:** "Right. Let me add those..." *(starts implementing validation rules)*

```typescript
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

 - **You:** "Wait, should that be an error? What if an enterprise customer wants to make a small order? We'd just reject it?"
 
 - **Jan:** "Good point. What should we do?"
 
 - **You:** "Let's make it a warning and just give them VIP pricing instead. We don't want to lose the sale."
 
 - **Jan:** "Smart. So downgrade them automatically..." *(updates the code)*

```typescript
    // Rule 3: ENTERPRISE minimum (warning, will apply VIP pricing)
    if (customerType === 'ENTERPRISE' && amount < 5000) {
        warnings.push('Order below $5000 minimum for ENTERPRISE. Applying VIP pricing instead.');
    }
```

 - **Jan:** "What about promotional periods? Should there be a minimum?"
 
 - **You:** "Yeah, let's say orders under $100 don't get the seasonal multiplier. Otherwise people will game the system with tiny orders."
 
 - **Jan:** "Makes sense..." *(adds that rule)*

```typescript
    // Rule 4: Promotional period minimum for seasonal multiplier
    const isPromotionalPeriod = checkPromotionalPeriod(orderDate);
    if (isPromotionalPeriod && amount < 100) {
        warnings.push('Orders under $100 do not qualify for seasonal multiplier during promotions');
    }
```

 - **You:** "Should we add fraud prevention? Like flag really large orders?"
 
 - **Jan:** "Good idea. What's the threshold?"
 
 - **You:** "Maybe $50,000? Anything above that gets flagged for manual review."
 
 - **Jan:** "Got it..." *(adds large order check)*

```typescript
    // Rule 6: Large order review
    if (amount > 50000) {
        warnings.push('Large order flagged for manual review. Discount will be applied pending approval.');
    }
```

 - **You:** "What about promotional codes? Can people stack those with these discounts?"
 
 - **Jan:** "That's a separate system, but I should add a note about it..." *(adds documentation comment)*

```typescript
/**
 * Note: Promotional codes are handled separately and may have stacking restrictions.
 * See promo-code-rules.ts for details on how promo codes interact with tier discounts.
 * 
 * General rule: Promotional codes apply AFTER tier discounts are calculated.
 * Some promo codes may disable tier bonuses (check code.disablesTierBonuses flag).
 */
```

 - **You:** "Perfect. I think that covers everything marketing mentioned."
 
 - **Jan:** "Agreed. This should catch all the edge cases."

Value shown:
- New file creation is synchronized across participants
- Complex business validation rules require discussion of edge cases
- Voice communication allows natural back-and-forth about business decisions
- Real-time discussion resolves ambiguities (error vs warning, thresholds)
- Both parties ensure all edge cases from marketing requirements are covered
- Documentation is added inline to clarify complex interactions
- The validation file becomes a living document of business rules

## Act 5 – Wrap-Up and Verification

 - **Jan:** "Okay, let me quickly review what we've built..." *(navigates back through the files)*
 - Your view follows as Jan switches between files.

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

 - **You:** "This is perfect! This is exactly what marketing needs, and we got it done in one session."
 
 - **Jan:** "Yeah, if we'd done this over email or tickets, it would have taken days. All those little decisions—like whether to error or warn on the ENTERPRISE minimum—we resolved them instantly."
 
 - **You:** "Exactly! And I could validate the business logic as you were coding it. Like when we figured out the formula—multiply base by seasonal, then add tier. If you'd implemented it the other way, we would have caught it in testing and had to redo everything."
 
 - **Jan:** "Right. And the documentation examples—you made sure they were clear for customers while I made sure the math was correct. That back-and-forth would have been painful over email."
 
 - **You:** "Definitely. Okay, I'll let marketing know we're ready to go. Thanks for jumping on this so quickly!"
 
 - **Jan:** "No problem. This was actually pretty efficient!"

**Summary of what synchronous collaboration enabled:**

1. **Immediate clarification of complex requirements** - No waiting for email responses about calculation formulas
2. **Real-time validation of business logic** - Stakeholder caught potential issues as code was written
3. **Collaborative problem-solving** - Both parties contributed expertise (business rules + technical constraints)
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
✅ Natural voice communication combined with shared editing

---

## Presentation Tips

**Timing:** This demo should take approximately 10-15 minutes, depending on how much you elaborate on each point.

**Key Moments to Emphasize:**
1. **Act 1**: The formula discussion (add vs multiply) - shows how complex logic needs real-time clarification
2. **Act 2**: When Jan switches files and your view follows automatically - demonstrates synchronized navigation
3. **Act 4**: The ENTERPRISE minimum decision (error vs warning) - shows collaborative decision-making
4. **Act 5**: The comparison of 1 hour vs 3-5 days - drives home the efficiency gain

**Audience Engagement:**
- After Act 1, you might pause and ask: "How long would this formula discussion take over email?"
- After Act 4, highlight: "Notice how we made a business decision in 30 seconds that would normally require a meeting"
- During Act 5, emphasize: "We edited 4 different files together, and both of us always knew exactly what was happening"

**Technical Notes:**
- Make sure both screens are visible to the audience (or switch between them)
- Show cursor highlights when both of you are editing
- If there's a lag, acknowledge it naturally - real collaboration isn't always perfect
- Have the OCT room ID ready before the presentation starts
