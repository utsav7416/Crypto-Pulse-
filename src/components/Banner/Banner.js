import { Container, makeStyles, Typography } from "@material-ui/core";
import Carousel from "./Carousel";

const useStyles = makeStyles((theme) => ({
  banner: {
    backgroundImage: "url(./banner2.jpg)",
  },
  bannerContent: {
    height: 400,
    display: "flex",
    flexDirection: "column",
    paddingTop: 25,
    justifyContent: "space-around",
  },
  tagline: {
    display: "flex",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
}));

function Banner() {
  const classes = useStyles();

  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontSize: "3.8rem",
              fontFamily: "Montserrat",
            }}
          >
            Crypto Pulse
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "gold",
              fontWeight: "bold",
              fontSize: "1.4rem",
              fontFamily: "Montserrat",
            }}
          >
            Charts talk. We listen.
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "gold",
              fontWeight: "bold",
              fontSize: "1.4rem",
              fontFamily: "Montserrat",
            }}
          >
            Crypto moves fast. We move faster.
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
}

export default Banner;
