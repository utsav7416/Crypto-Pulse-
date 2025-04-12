import { makeStyles } from "@material-ui/core";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Homepage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

import AboutUs from "./Pages/AboutUs";
import TermsOfService from "./Pages/TermsOfService";
import Disclaimer from "./Pages/Disclaimer";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
      
        <Header />
        <Switch>
          <Route path="/" component={Homepage} exact />
          <Route path="/coins/:id" component={CoinPage} exact />
          <Route path="/about-us" component={AboutUs} exact />
          <Route path="/terms-of-service" component={TermsOfService} exact />
          <Route path="/disclaimer" component={Disclaimer} exact />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
