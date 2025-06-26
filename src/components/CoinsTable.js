import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Container,
  createTheme,
  ThemeProvider,
  LinearProgress,
  Typography,
  TextField,
  Fade,
  Paper,
  Zoom,
  Slide,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import { CoinList } from "../config/api";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #0d2818 50%, #1a2e1a 75%, #0a0a0a 100%)",
    minHeight: "100vh",
    padding: theme.spacing(4, 0),
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative",
    marginLeft: 260,
    width: `calc(100% - 260px)`,
    boxSizing: "border-box",
    "@media (max-width: 768px)": {
      marginLeft: 0,
      width: "100%",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.03) 0%, transparent 50%)",
      pointerEvents: "none",
    }
  },
  container: {
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: theme.spacing(0, 3),
    position: "relative",
    zIndex: 1,
  },
  introBox: {
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(16, 185, 129, 0.15)",
    borderRadius: 24,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(4),
    flexWrap: "wrap",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 40px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.25)",
    }
  },
  introText: {
    flex: 1,
    minWidth: 280,
    fontWeight: 500,
    fontSize: "1.1rem",
    lineHeight: 1.6,
    color: "#e0e0e0",
  },
  introImage: {
    width: 72,
    height: 72,
    objectFit: "contain",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))",
    "&:hover": {
      transform: "scale(1.1) rotate(5deg)",
    }
  },
  heading: {
    marginBottom: theme.spacing(4),
    fontWeight: 700,
    fontSize: "3rem",
    background: "linear-gradient(135deg, #ffffff 0%, #10b981 50%, #ffffff 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    letterSpacing: "-0.02em",
  },
  search: {
    marginBottom: theme.spacing(5),
    width: "100%",
    maxWidth: 600,
    margin: "0 auto",
    marginBottom: theme.spacing(5),
    "& .MuiOutlinedInput-root": {
      background: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(10px)",
      borderRadius: 20,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "& fieldset": { 
        borderColor: "rgba(16, 185, 129, 0.2)",
        borderWidth: 1,
      },
      "&:hover fieldset": { 
        borderColor: "rgba(16, 185, 129, 0.4)",
      },
      "&.Mui-focused fieldset": { 
        borderColor: "#10b981",
        boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
      },
      "&:hover": {
        transform: "translateY(-2px)",
        background: "rgba(16, 185, 129, 0.05)",
      }
    },
    "& input": { 
      color: "#ffffff",
      fontSize: "1.1rem",
      padding: theme.spacing(1.8, 2.5),
      fontWeight: 500,
    },
    "& label": { 
      color: "#cccccc",
      fontSize: "1rem",
      fontWeight: 500,
    },
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(5),
  },
  tile: {
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    padding: theme.spacing(3),
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid rgba(16, 185, 129, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: "0 20px 50px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(16, 185, 129, 0.2)",
      "&::before": {
        opacity: 1,
      }
    },
  },
  tileContent: {
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  coinImage: {
    height: 72,
    width: 72,
    objectFit: "contain",
    marginBottom: theme.spacing(2),
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))",
    "&:hover": { 
      transform: "scale(1.15)",
    },
  },
  coinSymbol: {
    fontSize: "1.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    background: "linear-gradient(135deg, #ffffff 0%, #10b981 50%, #ffffff 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: theme.spacing(0.5),
    letterSpacing: "0.02em",
  },
  coinName: {
    fontSize: "1.1rem",
    color: "#cccccc",
    marginBottom: theme.spacing(1.5),
    fontWeight: 500,
  },
  coinData: {
    fontSize: "1rem",
    color: "#ffffff",
    margin: theme.spacing(0.5, 0),
    fontWeight: 600,
  },
  profit: {
    color: "#10b981",
    fontWeight: 700,
    textShadow: "0 0 8px rgba(16, 185, 129, 0.3)",
  },
  loss: {
    color: "#ef4444",
    fontWeight: 700,
    textShadow: "0 0 8px rgba(239, 68, 68, 0.3)",
  },
  pagination: {
    marginTop: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
    "& .MuiPaginationItem-root": {
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontWeight: 600,
      background: "rgba(0, 0, 0, 0.6)",
      border: "1px solid rgba(16, 185, 129, 0.15)",
      backdropFilter: "blur(10px)",
      borderRadius: 12,
      margin: "0 4px",
      "&:hover": {
        background: "rgba(16, 185, 129, 0.1)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
      },
      "&.Mui-selected": {
        background: "linear-gradient(135deg, #000000 0%, #10b981 50%, #000000 100%)",
        color: "#ffffff",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
        "&:hover": { 
          background: "linear-gradient(135deg, #0a0a0a 0%, #059669 50%, #0a0a0a 100%)",
          transform: "translateY(-2px)",
        },
      },
    },
  },
  progressBar: {
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
    height: 8,
    marginBottom: 24,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(16, 185, 129, 0.1)",
    "& .MuiLinearProgress-bar": {
      background: "linear-gradient(90deg, #000000 0%, #10b981 50%, #000000 100%)",
      borderRadius: 8,
      boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
    }
  }
}));

