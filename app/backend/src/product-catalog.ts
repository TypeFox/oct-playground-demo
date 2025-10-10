/**
 * Product Catalog Management
 * 
 * In-memory storage for product catalog with category-based discounts.
 * In production, this would be replaced with a database.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  stock: number;
  imageUrl?: string;
  categoryDiscount?: number;
}

export type ProductCategory = 
  | 'ELECTRONICS' 
  | 'CLOTHING' 
  | 'BOOKS' 
  | 'HOME' 
  | 'SPORTS' 
  | 'TOYS';

export interface CategoryDiscount {
  category: ProductCategory;
  discountPercentage: number;
  description: string;
  active: boolean;
}

class ProductCatalog {
  private products: Map<string, Product> = new Map();
  private categoryDiscounts: Map<ProductCategory, CategoryDiscount> = new Map();

  constructor() {
    this.initializeProducts();
    this.initializeCategoryDiscounts();
  }

  private initializeProducts(): void {
    const sampleProducts: Product[] = [
      {
        id: 'PROD-001',
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones',
        category: 'ELECTRONICS',
        basePrice: 199.99,
        stock: 50
      },
      {
        id: 'PROD-002',
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        category: 'ELECTRONICS',
        basePrice: 299.99,
        stock: 30
      },
      {
        id: 'PROD-003',
        name: 'Running Shoes',
        description: 'Professional running shoes with cushioned sole',
        category: 'SPORTS',
        basePrice: 89.99,
        stock: 100
      },
      {
        id: 'PROD-004',
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        category: 'CLOTHING',
        basePrice: 24.99,
        stock: 200
      },
      {
        id: 'PROD-005',
        name: 'Programming Book',
        description: 'Learn TypeScript: A comprehensive guide',
        category: 'BOOKS',
        basePrice: 49.99,
        stock: 75
      },
      {
        id: 'PROD-006',
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker with timer',
        category: 'HOME',
        basePrice: 79.99,
        stock: 40
      },
      {
        id: 'PROD-007',
        name: 'Yoga Mat',
        description: 'Non-slip exercise yoga mat',
        category: 'SPORTS',
        basePrice: 34.99,
        stock: 80
      },
      {
        id: 'PROD-008',
        name: 'Building Blocks Set',
        description: 'Educational building blocks for kids',
        category: 'TOYS',
        basePrice: 44.99,
        stock: 60
      },
      {
        id: 'PROD-009',
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand',
        category: 'ELECTRONICS',
        basePrice: 39.99,
        stock: 90
      },
      {
        id: 'PROD-010',
        name: 'Winter Jacket',
        description: 'Warm insulated winter jacket',
        category: 'CLOTHING',
        basePrice: 129.99,
        stock: 45
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  private initializeCategoryDiscounts(): void {
    const discounts: CategoryDiscount[] = [
      {
        category: 'ELECTRONICS',
        discountPercentage: 5,
        description: 'Tech sale - 5% off all electronics',
        active: true
      },
      {
        category: 'CLOTHING',
        discountPercentage: 10,
        description: 'Fashion week - 10% off all clothing',
        active: true
      },
      {
        category: 'BOOKS',
        discountPercentage: 15,
        description: 'Reading promotion - 15% off all books',
        active: true
      },
      {
        category: 'SPORTS',
        discountPercentage: 8,
        description: 'Fitness month - 8% off sports equipment',
        active: true
      }
    ];

    discounts.forEach(discount => {
      this.categoryDiscounts.set(discount.category, discount);
    });
  }

  getProduct(productId: string): Product | undefined {
    const product = this.products.get(productId);
    if (product) {
      const categoryDiscount = this.categoryDiscounts.get(product.category);
      return {
        ...product,
        categoryDiscount: categoryDiscount?.active ? categoryDiscount.discountPercentage : undefined
      };
    }
    return undefined;
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values()).map(product => {
      const categoryDiscount = this.categoryDiscounts.get(product.category);
      return {
        ...product,
        categoryDiscount: categoryDiscount?.active ? categoryDiscount.discountPercentage : undefined
      };
    });
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.getAllProducts().filter(p => p.category === category);
  }

  getCategoryDiscount(category: ProductCategory): CategoryDiscount | undefined {
    return this.categoryDiscounts.get(category);
  }

  getAllCategoryDiscounts(): CategoryDiscount[] {
    return Array.from(this.categoryDiscounts.values());
  }

  calculateProductPrice(productId: string, quantity: number = 1): {
    basePrice: number;
    categoryDiscount: number;
    finalPrice: number;
    totalPrice: number;
  } | null {
    const product = this.getProduct(productId);
    if (!product) return null;

    const categoryDiscount = product.categoryDiscount || 0;
    const discountAmount = product.basePrice * (categoryDiscount / 100);
    const finalPrice = product.basePrice - discountAmount;
    const totalPrice = finalPrice * quantity;

    return {
      basePrice: product.basePrice,
      categoryDiscount,
      finalPrice,
      totalPrice
    };
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllProducts().filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  updateStock(productId: string, quantity: number): boolean {
    const product = this.products.get(productId);
    if (!product) return false;

    if (product.stock + quantity < 0) return false;

    product.stock += quantity;
    return true;
  }
}

export const productCatalog = new ProductCatalog();
