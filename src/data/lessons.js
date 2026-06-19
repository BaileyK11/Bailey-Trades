export const lessons = [
  {
    id: 1,
    title: "Introduction to Stock Trading",
    shortDescription: "What is a stock, how do markets work, and why do prices fluctuate?",
    icon: "book-open",
    content: `
      <p>Welcome to the world of trading! To build a solid foundation, let's go deep into the mechanics of what stocks are, why they exist, and how they trade.</p>
      
      <h4>1. What is a Stock? (Fractional Ownership)</h4>
      <p>A <strong>stock</strong> (also called a <strong>share</strong> or <strong>equity</strong>) represents fractional ownership in a corporation. When a company decides to "go public," it divides its overall value into millions of tiny pieces called shares.</p>
      <p><em>Imagine a local pizza bakery valued at $10,000.</em> If the owner divides the business into 100 shares, each share is worth $100 and represents 1% ownership. If you buy 10 shares, you own 10% of the bakery. As the bakery sells more pizza, opens new locations, and grows its profits, the value of the entire business might rise to $50,000. Your 10% slice is now worth $5,000! You can sell your shares to someone else for a $4,000 profit. This is called <strong>Capital Appreciation</strong>.</p>
      
      <h4>2. Why Do Companies Issue Stock? (The IPO)</h4>
      <p>Businesses require cash to grow. A private company can raise money by borrowing from a bank, or by selling shares to the public in an <strong>Initial Public Offering (IPO)</strong>.</p>
      <p>By listing its shares on public exchanges (like the New York Stock Exchange or NASDAQ), a company raises millions (or billions) of dollars of funding. In return, public investors get a liquid asset they can buy and sell instantly, along with fractional voting rights and potential payouts called <strong>Dividends</strong> (a share of company profits sent directly to shareholders).</p>
      
      <h4>3. How Do Trades Execute? (The Bid, Ask, and Spread)</h4>
      <p>Stock prices do not change randomly. Every stock has an active **Order Book** consisting of buyers and sellers:</p>
      <ul>
        <li><strong>The Bid Price:</strong> The highest price a buyer is currently willing to pay. (Buyers want to pay as little as possible).</li>
        <li><strong>The Ask Price:</strong> The lowest price a seller is currently willing to accept. (Sellers want to sell as high as possible).</li>
        <li><strong>The Spread:</strong> The difference between the Bid and Ask prices. Highly active stocks (like Apple) have a spread of just a penny. Illiquid stocks can have wide spreads.</li>
      </ul>
      <p>A trade is completed only when a buyer meets a seller's Ask, or a seller meets a buyer's Bid. If there are suddenly more eager buyers than sellers, buyers will submit higher bid prices to jump the queue, driving the stock price up.</p>
      
      <h4>4. Understanding Market Cap</h4>
      <p>A common mistake is thinking a stock is "cheap" just because its share price is low. To find a company's true size, look at its <strong>Market Capitalization</strong>:</p>
      <p style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 0.4rem; font-family: monospace; font-size: 0.8rem; border-left: 2px solid var(--color-accent-cyan);">Market Cap = Total Outstanding Shares &times; Current Share Price</p>
      <p>Company A might have a share price of $500, but only 1 million shares (Market Cap = $500M). Company B might have a share price of $5, but 1 billion shares (Market Cap = $5 Billion). Company B is actually 10 times larger than Company A!</p>
    `,
    quiz: {
      question: "If a stock's current highest buyer bid is $100.00 and the lowest seller ask is $100.05, what is the 'Spread' and when will a trade execute?",
      options: [
        "The Spread is $100.02, and a trade executes automatically.",
        "The Spread is $0.05, and a trade executes when a buyer agrees to pay $100.05 or a seller accepts $100.00.",
        "The Spread is $200.05, and a trade executes only when the market closes.",
        "The Spread is $0.05, and a trade executes immediately for all pending orders."
      ],
      correctAnswer: 1,
      explanation: "The spread is the gap between Bid and Ask ($100.05 - $100.00 = $0.05). A transaction only occurs when a participant agrees to cross the spread and accept the counterparty's price."
    }
  },
  {
    id: 2,
    title: "Understanding Candlestick Charts",
    shortDescription: "Learn how to read price bars and identify who is in control: buyers or sellers.",
    icon: "candlestick-chart",
    content: `
      <p>A <strong>candlestick chart</strong> is the language of the market. Unlike simple line charts, each candlestick reveals four critical data points for a specific timeframe:</p>
      <ul>
        <li><strong>Open:</strong> The price where trading began.</li>
        <li><strong>High:</strong> The maximum price reached.</li>
        <li><strong>Low:</strong> The minimum price reached.</li>
        <li><strong>Close:</strong> The final price when trading ended.</li>
      </ul>
      <p>If the Close is higher than the Open, the candle is <strong>green (bullish)</strong>, meaning buyers won. If the Close is lower than the Open, the candle is <strong>red (bearish)</strong>, meaning sellers won.</p>
      <p>The thin lines above and below the body are called <strong>wicks (or shadows)</strong>. A long upper wick shows that buyers pushed the price high, but sellers stepped in to drive it back down before the candle closed.</p>
    `,
    quiz: {
      question: "What does a long upper wick on a candlestick indicate?",
      options: [
        "Buying pressure is at an all-time high.",
        "Sellers pushed the price back down from its highs, indicating resistance.",
        "The market is closed for trading.",
        "The price is guaranteed to break out in the next candle."
      ],
      correctAnswer: 1,
      explanation: "A long upper wick indicates that buyers temporarily drove prices up, but sellers aggressively entered the market and pushed the price back down before the period ended."
    }
  },
  {
    id: 3,
    title: "Support and Resistance Levels",
    shortDescription: "Identify the price 'floors' and 'ceilings' where major buying and selling occurs.",
    icon: "activity",
    content: `
      <p>Think of the stock market as a battle between buyers and sellers. Two of the most important concepts are <strong>Support</strong> and <strong>Resistance</strong>:</p>
      <ul>
        <li><strong>Support (The Floor):</strong> A price level where a stock has historically had trouble falling below. Buyers see the price as a bargain and step in, creating a "floor."</li>
        <li><strong>Resistance (The Ceiling):</strong> A price level where a stock has historically had trouble rising above. Sellers see the price as expensive and sell their shares, creating a "ceiling."</li>
      </ul>
      <p>Traders look to <strong>buy near support</strong> and <strong>sell near resistance</strong>. If a stock manages to break *through* a resistance level, that level often flips and becomes the new support floor!</p>
    `,
    quiz: {
      question: "What typically happens when a stock price approaches an established Support level?",
      options: [
        "Sellers panic and dump shares immediately.",
        "The price always breaks down instantly.",
        "Buying interest increases, making it more likely the price will bounce upward.",
        "The chart stops rendering data."
      ],
      correctAnswer: 2,
      explanation: "Support levels attract buyers who view the asset as undervalued, increasing demand and often triggering a price bounce."
    }
  },
  {
    id: 4,
    title: "Riding the Trend with Moving Averages",
    shortDescription: "Discover how to smooth out price noise to see the overall direction of the market.",
    icon: "trending-up",
    content: `
      <p>One of the oldest rules in trading is: <strong>"The trend is your friend."</strong> But markets are noisy, with prices bouncing up and down constantly.</p>
      <p>To see the true trend, we use a <strong>Simple Moving Average (SMA)</strong>. An SMA calculates the average price of a stock over a set number of periods (like 20 candles) and draws a smooth line on the chart.</p>
      <ul>
        <li>If the price is **above** the SMA and the line is sloping upward, the stock is in a **Bullish Trend (Uptrend)**. Traders prefer to buy.</li>
        <li>If the price is **below** the SMA and the line is sloping downward, the stock is in a **Bearish Trend (Downtrend)**. Traders avoid buying.</li>
      </ul>
    `,
    quiz: {
      question: "If a stock's price is currently trading above an upward-sloping 20-period SMA line, what is the trend?",
      options: [
        "A strong Downtrend (Bearish).",
        "A sideways consolidation range.",
        "A strong Uptrend (Bullish).",
        "Highly unpredictable; the moving average is useless."
      ],
      correctAnswer: 2,
      explanation: "When price trades above an upward-sloping moving average line, it indicates strong bullish momentum and an established uptrend."
    }
  },
  {
    id: 5,
    title: "Risk Management & The Trading Checklist",
    shortDescription: "Protect your capital by planning your trade criteria before entering the market.",
    icon: "shield-check",
    content: `
      <p>The difference between trading and gambling is <strong>Risk Management</strong>. Amateur traders focus only on how much money they can make. Professional traders focus on how much they could *lose*.</p>
      <p>Before executing any trade, consult a <strong>Trade Checklist</strong> to remove emotion:</p>
      <ol>
        <li><strong>Trend:</strong> Is the asset trading in the direction of your trade? (e.g., above the SMA for a buy).</li>
        <li><strong>Key Level:</strong> Are you buying near support? Is resistance far enough away to allow profit?</li>
        <li><strong>Risk-to-Reward:</strong> If you buy, where will you sell if you're wrong? Ensure your potential profit is at least double your potential loss.</li>
      </ol>
      <p>Never risk more than 1% to 2% of your total account balance on a single trade!</p>
    `,
    quiz: {
      question: "What is the primary purpose of utilizing a Trade Checklist?",
      options: [
        "To guarantee that every trade makes a profit.",
        "To satisfy legal regulations required by stock brokers.",
        "To remove emotional impulse and execute trades based on rule-based criteria.",
        "To speed up the speed at which you place orders."
      ],
      correctAnswer: 2,
      explanation: "A checklist enforces strict rules, preventing emotional impulses (like FOMO—Fear Of Missing Out) and encouraging disciplined risk management."
    }
  },
  {
    id: 6,
    title: "Understanding Exchange-Traded Funds (ETFs)",
    shortDescription: "Learn how ETFs pool investments to buy bundles of stocks, reducing risk through instant diversification.",
    icon: "layers",
    content: `
      <p>Building a portfolio of individual stocks requires extensive research, constant monitoring, and high transaction costs. For most investors, a more effective path is utilizing <strong>Exchange-Traded Funds (ETFs)</strong>.</p>
      
      <h4>1. What is an ETF? (The Stock Basket)</h4>
      <p>An <strong>Exchange-Traded Fund (ETF)</strong> is a financial instrument that pools money from thousands of investors to buy a diversified basket of securities (such as stocks, bonds, or commodities). It trades on public stock exchanges just like a regular stock, with its price fluctuating throughout the trading day.</p>
      <p><em>Think of an individual stock as buying a single ingredient (like pepperoni). An ETF is like buying the whole pizza with all the toppings.</em> For example, buying a single share of the <strong>SPY ETF</strong> gives you fractional ownership in all 500 of the largest U.S. companies (including Apple, Microsoft, Amazon, and NVIDIA) simultaneously.</p>
      
      <h4>2. Why Are ETFs Good to Invest In? (The Benefits)</h4>
      <ul>
        <li><strong>Instant Diversification:</strong> The primary rule of investing is "don't put all your eggs in one basket." If you buy shares of a single company and that company goes bankrupt, you lose 100% of your investment. If you buy an S&P 500 ETF and one company fails, it represents less than 1% of the fund, leaving your capital safe.</li>
        <li><strong>Lower Cost:</strong> Buying 500 individual stocks would cost thousands in broker transaction fees and require a huge cash balance. With an ETF, you get all 500 stocks for the cost of a single share, with near-zero transaction fees.</li>
        <li><strong>Passive Management & Low Fees:</strong> Most ETFs are designed to passively track a market index (like the S&P 500 or Nasdaq 100). Because they don't require expensive active fund managers, their annual management fees (known as <strong>Expense Ratios</strong>) are extremely low—often less than 0.1% per year.</li>
        <li><strong>Targeted Investing:</strong> ETFs allow you to easily invest in specific industries or themes. You can buy a semiconductor ETF (like SOXX) to invest in computer chip makers, a clean energy ETF, or a gold ETF, without needing to know which individual company will win the sector.</li>
      </ul>
      
      <h4>3. Popular ETFs You Can Trade</h4>
      <p>Many of the most liquid and widely traded instruments in the world are ETFs. On our <strong>Trends</strong> page, you'll see several marquee index ETFs:</p>
      <ul>
        <li><strong>SPY:</strong> Tracks the S&P 500 Index (large-cap U.S. stock market).</li>
        <li><strong>QQQ:</strong> Tracks the Nasdaq 100 Index (heavy focus on mega-cap technology and innovation).</li>
        <li><strong>IWM:</strong> Tracks the Russell 2000 Index (small-cap U.S. companies, offering high growth potential but higher volatility).</li>
        <li><strong>GLD:</strong> Tracks the spot price of gold (often used as a safe haven or hedge against inflation).</li>
      </ul>
    `,
    quiz: {
      question: "Why are Exchange-Traded Funds (ETFs) considered an excellent tool for risk reduction and diversification?",
      options: [
        "They guarantee that you will never lose money on a trade.",
        "They pool investor funds to buy a broad basket of stocks, so a drop in one stock has a minor impact.",
        "They pay fixed monthly interest rates guaranteed by the government.",
        "They prevent stock prices from moving downward."
      ],
      correctAnswer: 1,
      explanation: "By spreading capital across dozens or hundreds of different companies, ETFs dilute the negative impact of any single stock performing poorly, providing instant diversification and risk reduction."
    }
  }
];
