import React, { useContext, useState } from "react";
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
  const [show, setShow] = useState(true);

  const handleClick = () => {
    const notification = {
      type: type,
      message: message,
    };
    socket.emit("add-notification", {
      notification: notification,
    });
    onHide && onHide();
    setShow(false);
  };

  return (
    <div className={classes.notification} onClick={handleClick}>
      {show && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity={type}>{message}</Alert>
        </Stack>
      )}
    </div>
  );
};

export default Notification;
