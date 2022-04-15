import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "./context/socket";
import Notification from "./components/Notification/Notification";
import { NotificationProps } from "./types/index";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";
import Header from "./components/layout/Header/Header";

const useStyles = makeStyles({
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );
  const [show, setShow] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    setShow(true);
    setTimeout(() => setShow(false), notification?.duration);
    socket.on("NotificationsAPI", (data: NotificationProps) => {
      setNotification(data);
    });
    // return () => socket.disconnect();
  }, [notification, socket]);

  console.log(notification);

  return (
    <>
      <Header />
      {notification ? (
        <>
          {show && (
            <Notification
              type={notification.type}
              message={notification.message}
            />
          )}
        </>
      ) : (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default App;
