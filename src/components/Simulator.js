/**
 * ApexTrade Academy - Simulator Component
 * Manages the paper-trading portfolio state, including balances, active positions, and transaction logs.
 */

export class Simulator {
  constructor(initialBalance = 10000.00) {
    this.initialBalance = initialBalance;
    this.reset();
  }

  reset() {
    this.balance = this.initialBalance;
    this.positions = {}; // Keyed by ticker: { ticker, shares, avgPrice, currentPrice }
    this.ledger = [];    // Array of transaction logs
    this.realizedPnL = 0;
  }

  // Execute buy order
  buy(ticker, shares, price) {
    if (shares <= 0) return { success: false, message: "Quantity must be greater than zero." };
    
    const cost = parseFloat((shares * price).toFixed(2));
    if (cost > this.balance) {
      return { 
        success: false, 
        message: `Insufficient funds. Buying ${shares} shares of ${ticker} costs $${cost.toLocaleString()} but you only have $${this.balance.toLocaleString()}.` 
      };
    }

    this.balance = parseFloat((this.balance - cost).toFixed(2));

    if (!this.positions[ticker]) {
      this.positions[ticker] = {
        ticker,
        shares: 0,
        avgPrice: 0,
        currentPrice: price
      };
    }

    const pos = this.positions[ticker];
    const newShares = pos.shares + shares;
    const newAvgPrice = parseFloat(((pos.shares * pos.avgPrice + cost) / newShares).toFixed(2));
    
    pos.shares = newShares;
    pos.avgPrice = newAvgPrice;
    pos.currentPrice = price;

    // Log transaction
    this.ledger.push({
      time: new Date().toLocaleTimeString(),
      ticker,
      type: "BUY",
      shares,
      price,
      totalCapital: cost,
      realizedPnL: 0
    });

    return { success: true, message: `Successfully bought ${shares} shares of ${ticker} at $${price}.` };
  }

  // Execute sell order
  sell(ticker, shares, price) {
    if (shares <= 0) return { success: false, message: "Quantity must be greater than zero." };
    
    const pos = this.positions[ticker];
    if (!pos || pos.shares < shares) {
      return { 
        success: false, 
        message: `Insufficient position. You only hold ${pos ? pos.shares : 0} shares of ${ticker}.` 
      };
    }

    const proceeds = parseFloat((shares * price).toFixed(2));
    const costBasis = parseFloat((shares * pos.avgPrice).toFixed(2));
    const tradePnL = parseFloat((proceeds - costBasis).toFixed(2));
    
    this.balance = parseFloat((this.balance + proceeds).toFixed(2));
    this.realizedPnL = parseFloat((this.realizedPnL + tradePnL).toFixed(2));
    
    pos.shares -= shares;
    pos.currentPrice = price;

    // Log transaction
    this.ledger.push({
      time: new Date().toLocaleTimeString(),
      ticker,
      type: "SELL",
      shares,
      price,
      totalCapital: proceeds,
      realizedPnL: tradePnL
    });

    // Clean up empty positions
    if (pos.shares === 0) {
      delete this.positions[ticker];
    }

    return { success: true, message: `Successfully sold ${shares} shares of ${ticker} at $${price}.` };
  }

  // Update current prices of active positions
  updatePrices(ticker, currentPrice) {
    if (this.positions[ticker]) {
      this.positions[ticker].currentPrice = currentPrice;
    }
  }

  // Get current account statistics
  getStats() {
    let totalPortfolioVal = this.balance;
    let unrealizedPnL = 0;

    Object.values(this.positions).forEach(pos => {
      const positionValue = pos.shares * pos.currentPrice;
      totalPortfolioVal += positionValue;
      unrealizedPnL += (pos.currentPrice - pos.avgPrice) * pos.shares;
    });

    totalPortfolioVal = parseFloat(totalPortfolioVal.toFixed(2));
    unrealizedPnL = parseFloat(unrealizedPnL.toFixed(2));

    const totalPnL = parseFloat((this.realizedPnL + unrealizedPnL).toFixed(2));
    const totalPnLPercent = this.initialBalance > 0 
      ? parseFloat(((totalPnL / this.initialBalance) * 100).toFixed(2))
      : 0;

    return {
      balance: this.balance,
      totalPortfolioVal,
      unrealizedPnL,
      realizedPnL: this.realizedPnL,
      totalPnL,
      totalPnLPercent
    };
  }

  // Get active positions as an array
  getHoldings() {
    return Object.values(this.positions).map(pos => {
      const marketVal = parseFloat((pos.shares * pos.currentPrice).toFixed(2));
      const costBasis = parseFloat((pos.shares * pos.avgPrice).toFixed(2));
      const pnl = parseFloat((marketVal - costBasis).toFixed(2));
      const pnlPercent = costBasis > 0 ? parseFloat(((pnl / costBasis) * 100).toFixed(2)) : 0;
      
      return {
        ...pos,
        marketVal,
        pnl,
        pnlPercent
      };
    });
  }

  // Get transaction history
  getLedger() {
    return [...this.ledger].reverse(); // Most recent first
  }
}
