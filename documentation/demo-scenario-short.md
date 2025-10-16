# Scenario: Quick Feature Alignment (Conference Talk Version)

## Context

**Duration:** 5-7 minutes

This is a condensed version of the full demo scenario, designed for conference presentations with limited time. It covers the same core features and value propositions but with a streamlined narrative.

### Roles

- **Sta** (Stakeholder): Project stakeholder (no IDE, just browser). Cares about business rules.
- **Dev** (Developer): Senior engineer (working in Theia IDE with OCT integration).

### Scene Setup

Sta calls Dev on a video call about urgent changes to the discount system. Marketing needs tiered discounts for a promotion launching next week. Dev starts an OCT session from Theia and sends Sta a room ID. Sta joins via the OCT Playground in the browser.

**Presentation Note:** During the demo, Sta and Dev speak naturally over video call while editing shared files. The audience sees Sta's screen (OCT Playground).

## Act 1 – Adding Business Logic

- Dev opens `discount-rules.ts` in Theia. Sta sees it instantly in the Playground.
- Current code shows simple percentage discounts:

```typescript
export function calculateDiscount(
  customerType: string,
  amount: number
): number {
  if (customerType === "VIP") {
    return amount * 0.9; // 10% discount
  }
  if (customerType === "LOYALTY") {
    return amount * 0.95; // 5% discount
  }
  return amount;
}
```

- **Sta:** "Marketing wants to add a volume discount—5% extra for orders over $1000. But they also want a bulk discount—if someone orders over $5000, they get 10% instead of 5%."

- **Dev:** "So that stacks with the customer discount?"

- **Sta:** "Yes. A VIP spending $5000 would get 10% plus 10%."

- **Dev:** "Wait, should the volume discount apply to the original amount or the discounted amount?"

- **Sta:** "Hmm, good question. What's the difference?"

- **Dev:** "Well, if we apply it to the original amount, a VIP with $1000 gets $100 customer discount plus $50 volume discount = $150 total. But if we apply volume to the already-discounted price, it's $100 customer discount, then 5% of $900 = $45 volume discount = $145 total."

- **Sta:** "Oh! Let's do it on the original amount—simpler to explain to customers and more generous."

- **Dev:** "Got it. Let me code that..." _(starts coding while Sta watches)_

```typescript
export function calculateDiscount(
  customerType: string,
  amount: number
): number {
  let discount = 0;

  // Base customer discount
  if (customerType === "VIP") {
    discount = 0.1; // 10%
  } else if (customerType === "LOYALTY") {
    discount = 0.05; // 5%
  }

  // Volume discount based on original amount
  if (amount >= 5000) {
    discount += 0.1; // Additional 10% for bulk orders
  } else if (amount >= 1000) {
    discount += 0.05; // Additional 5% for large orders
  }

  return amount * (1 - discount);
}
```

- **Sta:** "Perfect! So a VIP with a $5000 order gets 20% total—$1000 off."

- **Dev:** "Exactly. And we're applying both discounts to the original amount, so it's clear."

**Value shown:** Business logic requires real-time discussion to clarify ambiguities. The "apply to original vs discounted amount" decision would take multiple email rounds to resolve.

## Act 2 – Documentation with Synchronized Navigation

- **Dev:** "Let me document this..." _(switches to README.md in Theia)_
- Sta's Playground view **instantly follows** to the same file.

- **Dev:** "I'll add the discount rules..." _(types)_

```markdown
## Discount Rules

### Customer Discounts

- VIP: 10% discount
- LOYALTY: 5% discount
- REGULAR: 0% discount

### Volume Discounts (applied to original amount)

- Orders $1000-$4999: Additional 5% discount
- Orders $5000+: Additional 10% discount
```

- **Sta:** "Let me add an example for the bulk discount..." _(types)_

```markdown
### Example

VIP customer with $5000 order:

- Customer discount: 10% of $5000 = $500
- Volume discount: 10% of $5000 = $500
- Total discount: $1000 (20%)
- Final price: $4000
```

- **Dev:** "Good. That makes it clear both discounts apply to the original amount."

**Value shown:** Cross-file navigation synchronized automatically. Both parties validate documentation matches implementation in real-time.

