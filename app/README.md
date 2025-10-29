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
├── discount-rules.ts           # Complex business logic with tiered discounts (Act 1) ⭐
├── validation-rules.ts         # Business validation and edge cases (Act 4) ⭐
├── config.json                 # Complex nested configuration (Act 3) ⭐
├── README.md                   # This file with detailed examples (Act 2) ⭐
├── package.json                # Root workspace configuration
└── package-lock.json           # Single lock file for all dependencies

⭐ = Key files for OCT demo scenario
```

## Features

### 🎯 Core Discount System

### Customer Discount Tiers

The system supports four customer types with sophisticated discount rules combining base discounts, tiered bonuses, and seasonal multipliers:

| Type | Base Discount | Tier Bonuses | Seasonal Multiplier | Max Total Discount | Minimum Order |
|------|---------------|--------------|---------------------|-------------------|---------------|
| REGULAR | 0% | Yes | Yes | 40% | None |
| LOYALTY | 5% | Yes | Yes | 50% | None |
| VIP | 10% | Yes | Yes | 60% | None |
| ENTERPRISE | 15% | Yes | Yes | No cap | $5,000 |

#### Tier Bonuses (All Customer Types)

Tier bonuses are automatically applied based on order amount:

TODO

#### Seasonal Multipliers

During promotional periods, base discounts are multiplied:

- **Black Friday** (Nov 29): 2x multiplier
- **Cyber Monday** (Dec 2): 2x multiplier  
- **Holiday Season** (Dec 15-31): 1.5x multiplier

**Note**: Orders under $100 do not qualify for seasonal multipliers during promotional periods.

### Discount Calculation

The discount system uses a sophisticated formula that combines multiple factors:

#### Calculation Formula

```
totalDiscount = (baseDiscount × seasonalMultiplier) + tierBonus
finalDiscount = min(totalDiscount, maxDiscountForCustomerType)
finalAmount = originalAmount × (1 - finalDiscount)
```

**Key Points:**
- Seasonal multiplier applies ONLY to base discount, not tier bonuses
- Tier bonuses are added after seasonal multiplication
- Final discount is capped at the maximum for each customer type
- ENTERPRISE customers have no cap

#### Calculation Examples

**Example 1: VIP customer spending $1000 during Black Friday**
- Base discount: 10%
- Seasonal multiplier: 2x (Black Friday)
- Seasonal discount: 10% × 2 = 20%
- Tier bonus: 10% (for $1000+ order)
- Total discount: 20% + 10% = 30%
- Final discount: 30% (under 60% VIP cap) ✓
- **Final amount: $700** (saved $300)

**Example 2: LOYALTY customer spending $1000 during Black Friday**
- Base discount: 5%
- Seasonal multiplier: 2x (Black Friday)
- Seasonal discount: 5% × 2 = 10%
- Tier bonus: 10% (for $1000+ order)
- Total discount: 10% + 10% = 20%
- Final discount: 20% (under 50% LOYALTY cap) ✓
- **Final amount: $800** (saved $200)

**Example 3: REGULAR customer spending $1000 during Black Friday**
- Base discount: 0%
- Seasonal multiplier: 2x (Black Friday)
- Seasonal discount: 0% × 2 = 0%
- Tier bonus: 10% (for $1000+ order)
- Total discount: 0% + 10% = 10%
- Final discount: 10% (under 40% REGULAR cap) ✓
- **Final amount: $900** (saved $100)

**Example 4: ENTERPRISE customer spending $10,000 during Holiday Season**
- Base discount: 15%
- Seasonal multiplier: 1.5x (Holiday Season)
- Seasonal discount: 15% × 1.5 = 22.5%
- Tier bonus: 10% (for $1000+ order)
- Total discount: 22.5% + 10% = 32.5%
- Final discount: 32.5% (no cap for ENTERPRISE) ✓
- **Final amount: $6,750** (saved $3,250)

**Example 5: VIP customer spending $600 (no promotional period)**
- Base discount: 10%
- Seasonal multiplier: 1x (no promotion)
- Seasonal discount: 10% × 1 = 10%
- Tier bonus: 5% (for $500-$999 order)
- Total discount: 10% + 5% = 15%
- Final discount: 15% (under 60% VIP cap) ✓
- **Final amount: $510** (saved $90)

All calculations are performed server-side to ensure consistency and security.

### 🎫 Promotional Code System

The application includes a comprehensive promotional code system that works alongside tier discounts:

**Available Promo Codes:**
- **WELCOME10**: 10% off orders over $50
- **SAVE20**: $20 off orders over $100
- **VIP25**: 25% off for VIP/Enterprise customers (disables tier bonuses)
- **BULK50**: $50 off orders over $500
- **FREESHIP**: $15 off orders over $75 (free shipping equivalent)

**Promo Code Features:**
- Percentage or fixed amount discounts
- Minimum order requirements
- Customer type restrictions
- Usage limits
- Expiration dates
- Configurable stacking with tier bonuses and seasonal multipliers

### 📦 Product Catalog

Browse a comprehensive product catalog with category-based discounts:

**Product Categories:**
- **Electronics**: 5% category discount (Tech sale)
- **Clothing**: 10% category discount (Fashion week)
- **Books**: 15% category discount (Reading promotion)
- **Sports**: 8% category discount (Fitness month)
- **Home**: Standard pricing
- **Toys**: Standard pricing

**Catalog Features:**
- 10+ sample products across all categories
- Real-time stock tracking
- Category-based automatic discounts
- Product search functionality
- Price calculation with category discounts

### 🛒 Shopping Cart

Full-featured shopping cart with bulk discount calculations:

**Cart Features:**
- Add multiple products with quantities
- Automatic category discount application
- Real-time cart summary with all discounts
- Update quantities or remove items
- Persistent cart per customer
- Bulk discount calculations

**Cart Summary Includes:**
- Item count and subtotal
- Category discounts breakdown
- Tier bonus discounts
- Promo code discounts
- Final total with all savings

### 📊 Order History

Track all customer orders with detailed information:

**Order Tracking:**
- Complete order history per customer
- Order date and time stamps
- Discount breakdown per order
- Savings calculation
- Promo code usage tracking
- Customer type at time of purchase

### 📈 Analytics Dashboard

Real-time analytics showing discount system performance:

**Analytics Metrics:**
- Total orders processed
- Total revenue generated
- Total customer savings
- Average order value
- Average discount percentage
- Orders breakdown by customer type

**Business Insights:**
- Track discount effectiveness
- Monitor customer type distribution
- Analyze savings patterns
- Optimize discount strategies

### 👥 Customer Management

Comprehensive customer profile management:

**Customer Features:**
- Create and manage customer profiles
- Track customer type (REGULAR, LOYALTY, VIP, ENTERPRISE)
- Lifetime statistics (total orders, total spent, lifetime savings)
- Customer search functionality
- Email-based customer lookup
- Customer notes and metadata

### Configuration Management

Discount rules are highly configurable through the `config.json` file, allowing business administrators to:
- Define base discounts and caps for each customer type
- Configure tier bonus thresholds and amounts
- Set up promotional periods with seasonal multipliers
- Enable/disable specific promotions without deleting configuration
- Adjust business rules for discount stacking and validation
- Set minimum order amounts for customer types
- Configure fraud prevention thresholds

### Validation Rules

The system includes comprehensive validation to ensure business policy compliance:

1. **Order Amount Validation**: Orders must have positive amounts
2. **Customer Type Validation**: Only valid customer types are accepted
3. **ENTERPRISE Minimum**: Orders below $5,000 are automatically downgraded to VIP pricing
4. **Promotional Minimums**: Orders under $100 don't qualify for seasonal multipliers
5. **Large Order Review**: Orders over $50,000 are flagged for manual review
6. **Discount Stacking**: Rules for combining promotional codes with tier discounts

## Technical Architecture

### Backend API

Built with Node.js and Express, providing comprehensive RESTful endpoints:

#### Discount Calculation
- **POST /api/calculate-discount** - Calculate discount with optional promo code
  ```json
  Request: {
    "customerType": "VIP", 
    "amount": 100, 
    "customerId": "CUST-001",
    "saveToHistory": true,
    "promoCode": "WELCOME10"
  }
  Response: {
    "originalAmount": 100, 
    "discountedAmount": 81, 
    "discountPercentage": 19, 
    "customerType": "VIP",
    "promoCodeDiscount": {...},
    "warnings": []
  }
  ```

#### Customer Management
- **POST /api/customers** - Create new customer
- **GET /api/customers** - List all customers (supports ?type= and ?search= filters)
- **GET /api/customers/:id** - Get customer details
- **PUT /api/customers/:id** - Update customer
- **DELETE /api/customers/:id** - Delete customer

#### Order History
- **GET /api/orders** - Get all orders (supports ?customerId= and ?limit= filters)
- **GET /api/orders/:id** - Get specific order
- **DELETE /api/orders/:id** - Delete order

#### Analytics
- **GET /api/stats** - Get comprehensive order statistics
  ```json
  Response: {
    "totalOrders": 42,
    "totalRevenue": 5234.50,
    "totalSavings": 892.30,
    "averageOrderValue": 124.63,
    "averageDiscount": 14.2,
    "ordersByCustomerType": {...}
  }
  ```

#### Promotional Codes
- **GET /api/promo-codes** - Get all active promo codes
- **POST /api/promo-codes/validate** - Validate a promo code

#### Product Catalog
- **GET /api/products** - List all products (supports ?category= and ?search= filters)
- **GET /api/products/:id** - Get product details
- **GET /api/category-discounts** - Get all category discounts
- **POST /api/products/:id/calculate-price** - Calculate product price with discounts

#### Shopping Cart
- **POST /api/cart** - Create or get cart for customer
- **GET /api/cart/:id** - Get cart details
- **POST /api/cart/:id/items** - Add item to cart
- **PUT /api/cart/:id/items/:productId** - Update item quantity
- **DELETE /api/cart/:id/items/:productId** - Remove item from cart
- **GET /api/cart/:id/summary** - Get cart summary with all discounts
- **DELETE /api/cart/:id** - Clear cart

#### System
- **GET /health** - Health check endpoint
- **GET /api/customer-types** - Get supported customer types

### Frontend Application

React-based single-page application with multiple views:

**Calculator View:**
- Intuitive discount calculator interface
- Real-time discount calculation
- Promo code input and validation
- Visual representation of discount tiers
- Responsive design for all devices

**Order History View:**
- Complete order history display
- Order details with discount breakdown
- Promo code usage tracking
- Chronological order listing

**Promo Codes View:**
- Browse all available promo codes
- View promo code details and requirements
- Copy codes for easy use
- See discount values and minimums

**Analytics View:**
- Real-time statistics dashboard
- Visual metrics cards
- Customer type breakdown
- Revenue and savings tracking

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

### Act 1: Discovering Complex Business Requirements

**File:** `discount-rules.ts`

During the demo:
1. Dev opens `discount-rules.ts` with simple discount logic
2. Sta sees it instantly and discusses complex requirements over the call
3. Both discuss tiered discounts, seasonal multipliers, and stacking rules
4. Dev refactors the code while Sta validates business logic in real-time
5. They collaboratively design the discount calculation formula
6. Sta catches edge cases (ENTERPRISE customers, discount caps)

**Key complexity points:**
- Formula design: Should discounts add or multiply? Where do caps apply?
- Seasonal multipliers: Apply to base only or include tier bonuses?
- Customer type hierarchy: What happens when ENTERPRISE orders are too small?
- Performance considerations: Multiple calculations per order

**Value demonstrated:**
- Complex business logic requires immediate clarification
- Both parties contribute domain knowledge (business + technical)
- Comments become conversation medium within code
- Synchronous editing prevents misunderstandings about calculation logic
- Questions answered immediately, preventing costly rework

### Act 2: Synchronizing Documentation with Complex Rules

**File:** `README.md` (this file)

During the demo:
1. Dev switches to `README.md` - Sta's view follows automatically
2. Both create comprehensive discount matrix table with 4 customer types
3. Sta adds calculation formula with multiple examples
4. Dev validates technical accuracy of formulas
5. They add examples that demonstrate both normal cases and cap scenarios
6. Discussion about whether regular customers should get tier bonuses

**Key complexity points:**
- Discount matrix with multiple dimensions (base, tier, seasonal, caps)
- Calculation formula needs to be clear for non-technical readers
- Examples must cover edge cases (hitting caps, no base discount, etc.)
- Customer-facing language must be accurate and clear

**Value demonstrated:**
- Complex business rules require detailed documentation
- Both parties validate documentation matches implementation
- Real-time discussion catches potential misunderstandings
- Examples refined collaboratively to cover edge cases
- Stakeholder ensures customer-facing language is clear
- Developer ensures technical accuracy

### Act 3: Complex Configuration Structure

**File:** `config.json`

During the demo:
1. Dev switches to `config.json` - Sta's view follows
2. Both realize simple config won't support complex requirements
3. Dev restructures into nested configuration with customer types, tier bonuses, promotional periods
4. Sta proposes ENTERPRISE customer type with no cap
5. They add promotional period definitions (Black Friday, Cyber Monday, Holiday Season)
6. Discussion about enable/disable flags vs deleting config entries
7. Business rules section makes policies explicit

**Key complexity points:**
- Nested structure with multiple configuration sections
- Null values for "no cap" on ENTERPRISE customers
- Array of tier bonuses with thresholds
- Promotional periods with date ranges and multipliers
- Enable/disable flags for operational flexibility
- Business rules that affect calculation behavior

**Value demonstrated:**
- Complex nested configuration requires careful structuring
- Stakeholder proposes requirements, developer implements valid JSON
- Real-time validation prevents syntax errors
- Configuration matches code implementation
- Edge cases discussed and resolved (null for no cap, enabled flags)
- Business rules made explicit and configurable

### Act 4: Validation Rules and Edge Cases

**File:** `validation-rules.ts` (new file created during session)

During the demo:
1. Dev proposes adding validation file for business rule enforcement
2. Dev creates new file - Sta's view switches to it automatically
3. Sta discusses validation rules over the call
4. Dev implements validation logic
5. Discussion about error vs warning for ENTERPRISE minimum order
6. They decide to downgrade to VIP pricing instead of blocking sale
7. Add fraud prevention for large orders over $50,000
8. Document interaction with promotional code system

**Key complexity points:**
- Distinction between blocking errors and informational warnings
- Business decision: downgrade vs reject for ENTERPRISE minimum
- Fraud prevention thresholds
- Promotional period minimum order amounts
- Documentation of cross-system interactions (promo codes)

**Value demonstrated:**
- New file creation synchronized across participants
- Complex validation rules require discussion of edge cases
- Real-time discussion resolves ambiguities (error vs warning)
- Both parties ensure all marketing requirements covered
- Inline documentation clarifies complex interactions

### Act 5: Wrap-Up

**Complete collaboration workflow:**
1. ✅ Complex tiered discount logic designed together (`discount-rules.ts`)
2. ✅ Comprehensive documentation with examples (`README.md`)
3. ✅ Sophisticated nested configuration (`config.json`)
4. ✅ Business validation rules and edge cases (`validation-rules.ts`)
5. ✅ No IDE setup required for stakeholder
6. ✅ Real collaboration across 4 files with synchronized navigation
7. ✅ Complex requirements finalized in one session vs days of back-and-forth

## Configuration

Edit `config.json` to customize discount rules. The configuration supports:

### Customer Types
Define base discounts, maximum caps, and minimum order amounts for each customer type:
- REGULAR: 0% base, 40% cap
- LOYALTY: 5% base, 50% cap
- VIP: 10% base, 60% cap
- ENTERPRISE: 15% base, no cap, $5000 minimum

### Tier Bonuses
Configure order amount thresholds and bonus percentages:
- $500-$999: 5% bonus
- $1000+: 10% bonus

### Promotional Periods
Set up seasonal promotions with date ranges and multipliers:
- Black Friday: 2x multiplier
- Cyber Monday: 2x multiplier
- Holiday Season: 1.5x multiplier

Each promotion can be enabled/disabled without deleting the configuration.

### Business Rules
Control system behavior:
- `allowDiscountStacking`: Enable/disable combining multiple discounts
- `applySeasonalToBaseOnly`: Seasonal multiplier applies only to base discount
- `largeOrderThreshold`: Amount that triggers manual review
- `requireMinimumForTierBonus`: Whether tier bonuses require minimum order

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

### Core Discount System
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access UI at http://localhost:3000
- [ ] Can calculate discount for REGULAR customer
- [ ] Can calculate discount for LOYALTY customer
- [ ] Can calculate discount for VIP customer
- [ ] Can calculate discount for ENTERPRISE customer
- [ ] Tier bonuses apply correctly ($500 and $1000 thresholds)
- [ ] Seasonal multipliers work during promotional periods
- [ ] Discount caps are enforced per customer type
- [ ] ENTERPRISE customers below $5000 get VIP pricing

### New Features
- [ ] Promo codes can be applied to orders
- [ ] Promo code validation works correctly
- [ ] Order history displays past orders
- [ ] Analytics dashboard shows statistics
- [ ] Product catalog displays all products
- [ ] Category discounts apply automatically
- [ ] Shopping cart can add/remove items
- [ ] Cart summary calculates all discounts
- [ ] Customer management CRUD operations work

### Demo Files (OCT Integration)
- [ ] All four key files exist and are editable
- [ ] discount-rules.ts contains complex business logic
- [ ] validation-rules.ts has edge case handling
- [ ] config.json has nested configuration
- [ ] README.md has comprehensive documentation
- [ ] Documentation matches implementation

## API Usage Examples

### Calculate Discount with Promo Code
```bash
curl -X POST http://localhost:3001/api/calculate-discount \
  -H "Content-Type: application/json" \
  -d '{
    "customerType": "VIP",
    "amount": 150,
    "customerId": "DEMO-USER-001",
    "saveToHistory": true,
    "promoCode": "WELCOME10"
  }'
