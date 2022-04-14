require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { randomUUID } = require("crypto");
const User = require("./models/user");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
// const test = require("./routes/test");

const app = express();

// app.use(test);

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

const notifications = [
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

// const excestingIndexes = Array.apply(null, {
//   length: notifications.length,
// }).map(Number.call, Number);

let interval;
const period = Math.floor(Math.random() * 10) + 5;
const duration = (Math.floor(Math.random() * 4) + 1) * 1000;
const userId = randomUUID();

io.on("connection", (socket) => {
  console.log("New client connected");
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
    console.log(userId);
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
        console.log(result);
      }
    });
    // const foundIndex = notifications.findIndex(data.notification);
    // excestingIndexes.filter((index) => foundIndex !== index);
    // const notification = { ...data.notification, userId: userId };
    // Notification.create(notification, (error, data) => {
    //   if (error) {
    //     console.log("Error", error.message);
    //   } else {
    //     console.log(data);
    //   }
    // });
  });
});

const getApiAndEmit = (socket) => {
  const index = Math.floor(Math.random() * notifications.length);
  const notification = notifications[index];
  if (notification.message.toLowerCase().includes("sale")) {
    notification.message = notification.message.concat("!");
  } else if (notification.message.toLowerCase().includes("new")) {
    notification.message = "~~" + notification.message;
  } else if (notification.message.toLowerCase().includes("limited edition")) {
    const array = notification.message.split(" ");
    array.map((x) => (x.toLowerCase() === "limited" ? x.toUpperCase() : x));
    array.map((x) => (x.toLowerCase() === "edition" ? x.toUpperCase() : x));
    notification.message = array.join(" ");
  }
  socket.emit("NotificationsAPI", { ...notification, duration });
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
