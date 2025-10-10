/**
 * Shopping Cart Management
 * 
 * In-memory storage for shopping carts with bulk discount calculations.
 * In production, this would be replaced with a database.
 */

import { CustomerType } from './types';
import { productCatalog } from './product-catalog';

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  categoryDiscount: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  customerId: string;
  customerType: CustomerType;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  categoryDiscounts: number;
  tierDiscount: number;
  promoCodeDiscount: number;
  totalDiscount: number;
  finalTotal: number;
}

class ShoppingCartStore {
  private carts: Map<string, Cart> = new Map();
  private customerCarts: Map<string, string> = new Map();

  getOrCreateCart(customerId: string, customerType: CustomerType): Cart {
    let cartId = this.customerCarts.get(customerId);
    
    if (cartId) {
      const cart = this.carts.get(cartId);
      if (cart) return cart;
    }

    cartId = this.generateCartId();
    const cart: Cart = {
      id: cartId,
      customerId,
      customerType,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.carts.set(cartId, cart);
    this.customerCarts.set(customerId, cartId);
    return cart;
  }

  getCart(cartId: string): Cart | undefined {
    return this.carts.get(cartId);
  }

  addItem(cartId: string, productId: string, quantity: number = 1): Cart | null {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    const product = productCatalog.getProduct(productId);
    if (!product) return null;

    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
    } else {
      const categoryDiscount = product.categoryDiscount || 0;
      const discountedPrice = product.basePrice * (1 - categoryDiscount / 100);
      
      cart.items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.basePrice,
        categoryDiscount,
        subtotal: discountedPrice * quantity
      });
    }

    cart.updatedAt = new Date();
    return cart;
  }

  updateItemQuantity(cartId: string, productId: string, quantity: number): Cart | null {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    const item = cart.items.find(item => item.productId === productId);
    if (!item) return null;

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
      const discountedPrice = item.unitPrice * (1 - item.categoryDiscount / 100);
      item.subtotal = discountedPrice * quantity;
    }

    cart.updatedAt = new Date();
    return cart;
  }

  removeItem(cartId: string, productId: string): Cart | null {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date();
    return cart;
  }

  clearCart(cartId: string): Cart | null {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    cart.items = [];
    cart.updatedAt = new Date();
    return cart;
  }

  calculateCartSummary(cartId: string): CartSummary | null {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalBeforeDiscounts = cart.items.reduce(
      (sum, item) => sum + (item.unitPrice * item.quantity), 
      0
    );
    const subtotalAfterCategory = cart.items.reduce(
      (sum, item) => sum + item.subtotal, 
      0
    );
    const categoryDiscounts = subtotalBeforeDiscounts - subtotalAfterCategory;

    return {
      itemCount,
      subtotal: subtotalBeforeDiscounts,
      categoryDiscounts,
      tierDiscount: 0,
      promoCodeDiscount: 0,
      totalDiscount: categoryDiscounts,
      finalTotal: subtotalAfterCategory
    };
  }

  deleteCart(cartId: string): boolean {
    const cart = this.carts.get(cartId);
    if (!cart) return false;

    this.carts.delete(cartId);
    this.customerCarts.delete(cart.customerId);
    return true;
  }

  private generateCartId(): string {
    return `CART-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export const shoppingCartStore = new ShoppingCartStore();
