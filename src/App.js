import { makeStyles } from "@material-ui/core";
import "./App.css";
import { BrowserRouter, Route, Switch, useLocation, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Homepage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import Header from "./components/Header";

import AboutUs from "./Pages/AboutUs";
import TermsOfService from "./Pages/TermsOfService";
import Disclaimer from "./Pages/Disclaimer";

import MoodAnalysis from './Pages/Mood';
import CorrelationMatrix from "./Pages/CorrelationMatrix";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  backButton: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 1000,
    backgroundColor: "#4caf50",
    color: "white",
    border: "2px solid #66bb6a",
    padding: "12px 24px",
    fontSize: "18px",
    minWidth: "140px",
    height: "56px",
    "&:hover": {
      backgroundColor: "#45a049",
      border: "2px solid #4caf50",
      transform: "scale(1.05)",
    },
    transition: "all 0.3s ease",
  },
}));

function BackButton() {
  const classes = useStyles();
  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Button
      className={classes.backButton}
      startIcon={<ArrowBackIcon style={{ fontSize: "24px" }} />}
      onClick={handleBack}
      variant="contained"
      size="large"
    >
      Go Back
    </Button>
  );
}

function AppContent() {
  const classes = useStyles();
  const location = useLocation();
  const hideSidebarPaths = ['/mood', '/correlation'];
  const shouldHideHeader = hideSidebarPaths.includes(location.pathname);
  const shouldShowBackButton = hideSidebarPaths.includes(location.pathname);

  return (
    <div className={classes.App}>
      {!shouldHideHeader && <Header />}
      {shouldShowBackButton && <BackButton />}
      <Switch>
        <Route path="/" component={Homepage} exact />
        <Route path="/coins/:id" component={CoinPage} exact />
        <Route path="/mood" component={MoodAnalysis} />
        <Route path="/correlation" component={CorrelationMatrix} />
        <Route path="/about-us" component={AboutUs} exact />
        <Route path="/terms-of-service" component={TermsOfService} exact />
        <Route path="/disclaimer" component={Disclaimer} exact />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
