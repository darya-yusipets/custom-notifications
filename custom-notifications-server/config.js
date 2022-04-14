const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyCzmTpy1uMSusbmcP9naiSb2gnLqXLSgws",
  authDomain: "custom-notifications-49842.firebaseapp.com",
  projectId: "custom-notifications-49842",
  storageBucket: "custom-notifications-49842.appspot.com",
  messagingSenderId: "390440882420",
  appId: "1:390440882420:web:53b9983028421ebbd14ea1",
  measurementId: "G-LQ2TLK75BS",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const user = db.collection("users");

module.exports = user;