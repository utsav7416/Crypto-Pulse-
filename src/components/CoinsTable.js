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
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: "linear-gradient(135deg, #1c1c1c,rgb(3, 14, 0))",
    minHeight: "100vh",
    padding: theme.spacing(4, 0),
    fontFamily: "'Montserrat', sans-serif",
  },
  container: {
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: theme.spacing(0, 2),
  },
  introBox: {
    background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.02))",
    border: "1px solid rgba(255, 215, 0, 0.3)",
    borderRadius: 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    color: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(4),
    flexWrap: "wrap",
  },
  introText: {
    flex: 1,
    minWidth: 260,
    fontWeight: 600,
  },
  introImage: {
    width: 100,
    height: 100,
    objectFit: "contain",
    animation: `$float 4s ease-in-out infinite`,
  },
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0px)" },
  },
  heading: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    color: "#fff",
  },
  search: {
    marginBottom: theme.spacing(3),
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#777" },
      "&:hover fieldset": { borderColor: "#FFD700" },
      "&.Mui-focused fieldset": { borderColor: "#FFD700" },
    },
    "& input": { color: "#fff" },
    "& label": { color: "#fff" },
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: theme.spacing(4),
  },
  tile: {
    position: "relative",
    background: "#1f1f1f",
    borderRadius: "15px",
    padding: theme.spacing(3),
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-10px) scale(1.02)",
      boxShadow: "0 16px 36px rgba(255, 215, 0, 0.4)",
    },
  },
  tileContent: {
    textAlign: "center",
  },
  coinImage: {
    height: 60,
    width: 60,
    objectFit: "contain",
    marginBottom: theme.spacing(1),
    transition: "transform 0.3s ease",
    "&:hover": { transform: "scale(1.1)" },
  },
  coinSymbol: {
    fontSize: "1.6rem",
    fontWeight: 700,
    textTransform: "uppercase",
    color: "#FFD700",
    marginBottom: theme.spacing(0.5),
  },
  coinName: {
    fontSize: "1rem",
    color: "#ccc",
    marginBottom: theme.spacing(1),
  },
  coinData: {
    fontSize: "0.9rem",
    color: "#eee",
    margin: theme.spacing(0.5, 0),
  },
  profit: {
    color: "rgb(14, 203, 129)",
  },
  loss: {
    color: "red",
  },
  pagination: {
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    "& .MuiPaginationItem-root": {
      color: "gold",
      fontFamily: "'Montserrat', sans-serif",
      transition: "all 0.3s ease",
      margin: "0 4px",
      borderRadius: "4px",
      padding: "8px 12px",
      "&:hover": {
        transform: "scale(1.1)",
        backgroundColor: "rgba(255, 215, 0, 0.15)",
      },
      "&.Mui-selected": {
        backgroundColor: "gold",
        color: "#000",
        fontWeight: 700,
        "&:hover": { backgroundColor: "gold" },
      },
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: { main: "#fff" },
    type: "dark",
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
});

export default function EnhancedCoinsTable() {
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
    // CHANGE THIS LINE: Proxy the request through your Flask backend
    const { data } = await axios.get(
      `/api/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${TOTAL_COINS}&page=1&sparkline=false`
    );
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
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <Container className={classes.container}>
          <Paper elevation={3} className={classes.introBox}>
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
              This dashboard not only displays real-time market data but also integrates quantitative metrics such as{' '}
              <strong style={{ color: '#FFD700' }}>Kurtosis</strong> and <strong style={{ color: '#FFD700' }}>GARCH</strong> models, enabling advanced volatility analysis.
            </Typography>
          </Paper>

          <Typography variant="h4" className={classes.heading}>
            Dynamic crypto asset list displaying real-time price, market cap, and volatility indicators
          </Typography>

          <TextField
            label="Search For a Cryptocurrency..."
            variant="outlined"
            className={classes.search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {loading ? (
            <LinearProgress style={{ backgroundColor: 'gold', marginBottom: 20 }} />
          ) : (
            <Fade in timeout={600}>
              <div className={classes.grid}>
                {displayCoins.map((coin) => {
                  const profit = coin.price_change_percentage_24h > 0;
                  return (
                    <div
                      key={coin.id}
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
                          Market Cap: {symbol}{numberWithCommas(
                            coin.market_cap.toString().slice(0, -6)
                          )} M
                        </Typography>
                      </div>
                    </div>
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