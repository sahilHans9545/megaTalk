import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/Chatpage";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailVerify from "./components/Authentication/EmailVerify";
import Error404 from "./components/Authentication/Error404";

function App() {
  const data = useSelector((state) => state.user);
  const { siteMode } = useSelector((state) => state.theme);
  const { themeColor } = useSelector((state) => state.theme);

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

          {/* <Route path="/password" element={<Password />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/reset" element={<EmailVerify />} /> */}
          <Route path="/user/:id/verify/:token" element={<EmailVerify />} />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// http://localhost:5173/655ce8811ebfb56927de8e23/user/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTUwN2JhODhjMWRhYWFkOGM4MGMyNWQiLCJ1c2VybmFtZSI6Ik9uZU1hbkJlYXN0IiwiaWF0IjoxNzAxMDI3NjA4LCJleHAiOjE3MDExMTQwMDh9.g0C8fJQY6yXaK8g_zSzjYRH-TjKxUzy2oFYH5L3Iw0o
