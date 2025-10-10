import { useState, useEffect } from 'react';
import { CustomerType, DiscountResponse } from './types';
import './App.css';

interface Order {
  id: string;
  customerType: CustomerType;
  customerId: string;
  originalAmount: number;
  discountedAmount: number;
  discountPercentage: number;
  savingsAmount: number;
  timestamp: string;
  promoCode?: string;
}

interface PromoCode {
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  totalSavings: number;
  averageOrderValue: number;
  averageDiscount: number;
  ordersByCustomerType: Record<CustomerType, number>;
}

function App() {
  const [view, setView] = useState<'calculator' | 'history' | 'profile' | 'analytics'>('calculator');
  const [customerType, setCustomerType] = useState<CustomerType>('REGULAR');
  const [amount, setAmount] = useState<string>('100');
  const [customerId] = useState<string>('DEMO-USER-001');
  const [promoCode, setPromoCode] = useState<string>('');
  const [result, setResult] = useState<DiscountResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [availablePromoCodes, setAvailablePromoCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);

  useEffect(() => {
    fetchPromoCodes();
    if (view === 'history') {
      fetchOrders();
    }
    if (view === 'analytics') {
      fetchStats();
    }
  }, [view]);

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch('/api/promo-codes');
      if (response.ok) {
        const data = await response.json();
        setAvailablePromoCodes(data.promoCodes || []);
      }
    } catch (err) {
      console.error('Failed to fetch promo codes:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?customerId=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const calculateDiscount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calculate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerType,
          amount: parseFloat(amount),
          customerId,
          saveToHistory: true,
          promoCode: promoCode || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate discount');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateDiscount();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛍️ E-Commerce Discount Calculator</h1>
        <p className="subtitle">Calculate customer discounts based on loyalty tier</p>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${view === 'calculator' ? 'active' : ''}`}
            onClick={() => setView('calculator')}
          >
            Calculator
          </button>
          <button 
            className={`nav-tab ${view === 'history' ? 'active' : ''}`}
            onClick={() => setView('history')}
          >
            Order History
          </button>
          <button 
            className={`nav-tab ${view === 'profile' ? 'active' : ''}`}
            onClick={() => setView('profile')}
          >
            Promo Codes
          </button>
          <button 
            className={`nav-tab ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            Analytics
          </button>
        </div>
      </header>

      <main className="main-content">{view === 'calculator' && (
        <>
        <div className="calculator-card">
          <form onSubmit={handleSubmit} className="calculator-form">
            <div className="form-group">
              <label htmlFor="customerType">Customer Type</label>
              <select
                id="customerType"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                className="form-select"
              >
                <option value="REGULAR">Regular Customer</option>
                <option value="LOYALTY">Loyalty Card Holder (5% off)</option>
                <option value="VIP">VIP Customer (10% off)</option>
                <option value="ENTERPRISE">Enterprise Customer (15% off)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Purchase Amount ($)</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                placeholder="Enter amount"
              />
            </div>

            <div className="form-group">
              <label htmlFor="promoCode">Promo Code (Optional)</label>
              <input
                id="promoCode"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="form-input"
                placeholder="Enter promo code"
              />
            </div>

            <button 
              type="submit" 
              className="calculate-button"
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate Discount'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="result-card">
              <h2>Discount Calculation Result</h2>
              <div className="result-details">
                <div className="result-row">
                  <span className="result-label">Customer Type:</span>
                  <span className="result-value">{result.customerType}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Original Amount:</span>
                  <span className="result-value">${result.originalAmount.toFixed(2)}</span>
                </div>
                <div className="result-row highlight">
                  <span className="result-label">Discount:</span>
                  <span className="result-value">{result.discountPercentage}%</span>
                </div>
                <div className="result-row total">
                  <span className="result-label">Final Amount:</span>
                  <span className="result-value">${result.discountedAmount.toFixed(2)}</span>
                </div>
                <div className="savings">
                  You save: ${(result.originalAmount - result.discountedAmount).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="info-card">
          <h2>Discount Tiers</h2>
          <div className="tier-list">
            <div className="tier-item">
              <div className="tier-badge regular">Regular</div>
              <div className="tier-description">Standard pricing - no base discount</div>
              <div className="tier-note">Max 40% with tier bonuses</div>
            </div>
            <div className="tier-item">
              <div className="tier-badge loyalty">Loyalty</div>
              <div className="tier-description">5% base discount + tier bonuses</div>
              <div className="tier-note">Max 50% total discount</div>
            </div>
            <div className="tier-item">
              <div className="tier-badge vip">VIP</div>
              <div className="tier-description">10% base discount + tier bonuses</div>
              <div className="tier-note">Max 60% total discount</div>
            </div>
            <div className="tier-item">
              <div className="tier-badge enterprise">Enterprise</div>
              <div className="tier-description">15% base discount + tier bonuses</div>
              <div className="tier-note">No cap • $5,000 minimum</div>
            </div>
          </div>
          <div className="tier-bonuses">
            <h3>Tier Bonuses</h3>
            <p>📦 Orders $500-$999: +5% bonus</p>
            <p>📦 Orders $1000+: +10% bonus</p>
          </div>
        </div>
        </>
      )}

      {view === 'history' && (
        <div className="history-view">
          <div className="history-card">
            <h2>Order History</h2>
            <p className="customer-id">Customer ID: {customerId}</p>
            {orders.length === 0 ? (
              <p className="no-orders">No orders yet. Place an order to see it here!</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-date">
                        {new Date(order.timestamp).toLocaleDateString()} {new Date(order.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`order-type ${order.customerType.toLowerCase()}`}>
                        {order.customerType}
                      </span>
                    </div>
                    <div className="order-details">
                      <div className="order-row">
                        <span>Original Amount:</span>
                        <span>${order.originalAmount.toFixed(2)}</span>
                      </div>
                      <div className="order-row">
                        <span>Discount:</span>
                        <span>{order.discountPercentage}%</span>
                      </div>
                      <div className="order-row">
                        <span>Final Amount:</span>
                        <span className="final-amount">${order.discountedAmount.toFixed(2)}</span>
                      </div>
                      <div className="order-row savings-row">
                        <span>Saved:</span>
                        <span className="savings-amount">${order.savingsAmount.toFixed(2)}</span>
                      </div>
                      {order.promoCode && (
                        <div className="promo-badge">
                          Promo: {order.promoCode}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'profile' && (
        <div className="promo-view">
          <div className="promo-card">
            <h2>Available Promo Codes</h2>
            <p className="promo-subtitle">Use these codes to get extra discounts on your orders!</p>
            {availablePromoCodes.length === 0 ? (
              <p className="no-promos">No promo codes available at the moment.</p>
            ) : (
              <div className="promo-list">
                {availablePromoCodes.map((promo) => (
                  <div key={promo.code} className="promo-item">
                    <div className="promo-code-badge">{promo.code}</div>
                    <div className="promo-description">{promo.description}</div>
                    <div className="promo-details">
                      {promo.discountType === 'PERCENTAGE' ? (
                        <span className="promo-value">{promo.discountValue}% off</span>
                      ) : (
                        <span className="promo-value">${promo.discountValue} off</span>
                      )}
                      {promo.minOrderAmount && (
                        <span className="promo-min">Min: ${promo.minOrderAmount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'analytics' && (
        <div className="analytics-view">
          <div className="analytics-card">
            <h2>Discount Analytics Dashboard</h2>
            {!stats ? (
              <p className="loading-stats">Loading statistics...</p>
            ) : stats.totalOrders === 0 ? (
              <p className="no-stats">No orders yet. Statistics will appear once orders are placed.</p>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-value">{stats.totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💸</div>
                    <div className="stat-value">${stats.totalSavings.toFixed(2)}</div>
                    <div className="stat-label">Total Savings</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-value">${stats.averageOrderValue.toFixed(2)}</div>
                    <div className="stat-label">Avg Order Value</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{stats.averageDiscount.toFixed(1)}%</div>
                    <div className="stat-label">Avg Discount</div>
                  </div>
                </div>

                <div className="customer-type-breakdown">
                  <h3>Orders by Customer Type</h3>
                  <div className="breakdown-grid">
                    <div className="breakdown-item">
                      <div className="breakdown-badge regular">Regular</div>
                      <div className="breakdown-count">{stats.ordersByCustomerType.REGULAR || 0} orders</div>
                    </div>
                    <div className="breakdown-item">
                      <div className="breakdown-badge loyalty">Loyalty</div>
                      <div className="breakdown-count">{stats.ordersByCustomerType.LOYALTY || 0} orders</div>
                    </div>
                    <div className="breakdown-item">
                      <div className="breakdown-badge vip">VIP</div>
                      <div className="breakdown-count">{stats.ordersByCustomerType.VIP || 0} orders</div>
                    </div>
                    <div className="breakdown-item">
                      <div className="breakdown-badge enterprise">Enterprise</div>
                      <div className="breakdown-count">{stats.ordersByCustomerType.ENTERPRISE || 0} orders</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

export default App;
