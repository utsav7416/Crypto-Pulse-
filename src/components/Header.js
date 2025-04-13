import React from "react";
import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Box,
} from "@material-ui/core";
import { createTheme, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
    transition: "all 0.4s ease-in-out",
    height: 90,
    justifyContent: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  title: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "2rem",
    color: "#0e0be0",
    transition: "transform 0.3s ease, color 0.3s ease",
    letterSpacing: "1px",
    "&:hover": {
      transform: "scale(1.07)",
      color: "#2b2bf3",
    },
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
  },
  changeText: {
    fontSize: "1rem",
    marginRight: theme.spacing(1),
    color: "#fff",
  },
  select: {
    width: 130,
    height: 50,
    marginRight: theme.spacing(2),
    borderRadius: 10,
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#1e1e1e",
    border: "2px solid #007BFF",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#00c8ff",
      backgroundColor: "#2a2a2a",
    },
    "& .MuiSelect-icon": {
      color: "#fff",
    },
    "& .MuiSelect-select": {
      padding: "12px 16px",
    },
  },
  menuItem: {
    fontWeight: "bold",
    color: "#000",
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: { main: "#fff" },
    type: "dark",
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

function Header() {
  const classes = useStyles();
  const history = useHistory();
  const { currency, setCurrency } = CryptoState();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static" className={classes.appBar}>
        <Container>
          <Toolbar style={{ minHeight: 90 }}>
            <Box className={classes.logoContainer} onClick={() => history.push(`/`)}>
              <Typography variant="h5" className={classes.title}>
                Crypto Pulse
              </Typography>
            </Box>
            <Box className={classes.rightSection}>
              <Typography variant="body1" className={classes.changeText}>
                Change Currency:
              </Typography>
              <Select
                variant="outlined"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={classes.select}
              >
                <MenuItem value="USD" className={classes.menuItem}>
                  USD
                </MenuItem>
                <MenuItem value="INR" className={classes.menuItem}>
                  INR
                </MenuItem>
              </Select>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