const balancedTheme = createTheme({
  palette: {
    primary: { main: "#10b981" },
    type: "dark",
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
});

export default function BalancedCryptoTable() {
  const classes = useStyles();
  const history = useHistory();
  const { currency, symbol } = CryptoState();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 6;
  const TOTAL_COINS = 60;

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency, TOTAL_COINS));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () =>
    coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

  const filtered = handleSearch();
  const countPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayCoins = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <ThemeProvider theme={balancedTheme}>
      <div className={classes.root}>
        <Container className={classes.container}>
          <Zoom in timeout={600}>
            <Paper elevation={0} className={classes.introBox}>
              <img
                src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                alt="Bitcoin"
                className={classes.introImage}
              />
              <img
                src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
                alt="Ethereum"
                className={classes.introImage}
              />
              <img
                src="https://assets.coingecko.com/coins/images/2/large/litecoin.png"
                alt="Litecoin"
                className={classes.introImage}
              />
              <Typography variant="body1" className={classes.introText}>
                Advanced cryptocurrency analytics with real-time market insights and portfolio tracking.
              </Typography>
            </Paper>
          </Zoom>

          <Typography variant="h2" className={classes.heading}>
            Modern Crypto Dashboard
          </Typography>

          <TextField
            label="Search cryptocurrencies..."
            variant="outlined"
            className={classes.search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {loading ? (
            <LinearProgress className={classes.progressBar} />
          ) : (
            <Fade in timeout={800}>
              <div className={classes.grid}>
                {displayCoins.map((coin, index) => {
                  const profit = coin.price_change_percentage_24h > 0;
                  return (
                    <Slide
                      key={coin.id}
                      direction="up"
                      in
                      timeout={400 + index * 100}
                    >
                      <div
                        className={classes.tile}
                        onClick={() => history.push(`/coins/${coin.id}`)}
                      >
                        <div className={classes.tileContent}>
                          <img src={coin.image} alt={coin.name} className={classes.coinImage} />
                          <Typography className={classes.coinSymbol}>{coin.symbol}</Typography>
                          <Typography className={classes.coinName}>{coin.name}</Typography>
                          <Typography className={classes.coinData}>
                            {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                          </Typography>
                          <Typography
                            className={`${classes.coinData} ${
                              profit ? classes.profit : classes.loss
                            }`}>
                            {profit ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                          </Typography>
                          <Typography className={classes.coinData}>
                            Cap: {symbol}{numberWithCommas(
                              coin.market_cap.toString().slice(0, -6)
                            )}M
                          </Typography>
                        </div>
                      </div>
                    </Slide>
                  );
                })}
              </div>
            </Fade>
          )}

          <Pagination
            count={countPages}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={classes.pagination}
          />
        </Container>
      </div>
    </ThemeProvider>
  );
}
