import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  headerText: {
    padding: "15px 20px",
  },
});

const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            className={classes.headerText}
          >
            Custom Notifications Assignment
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
