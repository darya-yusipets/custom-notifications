require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { randomUUID } = require("crypto");
const User = require("./models/user");
const mongoose = require("mongoose");

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

let notifications = [];
let interval;
const period = Math.floor(Math.random() * 10) + 5;
const duration = (Math.floor(Math.random() * 4) + 1) * 1000;
const userId = randomUUID();

io.on("connection", (socket) => {
  console.log("New client connected");
  notifications = [
    {
      type: "info",
      message: "Big sale next week\nNew auction next month",
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
  if (interval) {
    clearInterval(interval);
  }
  const newUser = {
    userId: userId,
    notifications: [],
  };
  User.create(newUser, (error, data) => {
    if (error) {
      console.log("Error", error.message);
    } else {
      console.log(data);
    }
  });
  interval = setInterval(() => getApiAndEmit(socket), period * 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("add-notification", function (data, callback) {
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
        notifications = notifications.filter(
          (item) => item.message !== data.notification.message
        );
      }
    });
  });
});

const getApiAndEmit = (socket) => {
  const index = Math.floor(Math.random() * notifications.length);
  const notification = notifications[index];
  if (notification) {
    const message = notification.message.toLowerCase();
    if (message.includes("sale") && !message.includes("!")) {
      notification.message = notification.message.concat("!");
    }
    if (message.includes("new") && !message.includes("~~")) {
      notification.message = "~~" + notification.message;
    }
    if (message.includes("limited edition")) {
      const array = message.split(" ");
      const transformedArray = array.map((x) =>
        x === "limited" || x === "edition" ? x.toUpperCase() : x
      );
      notification.message = transformedArray.join(" ");
    }
    socket.emit("NotificationsAPI", { ...notification, duration });
  }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
