/**
 * ApexTrade Academy - Market Generator Utility
 * Generates structured, realistic mock candlestick data and supports different educational scenarios.
 */

// Generate a random walk candle
export function generateNextCandle(prevCandle, trendBias = 0, volatility = 1.5, startPrice = null) {
  const open = startPrice !== null ? startPrice : prevCandle.close;
  const timeIndex = prevCandle ? prevCandle.time + 1 : 0;
  
  // Random fluctuation with a bias
  const changePercent = (Math.random() - 0.5 + trendBias) * volatility;
  const close = parseFloat((open * (1 + changePercent / 100)).toFixed(2));
  
  // Calculate high and low based on random ranges extending from open/close
  const highMargin = Math.random() * volatility * 0.6;
  const lowMargin = Math.random() * volatility * 0.6;
  
  const highestOfBody = Math.max(open, close);
  const lowestOfBody = Math.min(open, close);
  
  const high = parseFloat((highestOfBody * (1 + highMargin / 100)).toFixed(2));
  const low = parseFloat((lowestOfBody * (1 - lowMargin / 100)).toFixed(2));
  
  // Volume: base + random spike
  const baseVolume = 10000;
  const volumeSpike = trendBias !== 0 ? Math.abs(trendBias) * 15000 : 0;
  const volume = Math.round(baseVolume + volumeSpike + Math.random() * 8000);
  
  return {
    time: timeIndex,
    open,
    high,
    low,
    close,
    volume
  };
}

// Generate an entire scenario array of candles
export function generateScenario(scenarioType, initialCandlesCount = 40) {
  let candles = [];
  let currentPrice = 100.00;
  
  // Initial baseline (slightly sideways or mild uptrend)
  let prev = { close: currentPrice, time: -1 };
  for (let i = 0; i < initialCandlesCount; i++) {
    const next = generateNextCandle(prev, 0.05, 1.0);
    candles.push(next);
    prev = next;
  }
  
  // Append future candles depending on the selected scenario
  // We can pre-generate a sequence of say 80 candles total, or generate them dynamically.
  // Pre-generating 80 candles allows us to have a fixed, highly educational path.
  // Let's generate a full set of 90 candles. The user sees the first 40, and the simulator
  // feeds the remaining 50 candles one by one when they press Play or Step.
  
  let trendBiases = [];
  switch (scenarioType) {
    case 'bull-breakout':
      // Sideways consolidation first, then sharp breakout
      // Candles 40-55: consolidates tightly around 102 - 105 (slight negative bias to build pressure)
      for (let i = 0; i < 15; i++) trendBiases.push(-0.05);
      // Candles 56-65: Breakout! Strong positive bias, higher volume
      for (let i = 0; i < 10; i++) trendBiases.push(0.5);
      // Candles 66-80: Consolidation near the highs
      for (let i = 0; i < 15; i++) trendBiases.push(0.02);
      // Candles 81-90: Final small leg up
      for (let i = 0; i < 10; i++) trendBiases.push(0.15);
      break;

    case 'bear-downtrend':
      // Downtrend channel
      // Candles 40-50: mild drop
      for (let i = 0; i < 10; i++) trendBiases.push(-0.15);
      // Candles 51-65: breakdown of key level, sharp selloff
      for (let i = 0; i < 15; i++) trendBiases.push(-0.4);
      // Candles 66-80: brief dead cat bounce (short upward retracement)
      for (let i = 0; i < 15; i++) trendBiases.push(0.15);
      // Candles 81-90: further descent
      for (let i = 0; i < 10; i++) trendBiases.push(-0.25);
      break;

    case 'support-bounce':
      // Drop down to support floor at $95, consolidate, then bounce
      // Candles 40-52: Drop toward $95
      for (let i = 0; i < 12; i++) trendBiases.push(-0.25);
      // Candles 53-62: Sideways resting on the $95 support line
      for (let i = 0; i < 10; i++) trendBiases.push(-0.02);
      // Candles 63-75: Bounce off support! Strong reversal upward
      for (let i = 0; i < 13; i++) trendBiases.push(0.35);
      // Candles 76-90: Mild continuation
      for (let i = 0; i < 15; i++) trendBiases.push(0.05);
      break;

    case 'high-volatility':
      // Choppy range bound market with wide swings
      // Candles 40-50: Swing high
      for (let i = 0; i < 10; i++) trendBiases.push(0.35);
      // Candles 51-62: Swing low
      for (let i = 0; i < 12; i++) trendBiases.push(-0.4);
      // Candles 63-75: Swing high again
      for (let i = 0; i < 13; i++) trendBiases.push(0.45);
      // Candles 76-90: Crash down
      for (let i = 0; i < 15; i++) trendBiases.push(-0.35);
      break;
      
    default:
      for (let i = 0; i < 50; i++) trendBiases.push(0.05);
  }
  
  // Generate the rest of the scenario candles
  for (let bias of trendBiases) {
    const next = generateNextCandle(prev, bias, scenarioType === 'high-volatility' ? 2.5 : 1.2);
    candles.push(next);
    prev = next;
  }
  
  // Calculate Simple Moving Average (SMA 20) for all candles
  calculateSMA(candles, 20);
  
  return candles;
}

// Calculate the Simple Moving Average (SMA) and write it directly into the candle objects
export function calculateSMA(candles, period = 20) {
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      candles[i].sma = null; // Not enough data points
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += candles[i - j].close;
    }
    candles[i].sma = parseFloat((sum / period).toFixed(2));
  }
}
