/**
 * ApexTrade Academy - Main Application Orchestrator
 * Connects the Market Generator, Charts, Simulator, Lessons, and Tour components.
 * Manages SPA Routing view transitions and tick cycles.
 */

import { generateScenario, generateNextCandle, calculateSMA } from './utils/marketGenerator.js';
import { Simulator } from './components/Simulator.js';
import { Chart } from './components/Chart.js';
import { Tour, tourSteps } from './components/Tour.js';
import { Lessons } from './components/Lessons.js';

// Application State
const appState = {
  ticker: "EDU",
  scenario: "bull-breakout",
  currentPrice: 100.00,
  historicalCandles: [],
  futureCandles: [],
  
  // Current SPA view ("home", "lessons", "simulator")
  currentView: "home",
  
  // Component references
  simulator: null,
  chart: null,        // Simulator Chart
  lessonsChart: null, // Classroom Chart
  lessons: null,
  tour: null,
  
  // Game Loop
  isPlaying: true,
  speedMs: 1000,
  intervalId: null,
  
  // Trade configuration
  tradeType: "BUY", // BUY or SELL
  orderShares: 10,
  
  // Methods to control simulation
  pauseSimulation() {
    this.isPlaying = false;
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
      playPauseBtn.classList.remove('active');
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (window.lucide) window.lucide.createIcons();
  },
  
  resumeSimulation() {
    this.isPlaying = true;
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
      playPauseBtn.classList.add('active');
    }
    this.startInterval();
    if (window.lucide) window.lucide.createIcons();
  },
  
  startInterval() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      appTick();
    }, this.speedMs);
  },
  
  // Switch between Home, Lessons, and Simulator Views
  switchView(viewName, additionalData = null) {
    this.currentView = viewName;
    
    // Hide all view panels
    document.getElementById('view-home').classList.add('hidden');
    document.getElementById('view-simulator').classList.add('hidden');
    document.getElementById('view-lessons').classList.add('hidden');
    
    // Show selected view panel
    document.getElementById(`view-${viewName}`).classList.remove('hidden');
    
    // Update active nav button
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.dataset.target === viewName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Toggle header metrics visibility
    const globalStats = document.getElementById('global-header-stats');
    const startTourBtn = document.getElementById('start-tour-btn');
    
    if (viewName === 'home') {
      globalStats.classList.add('hidden');
      startTourBtn.classList.add('hidden');
      this.pauseSimulation();
      
      // Update progress metrics on home screen
      if (this.lessons) {
        this.lessons.updateProgressText();
        this.lessons.renderHomeRoadmap();
      }
    } 
    else if (viewName === 'simulator') {
      globalStats.classList.remove('hidden');
      startTourBtn.classList.remove('hidden');
      
      // Auto-resize chart and resume running ticks
      setTimeout(() => {
        if (this.chart) this.chart.resize();
      }, 50);
      
      this.resumeSimulation();
    } 
    else if (viewName === 'lessons') {
      globalStats.classList.remove('hidden');
      startTourBtn.classList.add('hidden');
      this.pauseSimulation();
      
      // Load selected lesson index if clicked from roadmap
      if (additionalData !== null) {
        this.lessons.openLesson(additionalData);
      } else {
        this.lessons.showIntro();
      }
      
      // Resize lesson diagram chart
      setTimeout(() => {
        if (this.lessonsChart) this.lessonsChart.resize();
      }, 50);
    }
    
    // Smooth scroll page back to top on view changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

// 1. App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Simulator
  appState.simulator = new Simulator(10000.00);
  
  // Initialize Simulator Chart
  appState.chart = new Chart('trading-chart', 'chart-area-container');
  
  // Initialize Classroom Chart (Concept Visualizer)
  appState.lessonsChart = new Chart('lessons-trading-chart', 'lessons-chart-area-container');
  
  // Initialize Lessons Component
  appState.lessons = new Lessons(appState);
  
  // Initialize Guided Tour
  appState.tour = new Tour(tourSteps, appState);
  
  // Initial simulator scenario generation
  loadSimulatorScenario(appState.scenario);
  
  // Generate static layout dataset for classroom visualizer chart
  loadLessonsChartBase();
  
  // Setup Event Listeners
  setupEventListeners();
  
  // Default to home page dashboard, simulation is paused by default
  appState.switchView('home');
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Update UI stats
  updateUI();
});

