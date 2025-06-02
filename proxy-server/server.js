const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
const path = require("path");

const app = express();

console.log("Render Environment Variables received by server.js:");
console.log("process.env.FLASK_BACKEND_URL =", process.env.FLASK_BACKEND_URL);
console.log("process.env.PORT =", process.env.PORT);

const cache = new NodeCache({ stdTTL: 7200 });

app.use(cors());

const getCacheKey = (req) => req.originalUrl;

app.get("/api/coins/markets", async (req, res) => {
  const cacheKey = getCacheKey(req);
  if (cache.has(cacheKey)) {
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

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || "http://localhost:5001";

app.get("/predict/:coin_id", async (req, res) => {
    const coinId = req.params.coin_id;
    try {
        if (!FLASK_BACKEND_URL) {
            console.error("FLASK_BACKEND_URL is not set.");
            return res.status(500).json({ error: "Backend URL not configured." });
        }
        const response = await axios.get(`${FLASK_BACKEND_URL}/predict/${coinId}`, {
            timeout: 180000
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Error forwarding /predict/${coinId} to Flask:`, error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            res.status(504).json({ error: "Backend (Flask) request timed out." });
        } else {
            res.status(500).json({ error: "Failed to connect to Flask backend or unknown proxy error." });
        }
    }
});


app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));