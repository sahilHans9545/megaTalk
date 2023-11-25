import React from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import QuickreplyIcon from "@mui/icons-material/Quickreply";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "../store/slices/modalSlice";

const Header = ({ setShowSideDrawer }) => {
  const userData = useSelector((state) => state.user?.userData);
  const { themeColor } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  console.log("DUDE I AM HEADER");
  return (
    <div
      className={`bg-color1 border-[5px]  border-color7 flex justify-between items-center py-2.5 px-5 sm:px-10`}
    >
      <button
        className="flex items-center font-medium text-lg"
        onClick={() => setShowSideDrawer(true)}
      >
        <PersonSearchIcon />
        <span className="hidden md:inline">Search User</span>
      </button>
      <div
        className={`text-color7 text-2xl md:text-3xl font-medium flex items-center gap-2`}
      >
        MegaTalk <img src={logo} alt="" className="w-7" />
        {/* <QuickreplyIcon className="text-blue-500" /> */}
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationsIcon />
        <div className="w-10 h-10 bg-gray-300 rounded-full">
          <img
            src={userData.profilePic}
            alt=""
            className="object-cover w-full h-full rounded-full border-2 cursor-pointer"
            onClick={() => dispatch(setModalType("LoggedUserProfile"))}
            style={{ boxShadow: "0 3px 1px rgba(0,0,0,0.2)" }}
          />
        </div>
        {/* <KeyboardArrowDownIcon /> */}
        <p className="hidden sm:block">
          Welcome,{" "}
          <span className={`text-color9 font-bold`}>{userData.username}</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default Header;
