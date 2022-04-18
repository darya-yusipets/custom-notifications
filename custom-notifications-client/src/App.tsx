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
  const socket = useContext(SocketContext);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const handler = (data: NotificationProps) => {
      setNotification(data);
      if (data.duration) {
        setTimeout(() => {
          setNotification(null);
          if (isSkipped) {
            setIsSkipped(false);
          }
        }, data.duration);
      }
    };
    socket.on("notification", handler);
    return () => {
      socket.off("notification", handler);
    };
  }, [isSkipped, socket]);

  // The app should not display the next (one upcoming only) notification for the user
  const hideNotification = () => {
    setIsSkipped(true);
    setNotification(null);
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
      {notification ? (
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
