const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    about: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: "String",
      default: "",
    },
    notifications: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
