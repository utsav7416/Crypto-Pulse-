import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  makeStyles,
  Typography,
  Fade,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [predictionData, setPredictionData] = useState(null);
  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  const fetchPrediction = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/predict/${id}`);
      setPredictionData(res.data);
    } catch (error) {
      console.error("Error fetching prediction data:", error);
    }
  };

  useEffect(() => {
    fetchCoin();
    fetchPrediction();
  }, [id]);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexDirection: "row",
      gap: 40,
      padding: "50px 40px",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, rgb(0, 82, 0), rgb(143, 122, 4), rgb(3, 0, 10))",
      fontFamily: "'Inter', sans-serif",
      color: "#fff",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
      },
    },
    sidebar: {
      flex: 1.2,
      backgroundColor: "#1b1b1b",
      borderRadius: 20,
      padding: 30,
      boxShadow: "0 4px 18px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontWeight: 700,
      marginBottom: 20,
      fontFamily: "'Poppins', sans-serif",
      fontSize: "2.2rem",
    },
    description: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "1rem",
      opacity: 0.9,
      marginBottom: 25,
      textAlign: "justify",
      lineHeight: 1.7,
    },
    marketData: {
      marginTop: 30,
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    dataRow: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      paddingBottom: 10,
    },
    label: {
      fontWeight: 600,
      fontSize: "1.1rem",
      color: "#FFD700",
    },
    value: {
      fontFamily: "Inter",
      fontSize: "1.1rem",
    },
    coinInfoWrapper: {
      flex: 2,
      backgroundColor: "#1f1f1f",
      borderRadius: 20,
      padding: 30,
      boxShadow: "0 4px 22px rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    mlSectionWrapper: {
      width: "calc(100% - 80px)",
      margin: "40px auto 60px auto",
      backgroundColor: "#1f1f1f",
      borderRadius: 20,
      padding: 30,
      boxShadow: "0 4px 22px rgba(0, 0, 0, 0.08)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
    },
    mlHeading: {
      fontSize: "1.8rem",
      fontFamily: "'Poppins', sans-serif",
      marginBottom: 20,
      color: "#FFD700",
    },
    mlSubHeading: {
      marginTop: 20,
      marginBottom: 10,
      fontWeight: 600,
      fontSize: "1.15rem",
      color: "#FFD700",
    },
    plotImage: {
      width: "100%",
      borderRadius: 10,
      marginTop: 20,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
    riskMetricsCard: {
      backgroundColor: "#2a2a2a",
      borderRadius: 12,
      color: "#fff",
      padding: "15px",
      marginTop: 20,
      marginBottom: 20,
    },
    riskMetricsTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      marginBottom: 8,
      color: "#FFA500",
    },
    forecastProgress: {
      backgroundColor: "#333",
      borderRadius: 5,
      height: 8,
    },
    dayLabel: {
      fontWeight: 500,
      marginBottom: 6,
    },
  }));

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <>
      <Fade in={true} timeout={700}>
        <div className={classes.container}>
          <div className={classes.sidebar}>
            <img
              src={coin?.image.large}
              alt={coin?.name}
              height="180"
              style={{ marginBottom: 20 }}
            />

            <Typography className={classes.heading}>{coin?.name}</Typography>

            <Typography className={classes.description}>
              {coin?.name} is a next-generation digital asset designed to power a
              decentralized financial future. It combines trustless technology,
              market dynamics, and community-driven development.
            </Typography>

            <Typography className={classes.description}>
              {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
            </Typography>

            <div className={classes.marketData}>
              <div className={classes.dataRow}>
                <span className={classes.label}>Rank</span>
                <span className={classes.value}>
                  {numberWithCommas(coin?.market_cap_rank)}
                </span>
              </div>

              <div className={classes.dataRow}>
                <span className={classes.label}>Current Price</span>
                <span className={classes.value}>
                  {symbol}{" "}
                  {numberWithCommas(
                    coin?.market_data.current_price[currency.toLowerCase()]
                  )}
                </span>
              </div>

              <div className={classes.dataRow}>
                <span className={classes.label}>Market Cap</span>
                <span className={classes.value}>
                  {symbol}{" "}
                  {numberWithCommas(
                    coin?.market_data.market_cap[currency.toLowerCase()]
                      .toString()
                      .slice(0, -6)
                  )}
                  M
                </span>
              </div>
            </div>
          </div>

          <div className={classes.coinInfoWrapper}>
            <CoinInfo coin={coin} />
          </div>
        </div>
      </Fade>

      {predictionData && (
        <div className={classes.mlSectionWrapper}>
          <Typography className={classes.mlHeading}>
            ML-Based Future Forecast & Risk Analysis
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.8, marginBottom: 15 }}>
            This analysis uses advanced XGBoost and GARCH models to forecast price and volatility.
            The visualization now includes an extended XGBoost forecast line and enhanced kurtosis details
            with a clear classification and hexbin overview.
          </Typography>

          <Card className={classes.riskMetricsCard}>
            <CardContent>
              <Typography className={classes.riskMetricsTitle}>
                Risk & Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">
                    <strong>Sharpe Ratio:</strong>
                  </Typography>
                  <Typography>
                    {predictionData.sharpe_ratio
                      ? predictionData.sharpe_ratio.toFixed(3)
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">
                    <strong>Sortino Ratio:</strong>
                  </Typography>
                  <Typography>
                    {predictionData.sortino_ratio
                      ? predictionData.sortino_ratio.toFixed(3)
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">
                    <strong>Skew:</strong>
                  </Typography>
                  <Typography>
                    {predictionData.skew
                      ? predictionData.skew.toFixed(3)
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">
                    <strong>Kurtosis:</strong>
                  </Typography>
                  <Typography>
                    {predictionData.kurtosis
                      ? predictionData.kurtosis.toFixed(3)
                      : "N/A"}{" "}
                    ({predictionData.kurtosis_classification || ""})
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Typography className={classes.mlSubHeading}>
            XGBoost 10-Day Price Forecast
          </Typography>
          <Grid container spacing={2}>
            {predictionData.predictions_xgb?.map((price, idx) => {
              const scaledValue = Math.min(100, (price / 100000) * 100);
              return (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Typography className={classes.dayLabel}>
                    Day {idx + 1}: {symbol} {numberWithCommas(price.toFixed(2))}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={scaledValue}
                    className={classes.forecastProgress}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Typography className={classes.mlSubHeading}>
            GARCH Volatility (Next 10 Days)
          </Typography>
          <Grid container spacing={2}>
            {predictionData.forecasted_volatility?.map((vol, idx) => {
              const scaledVol = vol * 10000;
              return (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Typography className={classes.dayLabel}>
                    Day {idx + 1}: ± {numberWithCommas(vol.toFixed(4))}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={scaledVol}
                    className={classes.forecastProgress}
                    style={{ backgroundColor: "#222" }}
                  />
                </Grid>
              );
            })}
          </Grid>

          {predictionData.ml_plot && (
            <>
              <Typography className={classes.mlSubHeading} style={{ marginTop: 30 }}>
                Advanced Visualization
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.8 }}>
                The visualization below now shows an extended XGBoost forecast,
                a detailed GARCH bar chart, and an enhanced kurtosis panel featuring clear
                classification along with an inset hexbin for granular cluster details.
              </Typography>
              <img
                src={`data:image/png;base64,${predictionData.ml_plot}`}
                alt="ML Forecast & GARCH Analysis"
                className={classes.plotImage}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CoinPage;
