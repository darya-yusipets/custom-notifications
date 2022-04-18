import React, { useContext } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { NotificationProps } from "../../types/index";
import { SocketContext } from "../../context/socket";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  notification: {
    padding: "20px 40px",
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const Notification: React.FC<NotificationProps> = (
  props: NotificationProps
) => {
  const { type, message, onHide } = props;
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const handleClick = () => {
    const notification = {
      type: type,
      message: message,
    };
    socket.emit("dismiss", {
      notification: notification,
    });
    onHide && onHide();
  };

  return (
    <div className={classes.notification} onClick={handleClick}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity={type}>{message}</Alert>
      </Stack>
    </div>
  );
};

export default Notification;
