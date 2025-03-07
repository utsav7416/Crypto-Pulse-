import {
    AppBar,
    Container,
    MenuItem,
    Select,
    Toolbar,
    Typography,
  } from "@material-ui/core";
  
import {
    createTheme,
    makeStyles,
    ThemeProvider,
  } from "@material-ui/core/styles";

import { useHistory } from "react-router-dom";

import { CryptoState } from "../CryptoContext";
  
    const useStyles = makeStyles((theme) => ({
        title: {
        flex: 1,
        color: "#0e0be0",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        cursor: "pointer",
        },
    }));
  
    const darkTheme = createTheme({
        palette: {
        primary: {
            main: "#fff",
        },
        type: "dark",
        },
    });
  
    function Header() {
        const classes = useStyles();
        const { currency, setCurrency } = CryptoState();
    
        const history = useHistory();
    
        return (
        <ThemeProvider theme={darkTheme}>
            <AppBar color="transparent" position="static">
            <Container>
                <Toolbar>
                <Typography
                    onClick={() => history.push(`/`)}
                    variant="h5"
                    className={classes.title}
                >
                    Crypto Pulse
                </Typography>
                {/* <Button color="inherit">Login</Button> */}
                <Select
                    variant="outlined"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                        width: 120,
                        height: 45,
                        marginLeft: 20,
                        borderRadius: 8,
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#1e1e1e",
                        border: "2px solid #007BFF",
                    }}
                    >
                    <MenuItem value={"USD"} style={{ fontWeight: "bold", color: "black" }}>
                        USD
                    </MenuItem>
                    <MenuItem value={"INR"} style={{ fontWeight: "bold", color: "black" }}>
                        INR
                    </MenuItem>
                </Select>
                </Toolbar>
            </Container>
            </AppBar>
        </ThemeProvider>
        );
    }
  
export default Header;