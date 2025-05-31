const useStyles = makeStyles({
  selectbutton: {
    border: "1px solid gold",
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Montserrat",
    cursor: "pointer",
    width: "22%",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "gold",
      color: "black",
    },
  },
});

const SelectButton = ({ children, selected, onClick }) => {

  const classes = useStyles();

  return (
    <span
      onClick={onClick}
      className={classes.selectbutton}
      style={{
        backgroundColor: selected ? "gold" : "",
        color: selected ? "black" : "",
        fontWeight: selected ? 700 : 500,
      }}
    >
      {children}
    </span>
  );
};

export default SelectButton;
