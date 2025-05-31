const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());

const getCacheKey = (req) => req.originalUrl;

app.use(
  "/predict",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log("Forwarding request to Flask for coin:", req.params.coin_id);
    }
  })
);

app.get("/api/coins/markets", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return res.json(cache.get(cacheKey));
  }
  try {
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

app.get("/api/coins/:id", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return res.json(cache.get(cacheKey));
  }
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching single coin data:", error.message);
    res.status(500).json({ error: "Error fetching data from CoinGecko" });
  }
});

app.get("/api/coins/:id/market_chart", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return res.json(cache.get(cacheKey));
  }
  try {
    const { id } = req.params;
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