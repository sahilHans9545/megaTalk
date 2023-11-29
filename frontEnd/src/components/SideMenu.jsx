import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import PaletteIcon from "@mui/icons-material/Palette";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { setModalType } from "../store/slices/modalSlice";
import {
  clearTheme,
  setSiteMode,
  setthemeColor,
} from "../store/slices/themeSlice";
import { toast } from "react-toastify";
import { clearChat } from "../store/slices/chatSlice";

const themeColors = [
  {
    color: "red",
    code: "255,0,0",
  },
  {
    color: "blue",
    code: "0,0,255",
  },
  {
    color: "green",
    code: "0,255,0",
  },
  {
    color: "pink",
    code: "255,192,202",
  },
  {
    color: "yellow",
    code: "255,255,0",
  },
];

const SideMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showThemePalette, setShowThemePalette] = useState(false);
  const { siteMode } = useSelector((state) => state.theme);
  const [menuType, setMenuType] = useState("chat");
  const modalType = useSelector((state) => state.modalType);
  const { selectedChat } = useSelector((state) => state.chatData);

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("themeColor");
    dispatch(clearChat());
    dispatch(clearTheme());

    navigate("/");
  };
  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : ""
      } bg-[#27313D] dark:bg-dark-grayish text-[#c8c8c8]  text-center sm:px-1.5  flex flex-col items-center  overflow-auto shrink-0 fixed sm:relative bottom-0 h-full px-1 py-7 left-0 `}
    >
      <ul className="flex flex-col gap-3 flex-1">
        <li
          className={`flex flex-col items-center cursor-pointer px-1.5 py-1.5 hover:bg-dark-secondary ${
            menuType === "profile" ? "text-color6 bg-dark-primary" : ""
          }`}
          onClick={() => {
            dispatch(setModalType("Profile"));
            setMenuType("profile");
          }}
        >
          <AccountCircleIcon />
          <span className="text-[10px]">PROFILE</span>
        </li>
        <li
          className={`flex flex-col items-center cursor-pointer px-1.5 py-1.5 hover:bg-dark-secondary ${
            menuType === "chat" ? "text-color6 bg-dark-primary" : ""
          }`}
          onClick={() => {
            setMenuType("chat");
          }}
        >
          <ChatIcon />
          <span className="text-[10px]">CHAT</span>
        </li>
        {/* <li
          className="flex flex-col items-center cursor-pointer px-1.5 py-1.5"
          onClick={() => dispatch(setModalType("About"))}
        >
          <InfoIcon />
          <span className="text-[10px]">ABOUT</span>
        </li> */}
        <li
          className={`flex flex-col items-center cursor-pointer px-1.5 py-1.5 hover:bg-dark-secondary ${
            menuType === "theme" ? "text-color6 bg-dark-primary" : ""
          }`}
          onClick={() => {
            setShowThemePalette(true);
            setMenuType("theme");
          }}
        >
          <PaletteIcon />
          <span className="text-[10px]">THEMES</span>
        </li>
        <li
          className={`flex flex-col items-center cursor-pointer px-1.5 py-1.5 hover:bg-dark-secondary ${
            menuType === "mode" ? "text-color6 bg-dark-primary" : ""
          }`}
          onClick={() => {
            dispatch(setSiteMode(siteMode === "dark" ? "light" : "dark"));
            setMenuType("mode");
          }}
        >
          {siteMode === "dark" ? <LightModeIcon /> : <NightlightRoundIcon />}
          <span className="text-[10px]">MODE</span>
        </li>
        <li
          className={`flex flex-col items-center cursor-pointer px-1.5 py-1.5 hover:bg-dark-secondary ${
            menuType === "logout" ? "text-color6 bg-dark-primary" : ""
          }`}
          onClick={() => {
            setMenuType("logout");
            toast.warn("wait a moment you are logging out...", {
              autoClose: 1500,
            });
            setTimeout(() => {
              handleLogOut();
            }, 2000);
          }}
        >
          <LogoutIcon />
          <span className="text-[10px]">LOGOUT</span>
        </li>
      </ul>

      {showThemePalette && menuType === "theme" && (
        <ul className="flex flex-col  gap-5">
          {themeColors.map((item) => {
            return (
              <li
                className={` border-[2px] border-white w-[18px] h-[18px] rounded-full cursor-pointer  `}
                onClick={() => {
                  dispatch(setthemeColor(item.color));
                  setShowThemePalette(false);
                  toast.success("Theme Updated Successfully !", {
                    autoClose: 2000,
                  });
                  localStorage.setItem("themeColor", item.color);
                  setMenuType("chat");
                }}
                style={{
                  boxShadow: `0 0 4px 5px rgba(${item.code},0.4),0 0 15px rgba(${item.code},1)`,
                  background: `rgb(${item.code})`,
                }}
                key={item.color}
              ></li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SideMenu;
