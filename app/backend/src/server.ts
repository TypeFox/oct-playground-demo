import express from 'express';
import cors from 'cors';
import { calculateDiscount } from './discount-rules';
import { DiscountRequest } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'discount-api' });
});

app.post('/api/calculate-discount', (req, res) => {
  try {
    const { customerType, amount } = req.body as DiscountRequest;

    if (!customerType || typeof amount !== 'number') {
      return res.status(400).json({
        error: 'Invalid request. Required: customerType (string) and amount (number)'
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        error: 'Amount must be non-negative'
      });
    }

    const discountedAmount = calculateDiscount(customerType, amount);
    const discountPercentage = amount > 0 
      ? ((amount - discountedAmount) / amount) * 100 
      : 0;

    res.json({
      originalAmount: amount,
      discountedAmount,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
      customerType
    });
  } catch (error) {
    console.error('Error calculating discount:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.get('/api/customer-types', (req, res) => {
  res.json({
    types: ['REGULAR', 'LOYALTY', 'VIP', 'ENTERPRISE']
  });
});

app.listen(PORT, () => {
  console.log(`Discount API server running on port ${PORT}`);
});
