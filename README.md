# Crypto Price Tracking App

A dynamic, user-centric web application designed to deliver comprehensive insights into the cryptocurrency market. By combining real-time data retrieval, historical analysis, advanced risk metrics, and machine learning predictions, this app empowers users—traders, investors, and researchers—to make informed decisions in an ever-evolving landscape.

---

## What the App Does

### 1. Real-Time Market Data & Price Tracking
- **Live Price Updates**  
  Continuously fetches up-to-the-second price and volume information for hundreds of cryptocurrencies from CoinGecko. Users can monitor current trading prices in their preferred fiat currency (e.g., USD, EUR), ensuring they always see the latest market movements.
- **Top-N Coin Overview**  
  Displays a sortable, paginated list of the top N coins by market capitalization. Each row includes:
  - Current price  
  - 24-hour price change (absolute and percentage)  
  - 7-day sparkline mini-chart (small line graph showing price trend over the past week)  
  - Trading volume for the last 24 hours  

### 2. Interactive Price Charts (Chart.js)
- **Multi-Timeframe Line & Candlestick Charts**  
  For any selected coin, users can toggle between timeframes (24 hours, 7 days, 30 days, 1 year). The app renders:
  - Smooth line charts showing closing prices over the chosen interval  
  - Candlestick charts (open/high/low/close) for granular daily price action  
- **Overlaying Key Indicators**  
  Users can overlay moving averages (e.g., 7-day, 30-day) directly on the chart, highlighting short-term vs. long-term momentum. Hovering over data points reveals exact values and timestamps.

### 3. Historical Data Analysis & Risk Metrics
- **One-Year Historical Data Retrieval**  
  Pulls 365 days of historical price and volume data for a chosen coin. Data is stored in a Pandas DataFrame on the back end for efficient processing.
- **Return Series & Distribution Metrics**  
  - Daily returns calculated as `(priceₜ / priceₜ₋₁) – 1`.  
  - Computes distribution-based metrics (kurtosis & skew) of daily returns:  
    - **Kurtosis Classification**:  
      - _Platykurtic_ (low tail risk)  
      - _Mesokurtic_ (moderate, near-normal distribution)  
      - _Leptokurtic_ (fat tails, high probability of extreme events)  
    - **Skew Measurement**:  
      - Indicates whether returns are biased toward positive or negative outliers.
- **GARCH(1,1) Volatility Forecasting**  
  Applies a GARCH(1,1) model on the historical return series to forecast next 10 days’ volatility (standard deviation). Displays a bar chart showing predicted daily standard deviations, helping users anticipate periods of heightened risk.

### 4. Advanced Visual Risk & Distribution Plots
- **Hexbin Return Distribution**  
  Renders a hexagonal bin (hexbin) plot of daily returns versus observation index. Darker bins signify more frequent return values, giving users a quick sense of where returns cluster.
- **Scatter (Return vs. Volume)**  
  For the most recent 30 days:
  - Plots daily return (x-axis) against trading volume (y-axis).  
  - Bubble size scaled by relative price, coloring points by actual price value.  
  - Helps users see if large volume days correspond to large positive/negative returns.
- **Kurtosis Risk Gauge**  
  A semicircular, three-color gauge (green/yellow/red) illustrates the daily return series’ kurtosis on a 0–10 scale:
  - Green zone: Low kurtosis (platykurtic) → fewer extreme events  
  - Yellow zone: Moderate kurtosis (mesokurtic) → near-normal distribution  
  - Red zone: High kurtosis (leptokurtic) → heavy tails, elevated tail-risk  
  A needle pointer dynamically indicates where the current kurtosis value lies, while text annotations explain risk implications.

### 5. Liquidity Migration & Market Momentum
- **Liquidity Migration Analysis**  
  Identifies how money “flows” between the top X coins:
  - Tracks changes in market-cap ranking over specified intervals (e.g., weekly, monthly).  
  - Highlights coins gaining liquidity (moving up in rank) vs. coins losing liquidity (moving down).  
  - Visualizes net inflows/outflows in a heatmap or Sankey-style diagram, so users can spot shifting trends—e.g., new altcoins drawing capital away from established cryptos.
- **Month-Over-Month (MoM) Price Change & Momentum Metrics**  
  - Calculates price changes compared to the previous calendar month, furnishing a simple MoM “momentum score.”  
  - Incorporates relative strength indicators (RSI) and rate-of-change (ROC) metrics derived from price series using simple-statistics.  
  - Displays a ranked list of coins by momentum category (High/Medium/Low), guiding users toward assets with strong ascending trends.

### 6. Machine Learning-Based Short-Term Price Predictions
- **XGBoost Regression Model**  
  - Uses a numerical index (0…N–1) as feature `X` and historical closing prices as target `y` to train an XGBoost regressor.  
  - Trains on the last 365 days of daily prices (no external features required), producing robust short-term forecasts.
- **Extended Forecast Range for Chart Overlay**  
  - Generates predictions for the next 10 days (“primary forecast”) as well as an additional 60 days (“extended range”), purely for visualization context.  
  - Overlays the extended forecast line (dashed or distinct color) behind the 10-day predictions, so users can see potential longer trajectories without misinterpreting them as precise forecasts.
- **Combined ML + Data Analytics Plot**  
  - The back end creates a Matplotlib figure with multiple subplots:  
    1. Historical price plus extended XGBoost forecast overlay  
    2. Bar chart of GARCH-forecasted volatility for the next 10 days  
    3. Risk implications block (text & gradient background) summarizing kurtosis findings  
    4. Kurtosis risk gauge (semi-circular dial)  
    5. Hexbin plot of daily returns  
    6. Return vs. volume scatter for the last 30 days  
  - That multi-panel figure is encoded as a base64 PNG and returned via the `/predict/<coin_id>` endpoint. The front end decodes it and embeds it alongside Chart.js components, delivering a unified “ML + Risk Dashboard.”

### 7. Responsive, Intuitive User Interface
- **Material UI Components & Custom Styling**  
  - Clean, card-based layouts with subtle drop shadows and rounded corners for a modern aesthetic.  
  - Custom color palette: soft pastels for background cards, high-contrast text, and accent colors for charts.  
  - Fully responsive grid:  
    - On desktop, the home page shows a wide table + sidebar summary of top 10 coins.  
    - On mobile, cards stack vertically, with collapsible sections for analytics.
- **Dark/Light Mode Toggle**  
  - Users can switch between light and dark themes.  
  - Theme is persisted in localStorage so that the next visit retains their preference.
- **Loading Spinners & Error Handling**  
  - While data is fetching (e.g., sparkline, detailed metrics), animated spinners appear in place of tables or charts.  
  - If an API call fails (CoinGecko rate limit or network error), a user-friendly error message appears, suggesting retry or checking connectivity.

---

## Summary

This Crypto Price Tracking App merges **real-time market feeds**, **historical risk analytics**, **liquidity/momentum insights**, and **machine learning forecasts** into a single, responsive interface. By layering:
- Live price tables and sparklines  
- Rich Chart.js visualizations (line, candlestick, hexbin, scatter)  
- Advanced risk metrics (GARCH volatility, kurtosis gauge)  
- Liquidity migration and MoM momentum tables  
- XGBoost-driven short-term predictions  

…users gain a **holistic, data-driven view** of the cryptocurrency landscape—helping both novice enthusiasts and seasoned traders identify trends, measure risk, and anticipate potential price movements.

Whether you’re monitoring Bitcoin’s next breakout, comparing altcoin momentum, or assessing portfolio risk through advanced statistical measures, this app delivers the insights you need, all in one place.
