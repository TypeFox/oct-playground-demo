import { useState } from 'react';
import { CustomerType, DiscountResponse } from './types';
import './App.css';

function App() {
  const [customerType, setCustomerType] = useState<CustomerType>('REGULAR');
  const [amount, setAmount] = useState<string>('100');
  const [result, setResult] = useState<DiscountResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      </header>

      <main className="main-content">
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
      </main>
    </div>
  );
}

export default App;
