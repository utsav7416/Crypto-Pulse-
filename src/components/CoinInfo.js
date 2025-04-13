import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setflag] = useState(false);

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "100%",
      padding: "40px 20px",
      background: "#212121",
      borderRadius: 20,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      [theme.breakpoints.down("md")]: {
        padding: "20px 10px",
      },
    },
    chartWrapper: {
      width: "100%",
      maxWidth: "1000px",
      height: "500px",
      [theme.breakpoints.down("md")]: {
        height: "400px",
      },
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      marginTop: 30,
      flexWrap: "wrap",
      gap: 12,
    },
  }));

  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setflag(true);
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days]);

  const theme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#32CD32",
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        {!historicData || flag === false ? (
          <CircularProgress style={{ color: "#32CD32" }} size={150} thickness={1.5} />
        ) : (
          <>
            <div className={classes.chartWrapper}>
              <Line
                data={{
                  labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: historicData.map((coin) => coin[1]),
                      label: `Price (Past ${days} Days) in ${currency}`,
                      borderColor: "#32CD32",
                      backgroundColor: "rgba(50, 205, 50, 0.2)",
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#32CD32",
                        font: {
                          size: 14,
                          family: "'Inter', sans-serif",
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: "#4f4f4f",
                      titleColor: "#32CD32",
                      bodyColor: "#32CD32",
                      titleFont: {
                        size: 16,
                        family: "'Inter', sans-serif",
                      },
                      bodyFont: {
                        size: 14,
                        family: "'Inter', sans-serif",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "#32CD32",
                        font: {
                          size: 12,
                          family: "'Inter', sans-serif",
                        },
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                    y: {
                      ticks: {
                        color: "#32CD32",
                        font: {
                          size: 12,
                          family: "'Inter', sans-serif",
                        },
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                  },
                  elements: {
                    point: {
                      radius: 3,
                      backgroundColor: "#32CD32",
                    },
                  },
                  layout: {
                    backgroundColor: "#4f4f4f",
                  },
                }}
              />
            </div>

            <div className={classes.buttonGroup}>
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
