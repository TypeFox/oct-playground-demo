/**
 * Customer Management
 * 
 * In-memory storage for customer profiles and management.
 * In production, this would be replaced with a database.
 */

import { CustomerType } from './types';

export interface Customer {
  id: string;
  name: string;
  email: string;
  customerType: CustomerType;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  lifetimeSavings: number;
  notes?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  customerType: CustomerType;
  notes?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  customerType?: CustomerType;
  notes?: string;
}

class CustomerStore {
  private customers: Map<string, Customer> = new Map();
  private emailIndex: Map<string, string> = new Map();

  createCustomer(data: CreateCustomerRequest): Customer {
    if (this.emailIndex.has(data.email.toLowerCase())) {
      throw new Error('Customer with this email already exists');
    }

    const customer: Customer = {
      id: this.generateId(),
      name: data.name,
      email: data.email,
      customerType: data.customerType,
      joinDate: new Date(),
      totalOrders: 0,
      totalSpent: 0,
      lifetimeSavings: 0,
      notes: data.notes
    };

    this.customers.set(customer.id, customer);
    this.emailIndex.set(customer.email.toLowerCase(), customer.id);

    return customer;
  }

  getCustomer(customerId: string): Customer | undefined {
    return this.customers.get(customerId);
  }

  getCustomerByEmail(email: string): Customer | undefined {
    const customerId = this.emailIndex.get(email.toLowerCase());
    return customerId ? this.customers.get(customerId) : undefined;
  }

  getAllCustomers(): Customer[] {
    return Array.from(this.customers.values())
      .sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
  }

  updateCustomer(customerId: string, updates: UpdateCustomerRequest): Customer | undefined {
    const customer = this.customers.get(customerId);
    if (!customer) return undefined;

    if (updates.email && updates.email !== customer.email) {
      if (this.emailIndex.has(updates.email.toLowerCase())) {
        throw new Error('Customer with this email already exists');
      }
      this.emailIndex.delete(customer.email.toLowerCase());
      this.emailIndex.set(updates.email.toLowerCase(), customerId);
    }

    const updatedCustomer: Customer = {
      ...customer,
      ...updates
    };

    this.customers.set(customerId, updatedCustomer);
    return updatedCustomer;
  }

  deleteCustomer(customerId: string): boolean {
    const customer = this.customers.get(customerId);
    if (!customer) return false;

    this.customers.delete(customerId);
    this.emailIndex.delete(customer.email.toLowerCase());
    return true;
  }

  updateCustomerStats(customerId: string, orderAmount: number, savings: number): void {
    const customer = this.customers.get(customerId);
    if (!customer) return;

    customer.totalOrders++;
    customer.totalSpent += orderAmount;
    customer.lifetimeSavings += savings;
  }

  getCustomersByType(customerType: CustomerType): Customer[] {
    return Array.from(this.customers.values())
      .filter(c => c.customerType === customerType)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }

  searchCustomers(query: string): Customer[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.customers.values())
      .filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.id.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }

  private generateId(): string {
    return `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  clear(): void {
    this.customers.clear();
    this.emailIndex.clear();
  }
}

export const customerStore = new CustomerStore();