## Act 3 – Configuration Structure

- **Dev:** "Now the config..." _(switches to config.json)_
- Sta's view follows. Current config is too simple:

```json
{
  "discountRules": {
    "vipDiscount": 0.1,
    "loyaltyDiscount": 0.05
  }
}
```

- **Dev:** "Let me add the volume tiers..." _(types)_

```json
{
  "discountRules": {
    "customerDiscounts": {
      "VIP": 0.1,
      "LOYALTY": 0.05,
      "REGULAR": 0.0
    },
    "volumeDiscounts": [
      {
        "minAmount": 1000,
        "maxAmount": 4999,
        "discount": 0.05
      },
      {
        "minAmount": 5000,
        "maxAmount": null,
        "discount": 0.1
      }
    ]
  }
}
```

- **Sta:** "Perfect! The array makes it easy to add more tiers later."

- **Dev:** "Exactly. Marketing can request new thresholds anytime."

**Value shown:** Configuration designed collaboratively. Both parties ensure structure supports business needs and future changes.

## Wrap-Up

- **Dev:** "Okay, let's review..." _(navigates back through files)_
- Sta's view follows as Dev switches between files.

**What we built:**

- ✅ Two-tier volume discount with proper stacking logic
- ✅ Clear documentation with calculation example
- ✅ Flexible configuration structure

- **Sta:** "Perfect! If we'd done this over email, that 'apply to original vs discounted amount' question would have taken forever to clarify."

- **Dev:** "Right. I would have implemented it one way, you'd have tested it, realized it was wrong, and we'd have to redo it. This way we got it right the first time."

- **Sta:** "Exactly! And the two-tier structure is clear. Okay, I'll let marketing know we're ready!"

**Summary of what synchronous collaboration enabled:**

1. **Immediate clarification** - "Apply to original vs discounted amount" resolved in 30 seconds
2. **Real-time validation** - Stakeholder validated calculation logic as code was written
3. **Synchronized navigation** - Both parties always on the same page across 3 files
4. **Prevention of rework** - Logic validated before implementation complete, avoiding costly mistakes
5. **No IDE required** - Stakeholder collaborates from browser
6. **Natural communication** - Voice + shared editing creates powerful workflow

**Why asynchronous would have failed:**

- The "apply to original vs discounted amount" question would require multiple email rounds to explain
- Developer might implement the wrong approach, requiring rework after testing
- Documentation might not match implementation
- **Result:** 1-2 days of back-and-forth vs. 20 minutes of synchronous collaboration

---

## Presentation Tips

**Timing:** 3-5 minutes total

**Key Moments to Emphasize:**

1. **Act 1**: The "apply to original vs discounted amount" question - shows how ambiguities are resolved instantly
2. **Act 2**: When Dev switches files and Sta's view follows - demonstrate synchronized navigation clearly
3. **Wrap-Up**: "20 minutes vs 1-2 days" - drives home the efficiency gain

**Pacing:**

- Act 1: 1.5-2 minutes (focus on the calculation ambiguity discussion)
- Act 2: 1 minute (minimal documentation)
- Act 3: 1 minute (config update)
- Wrap-Up: 1 minute (summarize value)

**What to Skip vs Full Version:**

- ❌ Skip: Seasonal multipliers, caps, validation rules, detailed edge cases
- ✅ Keep: Two-tier volume discount with calculation ambiguity, synchronized navigation, configuration update
- ✅ Keep: All core OCT features (cursor sync, file following, real-time editing)

**Audience Engagement:**

- After Act 1: "That 'apply to original vs discounted amount' question—how many emails would that take to clarify? And how likely would the developer implement it wrong the first time?"
- After Act 2: "Notice how the stakeholder's view automatically followed—no 'which file are you in?' confusion"
- During Wrap-Up: "They edited 3 files together in 20 minutes and got the logic right the first time. Asynchronously? Multiple email rounds, likely rework after testing."

**Technical Notes:**

- Have the OCT room ID ready before presentation
- Show cursor highlights when both participants edit
- Make sure file switching is clearly visible to audience
- If there's lag, acknowledge it naturally
