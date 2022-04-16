require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { randomUUID } = require("crypto");
const User = require("./models/user");
const mongoose = require("mongoose");
const { transformMessage } = require("./utils/transform-message");
const { getRandomTime } = require("./utils/get-random-time");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("useFindAndModify", false);

let notifications = [];
let interval;
let duration;
let period;

io.on("connection", (socket) => {
  console.log("New client connected");
  notifications = [
    {
      type: "info",
      message: "Big sale next week",
    },
    {
      type: "info",
      message: "New auction next month",
    },
    {
      type: "warning",
      message: "Limited edition books for next auction",
    },
    {
      type: "success",
      message: "New books with limited edition coming next week",
    },
    {
      type: "error",
      message: "Last items with limited time offer",
    },
  ];

  // Time period for showing a new notification (Random between 5-10 seconds)
  period = getRandomTime(5, 10);

  // Time duration of showing the notification (Random between 1-4 seconds)
  duration = getRandomTime(1, 4);

  if (interval) {
    clearInterval(interval);
  }

  // Every new browse of the app should treat the user as a new user
  const userId = randomUUID();
  const newUser = {
    userId: userId,
    notifications: [],
  };

  // Every new browse of the app should treat the user as a new user
  User.create(newUser, (error, data) => {
    if (error) {
      console.log("Error", error.message);
    } else {
      console.log(data);
    }
  });

  // The app should display random notifications for the user periodically
  interval = setInterval(() => emitNotification(socket), period);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("add-notification", function (data, callback) {
    // store on DB clicked notifications for each user
    User.findOneAndUpdate(
      { userId: userId },
      {
        $push: { notifications: data.notification },
      },
      {
        new: true,
      }
    ).exec((error, result) => {
      if (error) {
        console.log("Error", error.message);
      } else {
        // filter notifications so that clicked ones are not displayed to the user
        notifications = notifications.filter(
          (item) => item.message !== data.notification.message
        );
      }
    });
  });
});

const emitNotification = (socket) => {
  // get random notifications
  const index = Math.floor(Math.random() * notifications.length);
  const notification = notifications[index];
  if (notification) {
    notification.message = transformMessage(notification);
    socket.emit("NotificationsAPI", {
      ...notification,
      duration,
      period,
      isEmpty: false,
    });
  } else {
    socket.emit("NotificationsAPI", { notification: null, isEmpty: true });
  }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
