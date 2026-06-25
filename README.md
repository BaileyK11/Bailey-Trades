# 📈 BaileyTrades Academy

Welcome to **BaileyTrades Academy**, an interactive educational trading platform designed to teach aspiring investors how to navigate the stock market properly, build data-driven strategies, and make informed financial decisions. 

Whether you are a complete beginner or looking to refine your risk management, BaileyTrades provides a safe, simulated environment paired with real-world market intelligence to fast-track your investing journey.

---

## 🎯 Our Mission: Proper Investing Made Accessible

Many new investors fail because they treat the stock market like a casino—buying at peak resistance, ignoring trends, and taking on outsized risks. **BaileyTrades Academy** is built to change that by focusing on three core pillars of successful investing:

1. **Trend Identification**: Learning to trade *with* the market's momentum (the trend is your friend) using technical indicators like the 20-period Simple Moving Average (SMA).
2. **Support & Resistance**: Visualizing supply and demand zones to buy near support floors and manage positions near resistance ceilings.
3. **Risk Management**: Teaching proper position sizing and risk-to-reward ratios so that a single bad trade does not wipe out your capital.
4. **Social & Copy Learning**: Learning the best ways to invest by following historical and simulated trades, understanding why experienced market participants make specific decisions, and learning to copy high-probability trading setups.

---

## 🚀 Key Features

### 1. 🎓 Interactive Classroom & Lessons
* **Curriculum-Driven Learning**: Interactive lessons covering Support & Resistance, Trend Following, and Risk Management.
* **Concept Visualizer**: A dedicated sandbox chart that lets you visually see patterns (e.g., bull flag breakout) as you learn them.
* **Progress Tracking**: Lock in lessons as you complete quizzes and execute trade scenarios.

### 2. 🎮 Market Simulator
* **Real-time Charting**: A custom candlestick chart showing price actions.
* **Scenario Practice**: Trade through pre-programmed scenarios (e.g., *Bull Breakout*, *Bear Downtrend*, *Support Bounce*) or dynamic random markets.
* **Indicators Toolkit**: Toggle live indicators like SMA and Support/Resistance bands directly on the chart.
* **Real-time Portfolio Ledger**: Track your virtual cash balance, active holdings, average costs, and realized/unrealized profit & loss (PnL).

### 3. 📊 Live Market Trends & News
* **Yahoo Finance Integration**: A live dashboard fetching real-time price quotes, price changes, and volumes for the Top 100 stock market tickers.
* **Interactive Market Table**: Sort, search, and filter tickers by categories (e.g., gainers, losers, active megacaps).
* **Marquee News Ticker**: Seamless scrolling news banner compiling recent marquee headlines for major indices and tech giants.

### 4. 🧭 Guided Onboarding Tour
* An interactive step-by-step walkthrough to get you acquainted with the simulator controls, indicator buttons, and order execution panel.

---

## 💻 Tech Stack

### Frontend
- **HTML5 & Vanilla Javascript (ES6)**: Modular components architecture (`Simulator.js`, `Chart.js`, `Lessons.js`, `Tour.js`).
- **Vanilla CSS**: Premium dark-mode glassmorphism interface design with smooth transitions and micro-animations.
- **Vite**: Ultra-fast hot-module reloading and asset bundling.
- **Lucide Icons**: Crisp vector icons.

### Backend
- **Python (Flask)**: Serves a lightweight API at port `5001`.
- **yfinance (v1.4.1+)**: Optimally handles batch downloading of market trends and recent ticker news.
- **curl_cffi**: Safely bypasses Yahoo Finance web-scraping rate limits for consistent data updates.
- **Pandas**: Used for robust formatting of financial data frames.

---

## 🛠️ Local Installation & Setup

You can choose to run the application either using **Docker (recommended for a quick start)** or by running the services **manually**.

---

### 🐳 Option A: Run with Docker (Recommended)

Make sure you have [Docker](https://www.docker.com/) installed and running.

#### 1. Development Mode (with Hot-Reloading)
To build and start both the frontend and backend services together in development mode:
```bash
docker compose up --build
```
* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5001](http://localhost:5001)

Any modifications you make to local files will automatically sync and hot-reload inside the running containers.

#### 2. Production Mode (Served via Nginx)
To build and run the optimized production configuration:
```bash
docker compose -f docker-compose.prod.yml up --build
```
* **Frontend**: [http://localhost](http://localhost) (Port 80)
* **Backend API**: [http://localhost:5001](http://localhost:5001)

---

### 💻 Option B: Manual Setup

#### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Python 3.12](https://www.python.org/)

#### Step 1: Set up the Backend API
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create and activate a Python 3.12 virtual environment:
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate
   ```
3. Install the required backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask development server:
   ```bash
   python app.py
   ```
   *The server will start running on [http://localhost:5001](http://localhost:5001).*

#### Step 2: Set up the Frontend
1. Return to the root project directory:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will start running on [http://localhost:3000](http://localhost:3000).*

---

## 📈 Learn. Practice. Succeed.
Never invest money you cannot afford to lose. Use BaileyTrades Academy to test your theories, build discipline, and master the markets before risking real-world capital!