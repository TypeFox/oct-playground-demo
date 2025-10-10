# E-Commerce Discount System

> A full-stack TypeScript application demonstrating collaborative editing with Eclipse Open Collaboration Tools (OCT)

## Overview

This application provides a comprehensive discount calculation system for an e-commerce platform. It enables businesses to offer tiered discounts based on customer loyalty levels, helping to reward repeat customers and VIP members.

The application is specifically designed to showcase OCT's collaborative editing capabilities across code, documentation, and configuration files.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Installation & Running

```bash
# 1. Install all dependencies (uses npm workspaces)
cd app
npm install

# 2. Start backend (Terminal 1)
npm run dev:backend
# ✅ Backend running on http://localhost:3001

# 3. Start frontend (Terminal 2)
npm run dev:frontend
# ✅ Frontend running on http://localhost:3000

# Or run both concurrently
npm run dev
```

### Verify Installation

Open http://localhost:3000 in your browser and test the discount calculator.

**Test via API:**
```bash
curl -X POST http://localhost:3001/api/calculate-discount \
  -H "Content-Type: application/json" \
  -d '{"customerType": "VIP", "amount": 100}'

# Expected: {"originalAmount":100,"discountedAmount":90,"discountPercentage":10,"customerType":"VIP"}
```

## Project Structure

```
app/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── server.ts          # Main server entry point
│   │   ├── discount-rules.ts  # Core business logic (Act 1)
│   │   └── types.ts           # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── App.css            # Application styles
│   │   ├── main.tsx           # React entry point
│   │   └── types.ts           # TypeScript type definitions
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── discount-rules.ts           # Shared business logic (Act 1) ⭐
├── config.json                 # Discount configuration (Act 3) ⭐
├── README.md                   # This file (Act 2) ⭐
├── package.json                # Root workspace configuration
└── package-lock.json           # Single lock file for all dependencies

⭐ = Key files for OCT demo scenario
```

## Features

### Customer Discount Tiers

The system supports three customer types with different discount levels:

- **Regular Customers**: Standard pricing with no discount applied
- **VIP Customers**: Premium members receive a 10% discount on all purchases
- **Loyalty Card Holders**: Customers with loyalty cards receive a 5% discount on all purchases

| Type | Discount | Multiplier |
|------|----------|------------|
| REGULAR | 0% | 1.0 |
| LOYALTY | 5% | 0.95 |
| VIP | 10% | 0.9 |

### Discount Calculation

The discount system automatically calculates the final price based on:
- Customer type (Regular, VIP, or Loyalty)
- Original purchase amount
- Configured discount percentages

All calculations are performed server-side to ensure consistency and security.

### Configuration Management

Discount rules are configurable through the `config.json` file, allowing business administrators to:
- Adjust discount percentages for different customer tiers
- Set minimum order amounts
- Configure maximum discount limits per order
- Specify currency settings

## Technical Architecture

### Backend API

Built with Node.js and Express, providing RESTful endpoints:

- **POST /api/calculate-discount** - Calculate discount for a purchase
  ```json
  Request: {"customerType": "VIP", "amount": 100}
  Response: {"originalAmount": 100, "discountedAmount": 90, "discountPercentage": 10, "customerType": "VIP"}
  ```

- **GET /api/customer-types** - Get supported customer types
  ```json
  Response: {"types": ["REGULAR", "VIP", "LOYALTY"]}
  ```

- **GET /health** - Health check endpoint
  ```json
  Response: {"status": "ok", "service": "discount-api"}
  ```

### Frontend Application

React-based single-page application that provides:
- Intuitive discount calculator interface
- Real-time discount calculation
- Visual representation of discount tiers
- Responsive design for all devices

### Business Logic

The core discount calculation logic is implemented in `discount-rules.ts`, which:
- Validates customer types
- Applies appropriate discount rates
- Handles edge cases and error conditions
- Ensures consistent discount application

### Technology Stack

**Backend:**
- Node.js 20
- Express.js
- TypeScript
- ts-node for development

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- CSS3

**Monorepo:**
- npm workspaces
- Single package-lock.json
- Shared dependencies

## OCT Demo Scenario

This application is designed to demonstrate Eclipse Open Collaboration Tools through a realistic stakeholder-developer collaboration scenario.

