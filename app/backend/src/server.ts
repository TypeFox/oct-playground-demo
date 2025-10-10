import express from 'express';
import cors from 'cors';
import { calculateDiscount } from './discount-rules';
import { DiscountRequest } from './types';
import { orderHistory, Order } from './order-history';
import { customerStore, CreateCustomerRequest, UpdateCustomerRequest } from './customer-management';
import { validatePromoCode, calculatePromoCodeDiscount, incrementPromoCodeUsage, getActivePromoCodes } from './promo-code-rules';
import { productCatalog } from './product-catalog';
import { shoppingCartStore } from './shopping-cart';
import { randomUUID } from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'discount-api' });
});

app.post('/api/calculate-discount', (req, res) => {
  try {
    const { customerType, amount, customerId, saveToHistory, promoCode } = req.body as DiscountRequest & { 
      customerId?: string; 
      saveToHistory?: boolean;
      promoCode?: string;
    };

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

    let discountedAmount = calculateDiscount(customerType, amount);
    let discountPercentage = amount > 0 
      ? ((amount - discountedAmount) / amount) * 100 
      : 0;

    let promoCodeDiscount = null;
    let promoCodeWarnings: string[] = [];

    if (promoCode) {
      const validation = validatePromoCode(promoCode, customerType, amount);
      if (validation.isValid && validation.promoCode) {
        const promoDiscount = calculatePromoCodeDiscount(validation.promoCode, discountedAmount);
        discountedAmount -= promoDiscount.discountAmount;
        discountPercentage = amount > 0 
          ? ((amount - discountedAmount) / amount) * 100 
          : 0;
        promoCodeDiscount = promoDiscount;
        promoCodeWarnings = validation.warnings;
        
        if (saveToHistory) {
          incrementPromoCodeUsage(promoCode);
        }
      } else {
        return res.status(400).json({
          error: validation.errors[0] || 'Invalid promo code'
        });
      }
    }

    const result = {
      originalAmount: amount,
      discountedAmount,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
      customerType,
      promoCodeDiscount,
      warnings: promoCodeWarnings
    };

    if (saveToHistory && customerId) {
      const order: Order = {
        id: randomUUID(),
        customerType,
        customerId,
        originalAmount: amount,
        discountedAmount,
        discountPercentage: result.discountPercentage,
        savingsAmount: amount - discountedAmount,
        timestamp: new Date(),
        promoCode: promoCode
      };
      orderHistory.addOrder(order);
    }

    res.json(result);
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

app.get('/api/orders', (req, res) => {
  try {
    const { customerId, limit } = req.query;
    
    if (customerId) {
      const orders = orderHistory.getCustomerOrders(customerId as string);
      res.json({ orders });
    } else {
      const limitNum = limit ? parseInt(limit as string) : undefined;
      const orders = orderHistory.getAllOrders(limitNum);
      res.json({ orders });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:orderId', (req, res) => {
  try {
    const order = orderHistory.getOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = orderHistory.getOrderStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/orders/:orderId', (req, res) => {
  try {
    const deleted = orderHistory.deleteOrder(req.params.orderId);
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const customerData = req.body as CreateCustomerRequest;
    
    if (!customerData.name || !customerData.email || !customerData.customerType) {
      return res.status(400).json({
        error: 'Invalid request. Required: name, email, customerType'
      });
    }

    const customer = customerStore.createCustomer(customerData);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/customers', (req, res) => {
  try {
    const { type, search } = req.query;
    
    let customers;
    if (search) {
      customers = customerStore.searchCustomers(search as string);
    } else if (type) {
      customers = customerStore.getCustomersByType(type as any);
    } else {
      customers = customerStore.getAllCustomers();
    }
    
    res.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/customers/:customerId', (req, res) => {
  try {
    const customer = customerStore.getCustomer(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/customers/:customerId', (req, res) => {
  try {
    const updates = req.body as UpdateCustomerRequest;
    const customer = customerStore.updateCustomer(req.params.customerId, updates);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.delete('/api/customers/:customerId', (req, res) => {
  try {
    const deleted = customerStore.deleteCustomer(req.params.customerId);
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/promo-codes', (req, res) => {
  try {
    const promoCodes = getActivePromoCodes();
    res.json({ promoCodes });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/promo-codes/validate', (req, res) => {
  try {
    const { code, customerType, amount } = req.body;
    
    if (!code || !customerType || typeof amount !== 'number') {
      return res.status(400).json({
        error: 'Invalid request. Required: code, customerType, amount'
      });
    }

    const validation = validatePromoCode(code, customerType, amount);
    res.json(validation);
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const { category, search } = req.query;
    
    let products;
    if (search) {
      products = productCatalog.searchProducts(search as string);
    } else if (category) {
      products = productCatalog.getProductsByCategory(category as any);
    } else {
      products = productCatalog.getAllProducts();
    }
    
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:productId', (req, res) => {
  try {
    const product = productCatalog.getProduct(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/category-discounts', (req, res) => {
  try {
    const discounts = productCatalog.getAllCategoryDiscounts();
    res.json({ discounts });
  } catch (error) {
    console.error('Error fetching category discounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products/:productId/calculate-price', (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const priceInfo = productCatalog.calculateProductPrice(req.params.productId, quantity);
    
    if (!priceInfo) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(priceInfo);
  } catch (error) {
    console.error('Error calculating product price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart', (req, res) => {
  try {
    const { customerId, customerType } = req.body;
    
    if (!customerId || !customerType) {
      return res.status(400).json({
        error: 'Invalid request. Required: customerId, customerType'
      });
    }

    const cart = shoppingCartStore.getOrCreateCart(customerId, customerType);
    res.json(cart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cart/:cartId', (req, res) => {
  try {
    const cart = shoppingCartStore.getCart(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart/:cartId/items', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    const cart = shoppingCartStore.addItem(req.params.cartId, productId, quantity);
    if (!cart) {
      return res.status(404).json({ error: 'Cart or product not found' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/cart/:cartId/items/:productId', (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Quantity required' });
    }

    const cart = shoppingCartStore.updateItemQuantity(
      req.params.cartId, 
      req.params.productId, 
      quantity
    );
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart or item not found' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart/:cartId/items/:productId', (req, res) => {
  try {
    const cart = shoppingCartStore.removeItem(req.params.cartId, req.params.productId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart or item not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cart/:cartId/summary', (req, res) => {
  try {
    const summary = shoppingCartStore.calculateCartSummary(req.params.cartId);
    if (!summary) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(summary);
  } catch (error) {
    console.error('Error calculating cart summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart/:cartId', (req, res) => {
  try {
    const deleted = shoppingCartStore.deleteCart(req.params.cartId);
    if (!deleted) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Discount API server running on port ${PORT}`);
});