```

### Get Order History
```bash
curl http://localhost:3001/api/orders?customerId=DEMO-USER-001
```

### Get Analytics
```bash
curl http://localhost:3001/api/stats
```

### Browse Products
```bash
curl http://localhost:3001/api/products?category=ELECTRONICS
```

### Create Shopping Cart
```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -d '{"customerId": "DEMO-USER-001", "customerType": "VIP"}'
```

## Architecture Overview

The application follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Calculator│  │  Order   │  │  Promo   │  │Analytics│ │
│  │   View   │  │ History  │  │  Codes   │  │Dashboard│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                    REST API (JSON)
                          │
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Discount   │  │   Customer   │  │    Order     │  │
│  │    Rules     │  │  Management  │  │   History    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Promo Code  │  │   Product    │  │   Shopping   │  │
│  │    Rules     │  │   Catalog    │  │     Cart     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                  In-Memory Storage
                (Production: Database)
```

## Future Enhancements

Potential improvements to the system include:
- Database integration (PostgreSQL/MongoDB)
- User authentication and authorization
- Payment gateway integration
- Email notifications for orders
- Advanced analytics with charts and graphs
- Export functionality for reports
- Multi-currency support
- Internationalization (i18n)
- Mobile app version
- Admin dashboard for managing discounts
- A/B testing for discount strategies
- Machine learning for personalized discounts

## Future Enhancements

Potential improvements to the system include:
- Product-category-specific discounts
- Cumulative discount rules based on customer lifetime value
- Integration with inventory management
- Analytics and reporting dashboard for discount effectiveness
- Multi-currency support with exchange rates
- User authentication and authorization
- Admin panel for real-time discount management
- A/B testing for discount strategies
- Machine learning for personalized discount recommendations
- Integration with promotional code system
- Customer upgrade recommendations (e.g., LOYALTY → VIP)
- Real-time fraud detection for large orders

## Additional Documentation

- **../IMPLEMENTATION-SUMMARY.md** - Complete project overview at repository root

## License

MIT

## Support

For questions or issues, please contact the development team or refer to the technical documentation in the codebase.
