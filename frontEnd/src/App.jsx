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
import EmailVerify from "./components/Authentication/EmailVerify";

function App() {
  // const [user, setUser] = useState("");
  const data = useSelector((state) => state.user);
  const username = useSelector((state) => state.user?.userInfo?.username);
  const { siteMode } = useSelector((state) => state.theme);
  const { themeColor } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  console.log("datac", data);
  useEffect(() => {
    console.log("USERNAME IS ", username);

    if (username) {
      const userD = getUser(username);
      userD
        .then((userData) => {
          console.log("USR DATA IS ", userData);
          dispatch(setUser({ userData }));
        })
        .catch((error) => {
          console.error("Error:", error);
          dispatch(setUser(""));
        });
    }
  }, []);
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
