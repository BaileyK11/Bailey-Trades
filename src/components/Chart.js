/**
 * ApexTrade Academy - Chart Component
 * Renders an interactive, custom candlestick chart on an HTML5 Canvas.
 * Supports Moving Average lines, Support & Resistance lines, and interactive highlights.
 */

export class Chart {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.ctx = this.canvas.getContext('2d');
    
    this.candles = [];
    this.visibleCount = 35; // Number of candles to display at a time
    this.startIndex = 0;
    
    // Toggles
    this.showSMA = true;
    this.showSR = false;
    
    // Highlights & Annotations (For guided lessons)
    this.highlightedCandleIndex = null;
    this.annotations = []; // Array of { index, text, type }
    
    // Interactive mouse state
    this.hoverIndex = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isHovering = false;
    
    this.setupListeners();
    this.resize();
  }

  // Handle high-DPI displays for crisp rendering
  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual canvas buffer size
    this.canvas.width = rect.width * dpr;
    this.canvas.height = Math.max(300, rect.height) * dpr;
    
    // Scale drawings back down in CSS pixels
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${Math.max(300, rect.height)}px`;
    
    this.draw();
  }

  setupListeners() {
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.isHovering = true;
      this.updateHoverIndex();
      this.draw();
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.hoverIndex = null;
      document.getElementById('chart-tooltip').classList.add('hidden');
      this.draw();
    });
  }

  // Determine which candle the mouse is over
  updateHoverIndex() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const paddingLeft = 15;
    const paddingRight = 60;
    const chartWidth = width - paddingLeft - paddingRight;
    
    const visibleCandles = this.getVisibleCandles();
    if (visibleCandles.length === 0) return;
    
    const candleWidth = chartWidth / visibleCandles.length;
    
    if (this.mouseX >= paddingLeft && this.mouseX <= width - paddingRight) {
      const relativeX = this.mouseX - paddingLeft;
      const index = Math.floor(relativeX / candleWidth);
      if (index >= 0 && index < visibleCandles.length) {
        this.hoverIndex = this.startIndex + index;
        this.showTooltip(visibleCandles[index]);
        return;
      }
    }
    
    this.hoverIndex = null;
    document.getElementById('chart-tooltip').classList.add('hidden');
  }

  // Show HTML tooltip with candle values
  showTooltip(candle) {
    const tooltip = document.getElementById('chart-tooltip');
    tooltip.classList.remove('hidden');
    
    // Set position slightly offsets from mouse
    tooltip.style.left = `${this.mouseX + 20}px`;
    tooltip.style.top = `${this.mouseY - 30}px`;
    
    const isBullish = candle.close >= candle.open;
    const colorClass = isBullish ? 'text-accent-green' : 'text-accent-red';
    
    tooltip.innerHTML = `
      <div style="font-weight:700; margin-bottom: 2px;">Candle #${candle.time}</div>
      <div>Open: <span style="font-variant-numeric: tabular-nums;">$${candle.open.toFixed(2)}</span></div>
      <div>High: <span style="font-variant-numeric: tabular-nums;">$${candle.high.toFixed(2)}</span></div>
      <div>Low: <span style="font-variant-numeric: tabular-nums;">$${candle.low.toFixed(2)}</span></div>
      <div>Close: <span class="${colorClass}" style="font-variant-numeric: tabular-nums;">$${candle.close.toFixed(2)}</span></div>
      <div style="color:var(--color-text-muted);">Volume: ${candle.volume.toLocaleString()}</div>
    `;
  }

  // Set the dataset and slide the view index to show latest candles
  setData(candles) {
    this.candles = candles;
    this.updateViewport();
    this.draw();
  }

  // Position the viewport to show the latest candles
  updateViewport() {
    if (this.candles.length <= this.visibleCount) {
      this.startIndex = 0;
    } else {
      this.startIndex = this.candles.length - this.visibleCount;
    }
  }

  getVisibleCandles() {
    return this.candles.slice(this.startIndex, this.startIndex + this.visibleCount);
  }

  // Main Drawing Function
  draw() {
    if (this.candles.length === 0) return;
    
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    const paddingTop = 30;
    const paddingBottom = 40;
    const paddingLeft = 15;
    const paddingRight = 60;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    this.ctx.clearRect(0, 0, width, height);
    
    const visibleCandles = this.getVisibleCandles();
    
    // 1. Calculate price range for scaling
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    visibleCandles.forEach(candle => {
      if (candle.low < minPrice) minPrice = candle.low;
      if (candle.high > maxPrice) maxPrice = candle.high;
      if (this.showSMA && candle.sma !== null) {
        if (candle.sma < minPrice) minPrice = candle.sma;
        if (candle.sma > maxPrice) maxPrice = candle.sma;
      }
    });
    
    // Add 10% padding to top/bottom
    const priceRange = maxPrice - minPrice;
    minPrice = parseFloat((minPrice - priceRange * 0.08).toFixed(2));
    maxPrice = parseFloat((maxPrice + priceRange * 0.08).toFixed(2));
    const activeRange = maxPrice - minPrice;
    
    // Coordinate mapping functions
    const getX = (index) => {
      const candleWidth = chartWidth / visibleCandles.length;
      return paddingLeft + index * candleWidth + (candleWidth * 0.1);
    };
    
    const getY = (price) => {
      return height - paddingBottom - ((price - minPrice) / activeRange) * chartHeight;
    };
    
    const getCandleWidth = () => {
      const cw = chartWidth / visibleCandles.length;
      return cw * 0.8;
    };

    // 2. Draw Gridlines & Y-Axis Labels
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#64748b'; // var(--color-text-muted)
    this.ctx.font = '10px Inter';
    this.ctx.textAlign = 'left';
    
    const gridLinesCount = 5;
    for (let i = 0; i <= gridLinesCount; i++) {
      const price = minPrice + (activeRange * (i / gridLinesCount));
      const y = getY(price);
      
      // Horizontal grid line
      this.ctx.beginPath();
      this.ctx.moveTo(paddingLeft, y);
      this.ctx.lineTo(width - paddingRight, y);
      this.ctx.stroke();
      
      // Price tag label
      this.ctx.fillText(`$${price.toFixed(2)}`, width - paddingRight + 8, y + 3);
    }
    
    // 3. Draw Support and Resistance Levels (if enabled)
    if (this.showSR) {
      // Draw Support Floor around $95 (dashed cyan ribbon)
      const supportY = getY(95.00);
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(paddingLeft, supportY);
      this.ctx.lineTo(width - paddingRight, supportY);
      this.ctx.stroke();
      
      this.ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
      this.ctx.fillRect(paddingLeft, supportY - 4, chartWidth, 8);
      
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.font = 'bold 9px Inter';
      this.ctx.fillText('Key Support Floor ($95.00)', paddingLeft + 10, supportY - 8);
      
      // Draw Resistance Ceiling around $105 (dashed rose ribbon)
      const resistanceY = getY(105.00);
      this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      this.ctx.beginPath();
      this.ctx.moveTo(paddingLeft, resistanceY);
      this.ctx.lineTo(width - paddingRight, resistanceY);
      this.ctx.stroke();
      
      this.ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';
      this.ctx.fillRect(paddingLeft, resistanceY - 4, chartWidth, 8);
      
      this.ctx.fillStyle = '#f43f5e';
      this.ctx.fillText('Key Resistance Ceiling ($105.00)', paddingLeft + 10, resistanceY - 8);
      
      this.ctx.restore();
    }
    
    // 4. Draw Volumes at the bottom (translucent bars)
    let maxVolume = 0;
    visibleCandles.forEach(c => { if (c.volume > maxVolume) maxVolume = c.volume; });
    const volumeHeight = chartHeight * 0.15;
    
    visibleCandles.forEach((candle, index) => {
      const x = getX(index);
      const w = getCandleWidth();
      const pct = candle.volume / (maxVolume || 1);
      const h = volumeHeight * pct;
      const y = height - paddingBottom - h;
      
      this.ctx.fillStyle = candle.close >= candle.open ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';
      this.ctx.fillRect(x, y, w, h);
    });

    // 5. Draw Candlesticks (Wicks and Bodies)
    visibleCandles.forEach((candle, index) => {
      const globalIndex = this.startIndex + index;
      const x = getX(index);
      const w = getCandleWidth();
      const openY = getY(candle.open);
      const closeY = getY(candle.close);
      const highY = getY(candle.high);
      const lowY = getY(candle.low);
      
      const isBullish = candle.close >= candle.open;
      const color = isBullish ? '#10b981' : '#f43f5e';
      
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1.5;
      
      // Draw wick
      this.ctx.beginPath();
      this.ctx.moveTo(x + w/2, highY);
      this.ctx.lineTo(x + w/2, lowY);
      this.ctx.stroke();
      
      // Draw body
      this.ctx.fillStyle = color;
      const bodyH = Math.max(1.5, Math.abs(closeY - openY));
      const bodyY = Math.min(openY, closeY);
      
      this.ctx.fillRect(x, bodyY, w, bodyH);
      
      // Highlight a specific candle for educational reference
      if (this.highlightedCandleIndex === globalIndex) {
        this.ctx.save();
        this.ctx.strokeStyle = '#eab308'; // glowing gold border
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#eab308';
        this.ctx.strokeRect(x - 3, bodyY - 3, w + 6, bodyH + 6);
        this.ctx.restore();
      }
    });

    // 6. Draw Indicators: SMA(20) line
    if (this.showSMA) {
      this.ctx.save();
      this.ctx.strokeStyle = '#eab308'; // Gold line for SMA
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      
      let activeLine = false;
      visibleCandles.forEach((candle, index) => {
        if (candle.sma === null) return;
        const x = getX(index) + getCandleWidth() / 2;
        const y = getY(candle.sma);
        
        if (!activeLine) {
          this.ctx.moveTo(x, y);
          activeLine = true;
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 7. Draw Reticle crosshair on hover
    if (this.isHovering && this.hoverIndex !== null) {
      const hoverVisIndex = this.hoverIndex - this.startIndex;
      if (hoverVisIndex >= 0 && hoverVisIndex < visibleCandles.length) {
        const x = getX(hoverVisIndex) + getCandleWidth() / 2;
        
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        
        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(x, paddingTop);
        this.ctx.lineTo(x, height - paddingBottom);
        this.ctx.stroke();
        
        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(paddingLeft, this.mouseY);
        this.ctx.lineTo(width - paddingRight, this.mouseY);
        this.ctx.stroke();
        
        this.ctx.restore();
      }
    }
  }

  // API to set toggles
  toggleSMAIndicator(visible) {
    this.showSMA = visible;
    this.draw();
  }

  toggleSRIndicator(visible) {
    this.showSR = visible;
    this.draw();
  }

  // API to set glowing educational highlights
  setHighlight(index) {
    this.highlightedCandleIndex = index;
    this.draw();
  }

  clearHighlight() {
    this.highlightedCandleIndex = null;
    this.draw();
  }
}
