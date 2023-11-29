import React, { useEffect, useState } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import QuickreplyIcon from "@mui/icons-material/Quickreply";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "../store/slices/modalSlice";
import { getSender } from "../config/chaLogics";
import { setSelectedChat } from "../store/slices/chatSlice";
import { setNotifications } from "../store/slices/notificationSlice";
import userImg from "../assets/user.png";

const Header = ({ setShowSideDrawer }) => {
  const userData = useSelector((state) => state.user?.userData);
  const notifications = useSelector((state) => state.notification);
  const { selectedChat } = useSelector((state) => state.chatData);
  const [showNotification, setShowNotification] = useState(false);

  const dispatch = useDispatch();

  return (
    <div
      className={` bg-color1 border-[5px]  border-color7 ${
        selectedChat ? "hidden md:flex" : ""
      } flex justify-between items-center py-2.5 px-4 sm:px-10`}
    >
      <button
        className="flex items-center font-medium text-lg"
        onClick={() => setShowSideDrawer(true)}
      >
        <PersonSearchIcon style={{ fontSize: "26px" }} />
        <span className="hidden md:inline">Search User</span>
      </button>
      <div
        className={`text-color7 text-2xl md:text-3xl font-medium flex items-center gap-2`}
      >
        MegaTalk <img src={logo} alt="" className="w-7" />
        {/* <QuickreplyIcon className="text-blue-500" /> */}
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <div
            className=" cursor-pointer"
            onClick={() => setShowNotification(!showNotification)}
          >
            <NotificationsIcon style={{ fontSize: "26px" }} />
            {notifications?.length > 0 && (
              <span className="w-[18px] h-[18px] px-0.5 rounded-full text-center text-white text-xs bg-red-500 absolute -right-1 -top-[5px]">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </div>
          {showNotification && (
            <div className="bg-white w-60 sm:w-80 h-max-[500px] overflow-y-auto absolute z-[1] md:-left-[40px] right-0 md:right-auto top-[150%] shadow-2xl">
              {!notifications?.length ? (
                <p className=" px-4 py-2 text-center font-semibold">
                  No new Notifications
                </p>
              ) : (
                <div>
                  <p className="py-2 text-center ">
                    {" "}
                    {`${notifications.length} messages`}
                  </p>
                  <ul className="mt-1">
                    {notifications.map((nofc, id) => {
                      return (
                        <li
                          key={id}
                          className="py-2 bg-gray-100 px-5 cursor-pointer border-b-2 hover:bg-gray-300"
                          onClick={() => {
                            setShowNotification(false);
                            dispatch(setSelectedChat(nofc.chat));
                            dispatch(
                              setNotifications(
                                notifications.filter(
                                  (N) => N.chat._id !== nofc.chat._id
                                )
                              )
                            );
                          }}
                        >
                          {nofc.chat.isGroupChat ? (
                            <span className="flex items-center gap-3">
                              {" "}
                              <span className="bg-color6 text-white  w-5 h-5 rounded-full flex justify-center items-center ">
                                {nofc.count}
                              </span>{" "}
                              New {nofc.count > 1 ? "Messages" : "Message"} in{" "}
                              {nofc.chat.chatName}
                            </span>
                          ) : (
                            <span className="flex items-center gap-3">
                              {" "}
                              <span className="bg-color6 text-white w-5 h-5 rounded-full  flex justify-center items-center">
                                {nofc.count}
                              </span>{" "}
                              New {nofc.count > 1 ? "Messages" : "Message"} in{" "}
                              {getSender(userData, nofc.chat.users)}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-10 h-10 bg-gray-300 rounded-full">
          <img
            src={userData.profilePic || userImg}
            alt=""
            className="object-cover w-full h-full rounded-full border-2 cursor-pointer"
            onClick={() => dispatch(setModalType("LoggedUserProfile"))}
            style={
              userData.profilePic
                ? { boxShadow: "0 3px 1px rgba(0,0,0,0.2)" }
                : {}
            }
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
