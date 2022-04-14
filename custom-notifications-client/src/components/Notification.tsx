import React, { useContext, useState } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { NotificationProps } from "./../types/index";
import { SocketContext } from "../context/socket";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  notification: {
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const Notification: React.FC<NotificationProps> = (
  props: NotificationProps
) => {
  const { type, message } = props;
  const classes = useStyles();
  const socket = useContext(SocketContext);
  const [show, setShow] = useState(true);

  const handleClick = () => {
    socket.emit(
      "add-notification",
      {
        notification: {
          type: type,
          message: message,
        },
      },
      (data: NotificationProps) => {
        console.log(data);
      }
    );
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
