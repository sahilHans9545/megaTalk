import React, { useState } from "react";
import "./style.css";
import SignUp from "../../components/SignUp";
import Login from "../../components/login";
import { Navigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Home = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("login");
  // const navigate = useNavigate();

  return (
    <div
      id="homePage"
      className=" flex min-h-screen bg-[#0F172A] justify-center px-5"
    >
      <div className=" flex flex-col justify-center md:justify-start w-[400px] max-w-[90vw]">
        <div className="bg-white py-2 text-center px-5 rounded-full text-[22px] flex justify-center items-center gap-4">
          <div>
            Welcome to <span className="text-blue-700">MegaTalk</span>
          </div>

          <img src={logo} alt="" className="w-7" />
        </div>

        <div className="bg-white mt-6 p-4 rounded-lg shadow-xl">
          <div className="text-base">
            <button
              className={`w-1/2 py-[4px] rounded-2xl font-medium ${
                activeTab === "login" ? "bg-blue-200 text-blue-800" : ""
              }`}
              onClick={() => {
                setActiveTab("login");
              }}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-[4px] rounded-2xl font-medium ${
                activeTab !== "login" ? "bg-blue-200 text-blue-800" : ""
              }`}
              onClick={() => {
                setActiveTab("signUp");
              }}
            >
              Sign Up
            </button>
          </div>
          {/* <div>
            <button
              onClick={() => {
                navigate("/chats");
              }}
            >
              Click
            </button>
          </div> */}
          <div className="mt-8">
            {activeTab === "login" ? (
              <Login user={user} setUser={setUser} />
            ) : (
              <SignUp />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
