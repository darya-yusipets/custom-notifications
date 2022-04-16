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
  const [isShown, setIsShown] = useState(true);
  const socket = useContext(SocketContext);
  const [timer, setTimer] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    setIsShown(true);
    setTimeout(() => setIsShown(false), notification?.duration);
    socket.on("NotificationsAPI", (data: NotificationProps) => {
      setNotification(data);
      if (data.period && data.duration) {
        setTimer(data.period + data.duration);
        setDuration(data.duration);
      }
    });
  }, [socket, notification]);

  // The app should not display the next (one upcoming only) notification for the user
  const hideNotification = () => {
    setTimeout(() => setIsSkipped(true), duration);
    setTimeout(() => setIsSkipped(false), timer);
  };

  if (notification?.isEmpty) {
    socket.disconnect();
    return (
      <>
        <Header />
        <div className={classes.loading}>
          <h2>No notifications to display</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {notification && isShown ? (
        <>
          {!isSkipped ? (
            <Notification
              type={notification.type}
              message={notification.message}
              onHide={hideNotification}
            />
          ) : (
            <div className={classes.loading}>
              <h2>Skipping one notification...</h2>
            </div>
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
