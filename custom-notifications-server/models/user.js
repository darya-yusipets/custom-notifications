const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  notifications: [{
    type: {
      type: String,
    },
    message: {
      type: String,
    },
  }]
});

module.exports = mongoose.model("User", userSchema);
