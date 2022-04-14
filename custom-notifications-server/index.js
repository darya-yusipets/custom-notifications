const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// const firebase = require("firebase");
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const config = require("config");
var Notification = require("./models/notification");

// const firebaseConfig = {
//   apiKey: "AIzaSyCzmTpy1uMSusbmcP9naiSb2gnLqXLSgws",
//   authDomain: "custom-notifications-49842.firebaseapp.com",
//   projectId: "custom-notifications-49842",
//   storageBucket: "custom-notifications-49842.appspot.com",
//   messagingSenderId: "390440882420",
//   appId: "1:390440882420:web:53b9983028421ebbd14ea1",
//   measurementId: "G-LQ2TLK75BS",
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

const PORT = process.env.PORT || 5000;
const test = require("./routes/test");

const app = express();

app.use(test);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
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

const excestingIndexes = Array.apply(null, {
  length: notifications.length,
}).map(Number.call, Number);

let interval;
const period = Math.floor(Math.random() * 10) + 5;
const duration = (Math.floor(Math.random() * 4) + 1) * 1000;
const userId = randomUUID();

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), period * 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("add-notification", function (data, callback) {
    // console.log(data);
    // const foundIndex = notifications.findIndex(data.notification);
    // excestingIndexes.filter((index) => foundIndex !== index);
    const notification = {...data, userId: userId};
    console.log(notification);
    // Notification.create(notification, (error, data) => {
    //   if (error) {
    //     return next(error);
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

// async function start() {
//   try {
//     await mongoose.connect(config.get("mongoUri"), {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
//   } catch (e) {
//     console.log("Server Error", e.message);
//     process.exit(1);
//   }
// }

// start();
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
