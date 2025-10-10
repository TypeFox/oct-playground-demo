/**
 * Order History Management
 * 
 * In-memory storage for order history tracking.
 * In production, this would be replaced with a database.
 */

import { CustomerType } from './types';

export interface Order {
  id: string;
  customerType: CustomerType;
  customerId: string;
  originalAmount: number;
  discountedAmount: number;
  discountPercentage: number;
  savingsAmount: number;
  timestamp: Date;
  items?: OrderItem[];
  promoCode?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  totalSavings: number;
  averageOrderValue: number;
  averageDiscount: number;
  ordersByCustomerType: Record<CustomerType, number>;
}

class OrderHistoryStore {
  private orders: Map<string, Order> = new Map();
  private customerOrders: Map<string, string[]> = new Map();

  addOrder(order: Order): Order {
    this.orders.set(order.id, order);
    
    const customerOrderIds = this.customerOrders.get(order.customerId) || [];
    customerOrderIds.push(order.id);
    this.customerOrders.set(order.customerId, customerOrderIds);
    
    return order;
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  getCustomerOrders(customerId: string): Order[] {
    const orderIds = this.customerOrders.get(customerId) || [];
    return orderIds
      .map(id => this.orders.get(id))
      .filter((order): order is Order => order !== undefined)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAllOrders(limit?: number): Order[] {
    const allOrders = Array.from(this.orders.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? allOrders.slice(0, limit) : allOrders;
  }

  getOrderStats(): OrderStats {
    const orders = Array.from(this.orders.values());
    
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalSavings: 0,
        averageOrderValue: 0,
        averageDiscount: 0,
        ordersByCustomerType: {
          REGULAR: 0,
          LOYALTY: 0,
          VIP: 0,
          ENTERPRISE: 0
        }
      };
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.discountedAmount, 0);
    const totalSavings = orders.reduce((sum, order) => sum + order.savingsAmount, 0);
    const totalDiscount = orders.reduce((sum, order) => sum + order.discountPercentage, 0);

    const ordersByCustomerType: Record<CustomerType, number> = {
      REGULAR: 0,
      LOYALTY: 0,
      VIP: 0,
      ENTERPRISE: 0
    };

    orders.forEach(order => {
      ordersByCustomerType[order.customerType]++;
    });

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalSavings,
      averageOrderValue: totalRevenue / orders.length,
      averageDiscount: totalDiscount / orders.length,
      ordersByCustomerType
    };
  }

  deleteOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (!order) return false;

    this.orders.delete(orderId);
    
    const customerOrderIds = this.customerOrders.get(order.customerId);
    if (customerOrderIds) {
      const index = customerOrderIds.indexOf(orderId);
      if (index > -1) {
        customerOrderIds.splice(index, 1);
      }
    }

    return true;
  }

  clear(): void {
    this.orders.clear();
    this.customerOrders.clear();
  }
}

export const orderHistory = new OrderHistoryStore();
