import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/Chatpage";
import { useEffect } from "react";
import Password from "./components/Authentication/Password";
import Profile from "./components/Authentication/Profile";
import Recovery from "./components/Authentication/Recovery";
import Reset from "./components/Authentication/Reset";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./ApiCalls/api";
import { setUser } from "./store/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./socket";
import EmailVerify from "./components/Authentication/EmailVerify";
import {
  setChats,
  setFetchAgain,
  setMessages,
  setSelectedChat,
} from "./store/slices/chatSlice";
import { setNotifications } from "./store/slices/notificationSlice";

function App() {
  // const [user, setUser] = useState("");
  const data = useSelector((state) => state.user);
  const username = useSelector((state) => state.user?.userInfo?.username);
  const { siteMode } = useSelector((state) => state.theme);
  const { themeColor } = useSelector((state) => state.theme);
  // const chats = useSelector((state) => state.chatData.chats);
  const { chats, selectedChat } = useSelector((state) => state.chatData);
  // const { userData } = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const { fetchAgain, messages } = useSelector((state) => state.chatData);
  const { notification } = useSelector((state) => state);

  const dispatch = useDispatch();
  // console.log("datac", data);

  useEffect(() => {
    // console.log("USERNAME IS ", username);

    if (username) {
      const userD = getUser(username);
      userD
        .then((userData) => {
          // console.log("USR DATA IS ", userData);
          dispatch(setUser({ userData }));
          socket.emit("setup", userData);
          socket.on("connected", () => {
            setSocketConnected(true);
            // alert("CONNECTED");
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setUser(""));
        });
    }
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("NEW NOTIFICATION");

      if (
        selectedChat === "" ||
        selectedChat._id !== newMessageRecieved.chat._id
      ) {
        // alert("NOTIFICATION");
        console.log(newMessageRecieved);

        console.log("Notification", notification);
        const existingUser = notification.find(
          (N) => N.chatId === newMessageRecieved.chat._id
        );

        if (existingUser) {
          const updatedNotification = { ...existingUser };
          updatedNotification.count += 1;
          console.log(notification);
          console.log(updatedNotification);
          const index = notification.findIndex(
            (N) => N.chatId === newMessageRecieved.chat._id
          );

          const updatedNotificationArray = [...notification];
          updatedNotificationArray[index] = updatedNotification;
          console.log("BEFORE ", updatedNotificationArray);
          updatedNotificationArray.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          console.log("AFTER ", updatedNotificationArray);

          dispatch(setNotifications(updatedNotificationArray));
        } else {
          dispatch(
            setNotifications([
              {
                username: newMessageRecieved.sender.username,
                chat: newMessageRecieved.chat,
                chatId: newMessageRecieved.chat._id,
                count: 1,
                updatedAt: newMessageRecieved.chat.updatedAt,
              },
              ...notification,
            ])
          );
        }

        dispatch(setFetchAgain(!fetchAgain));
      } else {
        // setMessages([...messages, newMessageRecieved]);
        dispatch(setMessages([...messages, newMessageRecieved]));

        console.log("YE TO DIRECT HAI");
      }
    });

    return () => socket.off("message recieved");
  });

  useEffect(() => {
    socket.on("wallpaper changed", (chat) => {
      alert("wallpaper");
      // console.log("SOCKET CHATS ", chats);
      const newChats = [...chats];
      // console.log("NEW CHATS ", newChats);

      const chatToUpdate = newChats.find((c) => c._id === chat._id);
      // console.log("CHAT TO UPDATE ", chatToUpdate);
      if (chatToUpdate) {
        const updatedChat = {
          ...chatToUpdate,
          wallpaper: chat.wallpaper,
        };
        const chatIndex = newChats.findIndex((c) => c._id === chat._id);

        newChats.splice(chatIndex, 1, chat);
      }
      // console.log(newChats);

      dispatch(setChats(newChats));
      // console.log(selectedChat);
      if (selectedChat && selectedChat._id === chat._id) {
        dispatch(setSelectedChat(chat));
      }
    });
    return () => {
      socket.off("wallpaper changed");
    };
  }, [selectedChat, chats]);

  return (
    <div
      className={`${siteMode === "dark" ? "dark" : ""} ${
        themeColor === "red"
          ? "theme-red"
          : themeColor === "yellow"
          ? "theme-yellow"
          : themeColor === "green"
          ? "theme-green"
          : themeColor === "pink"
          ? "theme-pink"
          : ""
      }`}
    >
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            exact
            element={data.isLoggedIn ? <Navigate to="/chats" /> : <Home />}
          />
          <Route
            path="/chats"
            element={data.isLoggedIn ? <ChatPage /> : <Navigate to="/" />}
          />

          <Route path="/password" element={<Password />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/reset" element={<EmailVerify />} />
          <Route path="/user/:id/verify/:token" element={<EmailVerify />} />

          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// http://localhost:5173/655ce8811ebfb56927de8e23/user/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTUwN2JhODhjMWRhYWFkOGM4MGMyNWQiLCJ1c2VybmFtZSI6Ik9uZU1hbkJlYXN0IiwiaWF0IjoxNzAxMDI3NjA4LCJleHAiOjE3MDExMTQwMDh9.g0C8fJQY6yXaK8g_zSzjYRH-TjKxUzy2oFYH5L3Iw0o