// Generate base static candles for classroom visualizer chart
function loadLessonsChartBase() {
  const staticScenario = generateScenario('bull-breakout', 40);
  // Give lessons chart 40 stable starting candles
  appState.lessonsChart.setData(staticScenario.slice(0, 40));
}

// Load a specific market scenario into the Simulator
function loadSimulatorScenario(scenarioType) {
  appState.scenario = scenarioType;
  
  // Generate data
  const allCandles = generateScenario(scenarioType, 40);
  
  // Split into starting 40 candles and future 50 candles
  appState.historicalCandles = allCandles.slice(0, 40);
  appState.futureCandles = allCandles.slice(40);
  
  // Set current price to the latest historical candle close
  const latestCandle = appState.historicalCandles[appState.historicalCandles.length - 1];
  appState.currentPrice = latestCandle.close;
  appState.simulator.updatePrices(appState.ticker, appState.currentPrice);
  
  // Load to chart
  appState.chart.setData(appState.historicalCandles);
  
  // Update Scenario Badge
  const badgeEl = document.getElementById('stock-scenario-badge');
  if (badgeEl) {
    badgeEl.textContent = scenarioType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  updateUI();
}

// 2. Simulation Tick Cycle (runs when simulator view is active)
function appTick() {
  if (appState.currentView !== 'simulator') return;
  
  let nextCandle;
  
  if (appState.futureCandles.length > 0) {
    // Take next candle from pre-generated scenario
    nextCandle = appState.futureCandles.shift();
  } else {
    // Generate random candle continuing the current trend
    const lastCandle = appState.historicalCandles[appState.historicalCandles.length - 1];
    let trendBias = 0.05; // general small upward drift
    if (appState.scenario === 'bear-downtrend') trendBias = -0.15;
    else if (appState.scenario === 'support-bounce') trendBias = 0.08;
    
    nextCandle = generateNextCandle(lastCandle, trendBias, 1.2);
  }
  
  // Push to history
  appState.historicalCandles.push(nextCandle);
  
  // Re-calculate SMA
  calculateSMA(appState.historicalCandles, 20);
  
  // Update price states
  appState.currentPrice = nextCandle.close;
  appState.simulator.updatePrices(appState.ticker, appState.currentPrice);
  
  // Send data to Chart
  appState.chart.setData(appState.historicalCandles);
  
  // Update UI and flash ticker
  updateUI();
  flashPriceIndicator(nextCandle.close >= nextCandle.open);
}

// Flash price ticker green or red on price change
function flashPriceIndicator(isBullish) {
  const priceEl = document.getElementById('stock-current-price');
  if (!priceEl) return;
  
  const originalColor = 'var(--color-text-primary)';
  const flashColor = isBullish ? 'var(--color-accent-green)' : 'var(--color-accent-red)';
  
  priceEl.style.color = flashColor;
  priceEl.style.textShadow = `0 0 10px ${flashColor}`;
  
  setTimeout(() => {
    priceEl.style.color = originalColor;
    priceEl.style.textShadow = 'none';
  }, 180);
}

// 3. User Interface Rendering
function updateUI() {
  const stats = appState.simulator.getStats();
  
  // Stats update in Header
  document.getElementById('header-balance').textContent = `$${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  const valEl = document.getElementById('header-portfolio-val');
  valEl.textContent = `$${stats.totalPortfolioVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  const pnlEl = document.getElementById('header-total-pnl');
  const pnlSign = stats.totalPnL >= 0 ? '+' : '';
  pnlEl.textContent = `${pnlSign}$${stats.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${pnlSign}${stats.totalPnLPercent.toFixed(2)}%)`;
  
  pnlEl.className = stats.totalPnL > 0 ? 'stat-value text-accent-green' : stats.totalPnL < 0 ? 'stat-value text-accent-red' : 'stat-value';
  
  // Current Ticker Price Info
  document.getElementById('stock-current-price').textContent = `$${appState.currentPrice.toFixed(2)}`;
  
  const priceChangeEl = document.getElementById('stock-price-change');
  const prevCandle = appState.historicalCandles[appState.historicalCandles.length - 2];
  if (prevCandle) {
    const change = appState.currentPrice - prevCandle.close;
    const changePct = (change / prevCandle.close) * 100;
    const sign = change >= 0 ? '+' : '';
    priceChangeEl.textContent = `${sign}$${change.toFixed(2)} (${sign}${changePct.toFixed(2)}%)`;
    priceChangeEl.className = change >= 0 ? 'price-change text-accent-green' : 'price-change text-accent-red';
  }

  // Update Available Cash in Order Panel
  document.getElementById('order-available-cash').textContent = `$${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  // Update Estimated Cost
  const estCost = parseFloat((appState.orderShares * appState.currentPrice).toFixed(2));
  document.getElementById('order-est-cost').textContent = `$${estCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  // Update active positions table
  renderHoldingsTable();
  
  // Update ledger table
  renderLedgerTable();
  
  // Update Checklist ticks
  updateChecklist();
  
  // Toggle submit buttons styling based on cash availability
  const submitBtn = document.getElementById('submit-order-btn');
  if (submitBtn) {
    if (appState.tradeType === 'BUY') {
      submitBtn.textContent = `BUY ${appState.ticker}`;
      submitBtn.className = 'order-btn buy-btn';
      if (estCost > stats.balance) {
        submitBtn.style.opacity = '0.5';
        submitBtn.title = "Insufficient cash balance";
      } else {
        submitBtn.style.opacity = '1';
        submitBtn.title = "";
      }
    } else {
      submitBtn.textContent = `SELL ${appState.ticker}`;
      submitBtn.className = 'order-btn sell-btn';
      const hasPosition = appState.simulator.getHoldings().find(h => h.ticker === appState.ticker);
      if (!hasPosition || hasPosition.shares < appState.orderShares) {
        submitBtn.style.opacity = '0.5';
        submitBtn.title = "Insufficient position size";
      } else {
        submitBtn.style.opacity = '1';
        submitBtn.title = "";
      }
    }
  }
}

// Render the Portfolio Holdings Table
function renderHoldingsTable() {
  const body = document.getElementById('holdings-list-body');
  if (!body) return;
  
  const holdings = appState.simulator.getHoldings();
  
  if (holdings.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="text-muted text-center py-4">No active positions. Check the Order Form to make your first trade!</td></tr>`;
    return;
  }
  
  body.innerHTML = '';
  holdings.forEach(pos => {
    const row = document.createElement('tr');
    const pnlClass = pos.pnl >= 0 ? 'text-accent-green' : 'text-accent-red';
    const pnlSign = pos.pnl >= 0 ? '+' : '';
    
    row.innerHTML = `
      <td style="font-weight: 600;">${pos.ticker}</td>
      <td>${pos.shares}</td>
      <td>$${pos.avgPrice.toFixed(2)}</td>
      <td>$${pos.currentPrice.toFixed(2)}</td>
      <td>$${pos.marketVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      <td class="${pnlClass}" style="font-weight: 600;">${pnlSign}$${pos.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${pnlSign}${pos.pnlPercent.toFixed(2)}%)</td>
      <td><button class="secondary-btn btn-sell-all" data-ticker="${pos.ticker}" data-shares="${pos.shares}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Sell All</button></td>
    `;
    
    row.querySelector('.btn-sell-all').addEventListener('click', (e) => {
      const ticker = e.target.dataset.ticker;
      const shares = parseInt(e.target.dataset.shares);
      
      appState.pauseSimulation();
      const res = appState.simulator.sell(ticker, shares, appState.currentPrice);
      alert(res.message);
      
      updateUI();
      appState.resumeSimulation();
    });
    
    body.appendChild(row);
  });
}

// Render the Ledger History Table
function renderLedgerTable() {
  const body = document.getElementById('ledger-list-body');
  if (!body) return;
  
  const ledger = appState.simulator.getLedger();
  
  if (ledger.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="text-muted text-center py-4">No trading history yet.</td></tr>`;
    return;
  }
  
  body.innerHTML = '';
  ledger.forEach(log => {
    const row = document.createElement('tr');
    
    const typeClass = log.type === 'BUY' ? 'text-accent-green' : 'text-accent-red';
    let pnlCell = '<td class="text-muted">-</td>';
    if (log.type === 'SELL') {
      const pnlClass = log.realizedPnL >= 0 ? 'text-accent-green' : 'text-accent-red';
      const sign = log.realizedPnL >= 0 ? '+' : '';
      pnlCell = `<td class="${pnlClass}" style="font-weight:600;">${sign}$${log.realizedPnL.toFixed(2)}</td>`;
    }
    
    row.innerHTML = `
      <td class="text-muted">${log.time}</td>
      <td style="font-weight:600;">${log.ticker}</td>
      <td class="${typeClass}" style="font-weight:600;">${log.type}</td>
      <td>${log.shares}</td>
      <td>$${log.price.toFixed(2)}</td>
      <td>$${log.totalCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      ${pnlCell}
    `;
    body.appendChild(row);
  });
}

// Update the dynamic educational checklist
function updateChecklist() {
  const latestCandle = appState.historicalCandles[appState.historicalCandles.length - 1];
  if (!latestCandle) return;
  
  const chkTrend = document.getElementById('chk-trend');
  const chkSR = document.getElementById('chk-sr');
  const chkRisk = document.getElementById('chk-risk');
  
  if (!chkTrend || !chkSR || !chkRisk) return;
  
  // 1. Trend Rule: Price must be above SMA(20) for BUY
  const isAboveSMA = latestCandle.sma !== null && latestCandle.close > latestCandle.sma;
  const isTrendOk = appState.tradeType === 'BUY' ? isAboveSMA : !isAboveSMA;
  
  if (isTrendOk) {
    chkTrend.className = 'checked';
    chkTrend.querySelector('svg').outerHTML = '<i data-lucide="check-circle" style="color:var(--color-accent-green); width:14px; height:14px;"></i>';
  } else {
    chkTrend.className = '';
    chkTrend.querySelector('svg').outerHTML = '<i data-lucide="circle" style="color:var(--color-text-muted); width:14px; height:14px;"></i>';
  }
  
  // 2. Resistance Rule: Check if we are directly buying right below the ceiling
  const nearResistance = latestCandle.close >= 103.50 && latestCandle.close <= 106.00;
  const isSROk = appState.tradeType === 'BUY' ? !nearResistance : nearResistance;
  
  if (isSROk) {
    chkSR.className = 'checked';
    chkSR.querySelector('svg').outerHTML = '<i data-lucide="check-circle" style="color:var(--color-accent-green); width:14px; height:14px;"></i>';
  } else {
    chkSR.className = '';
    chkSR.querySelector('svg').outerHTML = '<i data-lucide="circle" style="color:var(--color-text-muted); width:14px; height:14px;"></i>';
  }
  
  // 3. Risk Reward: Favorable if buying near support floor ($94 - $98)
  const nearSupport = latestCandle.close >= 94.00 && latestCandle.close <= 98.00;
  const isRiskOk = appState.tradeType === 'BUY' ? (nearSupport || isTrendOk) : (!nearSupport || !isTrendOk);
  
  if (isRiskOk) {
    chkRisk.className = 'checked';
    chkRisk.querySelector('svg').outerHTML = '<i data-lucide="check-circle" style="color:var(--color-accent-green); width:14px; height:14px;"></i>';
  } else {
    chkRisk.className = '';
    chkRisk.querySelector('svg').outerHTML = '<i data-lucide="circle" style="color:var(--color-text-muted); width:14px; height:14px;"></i>';
  }
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 4. UI Actions & Event Bindings
function setupEventListeners() {
  // Bind top navbar tabs switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      appState.switchView(e.currentTarget.dataset.target);
    });
  });
  
  // Header Logo click goes back Home
  document.getElementById('header-logo').addEventListener('click', () => {
    appState.switchView('home');
  });

  // Enter Mode buttons on Home Screen
  document.querySelectorAll('.btn-enter-lessons').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.switchView('lessons');
    });
  });
  
  document.querySelectorAll('.btn-enter-simulator').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.switchView('simulator');
    });
  });

  // Play / Pause Button (Simulator view)
  document.getElementById('play-pause-btn').addEventListener('click', () => {
    if (appState.isPlaying) {
      appState.pauseSimulation();
    } else {
      appState.resumeSimulation();
    }
  });
  
  // Step Forward Button (Simulator view)
  document.getElementById('step-forward-btn').addEventListener('click', () => {
    appState.pauseSimulation();
    appTick();
  });
  
  // Speed Buttons (Simulator view)
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      appState.speedMs = parseInt(e.target.dataset.speed);
      if (appState.isPlaying && appState.currentView === 'simulator') {
        appState.startInterval();
      }
    });
  });
  
  // Market Scenario Selector
  document.getElementById('scenario-selector').addEventListener('change', (e) => {
    appState.pauseSimulation();
    loadSimulatorScenario(e.target.value);
    appState.resumeSimulation();
  });
  
  // Reset Simulation Button
  document.getElementById('reset-sim-btn').addEventListener('click', () => {
    appState.pauseSimulation();
    if (confirm("Are you sure you want to reset your virtual portfolio balance, trade history, and lessons progress?")) {
      appState.simulator.reset();
      loadSimulatorScenario(appState.scenario);
      appState.lessons.resetProgress();
      appState.switchView('home');
    }
    appState.resumeSimulation();
  });
  
  // Start Guided Tour Button (Simulator view)
  document.getElementById('start-tour-btn').addEventListener('click', () => {
    appState.tour.start();
  });
  
  // Tab Switching (Holdings vs Ledger History in Simulator)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const tabName = e.target.dataset.tab;
      if (tabName === 'holdings') {
        document.getElementById('tab-holdings').classList.remove('hidden');
        document.getElementById('tab-history').classList.add('hidden');
      } else {
        document.getElementById('tab-holdings').classList.add('hidden');
        document.getElementById('tab-history').classList.remove('hidden');
      }
    });
  });
  
  // Indicator Menu Toggles (Simulator View)
  document.getElementById('toggle-sma').addEventListener('click', (e) => {
    const isActive = e.currentTarget.classList.toggle('active');
    appState.chart.toggleSMAIndicator(isActive);
  });
  
  document.getElementById('toggle-support-resistance').addEventListener('click', (e) => {
    const isActive = e.currentTarget.classList.toggle('active');
    appState.chart.toggleSRIndicator(isActive);
  });
  
  // Order Type Toggles (BUY/SELL)
  document.getElementById('btn-buy').addEventListener('click', (e) => {
    document.getElementById('btn-sell').classList.remove('active');
    e.target.classList.add('active');
    appState.tradeType = "BUY";
    updateUI();
  });
  
  document.getElementById('btn-sell').addEventListener('click', (e) => {
    document.getElementById('btn-buy').classList.remove('active');
    e.target.classList.add('active');
    appState.tradeType = "SELL";
    updateUI();
  });
  
  // Shares adjustment input
  const sharesInput = document.getElementById('order-shares');
  
  document.getElementById('qty-minus').addEventListener('click', () => {
    let val = parseInt(sharesInput.value) || 10;
    if (val > 1) {
      sharesInput.value = val - 1;
      appState.orderShares = val - 1;
      updateUI();
    }
  });
  
  document.getElementById('qty-plus').addEventListener('click', () => {
    let val = parseInt(sharesInput.value) || 10;
    sharesInput.value = val + 1;
    appState.orderShares = val + 1;
    updateUI();
  });
  
  sharesInput.addEventListener('input', (e) => {
    let val = parseInt(e.target.value) || 1;
    if (val < 1) val = 1;
    e.target.value = val;
    appState.orderShares = val;
    updateUI();
  });
  
  // Submit Order Execution
  document.getElementById('submit-order-btn').addEventListener('click', () => {
    appState.pauseSimulation();
    
    let res;
    if (appState.tradeType === 'BUY') {
      res = appState.simulator.buy(appState.ticker, appState.orderShares, appState.currentPrice);
    } else {
      res = appState.simulator.sell(appState.ticker, appState.orderShares, appState.currentPrice);
    }
    
    alert(res.message);
    
    updateUI();
    appState.resumeSimulation();
  });
}