### Act 1: Reviewing the Business Logic

**File:** `discount-rules.ts`

During the demo:
1. Jan (developer) opens `discount-rules.ts` in Theia IDE
2. Stakeholder sees it instantly in OCT Playground (browser)
3. Both can edit the logic collaboratively in real-time
4. Cursor positions and changes are synchronized

**Initial state:**
```typescript
export function calculateDiscount(customerType: string, amount: number): number {
    if (customerType === 'VIP') {
        return amount * 0.9; // 10% discount
    }
    return amount;
}
```

**After collaboration (adding LOYALTY support):**
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

**Value demonstrated:**
- Business stakeholder can directly edit code logic
- No IDE installation required for stakeholder
- Real-time cursor tracking shows who edits what
- Both parties see changes instantly

### Act 2: Synchronizing Across Multiple Files

**File:** `README.md` (this file)

During the demo:
1. Jan switches from `discount-rules.ts` to `README.md`
2. Stakeholder's view automatically follows
3. Both edit documentation together
4. Demonstrates synchronized file navigation

**Key section to edit:**
```markdown
### Customer Discount Tiers
- **Loyalty Card Holders**: Customers with loyalty cards receive a 5% discount on all purchases
```

**Value demonstrated:**
- Cross-file navigation is synchronized
- Both technical and non-technical content can be edited
- Documentation stays aligned with code changes
- Stakeholder can ensure business messaging is correct

### Act 3: Configuration Alignment

**File:** `config.json`

During the demo:
1. Jan switches to `config.json`
2. Stakeholder suggests adding `"loyaltyDiscount": 0.05` entry
3. Stakeholder types it directly in OCT Playground
4. Jan validates JSON syntax and explains system integration

**Configuration structure:**
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

**Value demonstrated:**
- Collaboration extends beyond code to configuration
- Stakeholder can propose business rule changes
- Developer validates technical correctness
- Configuration is human-readable and editable

### Act 4: Wrap-Up

**Complete collaboration workflow:**
1. ✅ Code logic shaped together (`discount-rules.ts`)
2. ✅ Documentation refined together (`README.md`)
3. ✅ Configuration validated together (`config.json`)
4. ✅ No IDE setup required for stakeholder
5. ✅ Real collaboration in code and text simultaneously

## Configuration

Edit `config.json` to customize discount rules:

```json
{
  "discountRules": {
    "vipDiscount": 0.10,      // 10% discount for VIP customers
    "loyaltyDiscount": 0.05   // 5% discount for loyalty card holders
  },
  "currency": "USD",
  "minimumOrderAmount": 0,
  "maxDiscountPerOrder": 1000
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Run both concurrently
npm run dev

# Build both projects
npm run build

# Build specific workspace
npm run build --workspace=backend
npm run build --workspace=frontend
```

## Use Cases

### Rewarding Customer Loyalty

The system helps businesses build customer loyalty by offering automatic discounts to repeat customers. Loyalty card holders automatically get 5% off all purchases, encouraging continued engagement with the brand.

### VIP Member Benefits

VIP customers receive premium treatment with a 10% discount, making them feel valued and incentivizing higher-tier membership.

### Flexible Business Rules

The configurable nature of the discount system allows businesses to:
- Run promotional campaigns by adjusting discount rates
- Test different discount strategies
- Adapt to market conditions
- Maintain competitive pricing

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

### Build Errors

```bash
# Rebuild backend
cd backend && npm run build

# Rebuild frontend
cd frontend && npm run build
```

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access UI at http://localhost:3000
- [ ] Can calculate discount for VIP customer
- [ ] Can calculate discount for LOYALTY customer
- [ ] Can calculate discount for REGULAR customer
- [ ] All three key files exist and are editable
- [ ] Documentation matches implementation

## Future Enhancements

Potential improvements to the system include:
- Time-based promotional discounts
- Product-category-specific discounts
- Cumulative discount rules
- Integration with inventory management
- Analytics and reporting dashboard
- Multi-currency support
- User authentication and authorization
- Admin panel for discount management
- A/B testing for discount strategies

## Additional Documentation

- **../IMPLEMENTATION-SUMMARY.md** - Complete project overview at repository root

## License

MIT

## Support

For questions or issues, please contact the development team or refer to the technical documentation in the codebase.
