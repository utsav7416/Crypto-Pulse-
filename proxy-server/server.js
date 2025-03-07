const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");

const app = express();

// Create a cache with a TTL (time-to-live) of 60 seconds
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());

// Helper function to get a cache key from the request
const getCacheKey = (req) => req.originalUrl;

// Endpoint for CoinList and TrendingCoins (both use the same base path)
app.get("/api/coins/markets", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return res.json(cache.get(cacheKey));
  }
  try {
    // Forward all query parameters received from the client to CoinGecko
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      { params: req.query }
    );
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching coins markets data:", error.message);
    res.status(500).json({ error: "Error fetching data from CoinGecko" });
  }
});

// Endpoint for SingleCoin
app.get("/api/coins/:id", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return res.json(cache.get(cacheKey));
  }
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching single coin data:", error.message);
    res.status(500).json({ error: "Error fetching data from CoinGecko" });
  }
});

// Endpoint for HistoricalChart
app.get("/api/coins/:id/market_chart", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return res.json(cache.get(cacheKey));
  }
  try {
    const { id } = req.params;
    // The query parameters (vs_currency and days) will be forwarded automatically
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      { params: req.query }
    );
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching historical chart data:", error.message);
    res.status(500).json({ error: "Error fetching data from CoinGecko" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
