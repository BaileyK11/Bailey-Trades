/**
 * ApexTrade Academy - Guided Tour Component
 * Coordinates the step-by-step interactive overlay highlights to teach the user interface
 * and key trading dashboard panels.
 */

export class Tour {
  constructor(steps, appStateRef) {
    this.steps = steps;
    this.appState = appStateRef;
    this.currentStepIndex = -1;
    
    this.overlay = document.getElementById('tutorial-overlay');
    this.card = document.getElementById('tutorial-card');
    this.titleEl = document.getElementById('tutorial-title');
    this.textEl = document.getElementById('tutorial-text');
    this.dotsContainer = document.getElementById('tutorial-progress-dots');
    this.nextBtn = document.getElementById('next-tutorial-btn');
    this.closeBtn = document.getElementById('close-tutorial-btn');
    this.mask = document.getElementById('tutorial-mask');
    
    this.bindEvents();
  }

  bindEvents() {
    this.nextBtn.addEventListener('click', () => this.next());
    this.closeBtn.addEventListener('click', () => this.stop());
    this.mask.addEventListener('click', () => this.stop());
  }

  start() {
    this.currentStepIndex = 0;
    this.overlay.classList.remove('hidden');
    this.card.classList.add('show');
    this.renderStep();
  }

  stop() {
    this.cleanupHighlight();
    this.overlay.classList.add('hidden');
    this.card.classList.remove('show');
    this.currentStepIndex = -1;
    
    // Resume simulation if it was paused for the tour
    if (this.appState.chartControls || this.appState.isPlaying) {
      this.appState.resumeSimulation();
    }
    
    if (this.appState.chart) {
      this.appState.chart.clearHighlight();
    }
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderStep();
    } else {
      this.stop();
    }
  }

  cleanupHighlight() {
    document.querySelectorAll('.highlight-element').forEach(el => {
      el.classList.remove('highlight-element');
    });
  }

  renderStep() {
    this.cleanupHighlight();
    
    const step = this.steps[this.currentStepIndex];
    const targetEl = document.querySelector(step.target);
    
    // Add highlight class
    if (targetEl) {
      targetEl.classList.add('highlight-element');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Position the tour card relative to the highlighted element
      setTimeout(() => {
        this.positionCard(targetEl);
      }, 300); // Wait for potential scrolling to complete
    } else {
      // Center on screen if target element is not found
      this.card.style.top = '50%';
      this.card.style.left = '50%';
      this.card.style.transform = 'translate(-50%, -50%)';
    }

    // Set text
    this.titleEl.textContent = step.title;
    this.textEl.innerHTML = step.text;
    
    // Set button label
    if (this.currentStepIndex === this.steps.length - 1) {
      this.nextBtn.innerHTML = `Finish <i data-lucide="check"></i>`;
    } else {
      this.nextBtn.innerHTML = `Next <i data-lucide="arrow-right"></i>`;
    }
    
    // Render progress dots
    this.dotsContainer.innerHTML = '';
    this.steps.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === this.currentStepIndex ? 'active' : ''}`;
      this.dotsContainer.appendChild(dot);
    });
    
    // Trigger callback
    if (step.onShow) {
      step.onShow(this.appState);
    }
    
    // Refresh Lucide icons inside buttons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Calculate coordinates to render the dialog card adjacent to target
  positionCard(targetEl) {
    const cardRect = this.card.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = 0;
    let left = 0;
    
    // Standard margin between card and element
    const margin = 16;
    
    // Try placing to the right of the element
    if (targetRect.right + cardRect.width + margin < viewportWidth) {
      left = targetRect.right + margin;
      top = targetRect.top + (targetRect.height - cardRect.height) / 2;
    } 
    // Try placing to the left
    else if (targetRect.left - cardRect.width - margin > 0) {
      left = targetRect.left - cardRect.width - margin;
      top = targetRect.top + (targetRect.height - cardRect.height) / 2;
    } 
    // Try placing below
    else if (targetRect.bottom + cardRect.height + margin < viewportHeight) {
      left = targetRect.left + (targetRect.width - cardRect.width) / 2;
      top = targetRect.bottom + margin;
    } 
    // Default place above
    else {
      left = targetRect.left + (targetRect.width - cardRect.width) / 2;
      top = targetRect.top - cardRect.height - margin;
    }
    
    // Bounds clamping to avoid going offscreen
    left = Math.max(margin, Math.min(left, viewportWidth - cardRect.width - margin));
    top = Math.max(margin, Math.min(top, viewportHeight - cardRect.height - margin));
    
    this.card.style.top = `${top + window.scrollY}px`;
    this.card.style.left = `${left + window.scrollX}px`;
    this.card.style.transform = 'none'; // Clear translate center
  }
}

// Define the onboarding steps
export const tourSteps = [
  {
    target: "#header-logo",
    title: "BaileyTrades Tour",
    text: "Welcome to the Simulator! This guided workspace will teach you how to analyze stock indicators and execute trades.",
    onShow: (app) => {
      app.pauseSimulation();
    }
  },
  {
    target: "#view-simulator .chart-card",
    title: "The Candlestick Chart",
    text: "This is a real-time-like price feed. Each candle represents the Open, High, Low, and Close prices of a time period. Green means the price went up; Red means it went down.",
    onShow: (app) => {
      app.pauseSimulation();
    }
  },
  {
    target: "#view-simulator .chart-indicators-menu",
    title: "Technical Analysis Indicators",
    text: "Use these toggles. Click <strong>SMA (20)</strong> to draw the moving average trend line, or <strong>Support & Resistance</strong> to highlight major price floors and ceilings.",
    onShow: (app) => {
      // Temporarily enable indicators for illustration
      app.chart.toggleSMAIndicator(true);
      app.chart.toggleSRIndicator(true);
      document.getElementById('toggle-sma').classList.add('active');
      document.getElementById('toggle-support-resistance').classList.add('active');
    }
  },
  {
    target: "#view-simulator .chart-controls",
    title: "Simulation Speed Control",
    text: "You can **Pause** the feed, step forward **one candle at a time**, or change the tick rate. You can also select a **Scenario** (e.g. Bear Trend, Bounce) to study chart patterns.",
    onShow: (app) => {
      app.chart.toggleSRIndicator(false);
      document.getElementById('toggle-support-resistance').classList.remove('active');
    }
  },
  {
    target: "#view-simulator #order-card-container",
    title: "Order Entry Form",
    text: "This is where you submit paper trades. Select **BUY** or **SELL**, input your share quantity, and verify that your trade satisfies the **Trade Checklist** trend criteria!",
    onShow: (app) => {
      app.pauseSimulation();
    }
  },
  {
    target: "#view-simulator .portfolio-card",
    title: "Your Account Portfolio",
    text: "Track your active positions and performance. Check your holdings, average buy price, current values, and net realized/unrealized profit logs.",
    onShow: (app) => {
      app.pauseSimulation();
    }
  },
  {
    target: ".header-nav button[data-target='lessons']",
    title: "Join the Classroom",
    text: "Click the **Lessons** tab at the top anytime to access step-by-step reading modules, diagrams, concept visualizers, and check your knowledge with quizzes!",
    onShow: (app) => {
      app.pauseSimulation();
    }
  }
];
