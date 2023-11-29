const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const cors = require("cors");
const router = require("./routes/router");
const path = require("path");
const User = require("./models/userModel");
bodyParser = require("body-parser");
const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(express.json());

app.use("/api", router);

// *************** DEPLOYMENT ***************

// const __dirname1 = path.join(__dirname, "../");
// console.log(__dirname1);
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontEnd/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "frontEnd", "dist", "index.html"));
//   });
// } else {
app.get("/", (req, res) => {
  res.json({
    message: "Success is the only option",
  });
});
// }

// *************** DEPLOYMENT ***************

// app.use((req, res, next) => {
//   const err = new Error("Something went wrong");
//   err.status = 404;
//   next(err);
// });

// Error handler middleware
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.send({
//     error: {
//       status: err.status || 500,
//       message: err.message,
//     },
//   });
// });

// *** Connection with Database ***

// console.log(process.env.MONGO_URL);
// console.log(process.env.SMTP_EMAIL);
const server = app.listen(5000, () => {
  mongoose
    .connect(
      "mongodb+srv://hanss9545:yHzKqKRSeBnIsR3b@cluster0.4gqosjj.mongodb.net/MegaTalk"
    )
    .then(() => {
      console.log(`Example app listening on port 5000`);
    })
    .catch((error) => {
      console.log("connection Failed :- ", error);
    });
  // console.log("Server running on PORT");
});

// console.log(server);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5173/", "https://megatalk.onrender.com/"],
  },
});

io.on("connection", async (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(" *** USERNAME ***", userData.username);
    socket.emit("connected");
  });

  const userId = socket.handshake.auth.token;
  console.log(userId);
  // console.log(socket);

  await User.findByIdAndUpdate({ _id: userId }, { $set: { isOnline: true } });
  socket.broadcast.emit("getOnlineUser", { userId });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log(newMessageRecieved.content);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      console.log("*******", user.username, "********");
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("wallpaper change", (chat, senderId) => {
    // var chat = newMessageRecieved.chat;
    // console.log(newMessageRecieved.content);
    console.log("WALLPAPER CHANGED BY", senderId);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == senderId) return;

      socket.in(user._id).emit("wallpaper changed", chat);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
  socket.on("disconnect", async () => {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { isOnline: false } }
    );
    socket.broadcast.emit("getOfflineUser", { userId });
    console.log(user.username, " User disconnected");
  });
});
