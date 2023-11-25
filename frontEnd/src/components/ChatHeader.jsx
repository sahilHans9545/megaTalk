import React, { useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CallIcon from "@mui/icons-material/Call";
import CancelIcon from "@mui/icons-material/Cancel";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../store/slices/chatSlice";
import { setModalType } from "../store/slices/modalSlice";
import axios from "axios";
import { toast } from "react-toastify";

const ChatHeader = ({ sender, setMessages, messages }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { selectedChat } = useSelector((state) => state.chatData);
  const { userInfo } = useSelector((state) => state.user);
  const emptyChat = async () => {
    if (!selectedChat) return;

    if (!messages) toast("Chat is already empty!");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/emptyChat/${selectedChat._id}`,
        config
      );
      console.log("DATA FROM SERVER", data);
      toast("Chat Deleted Successfully!");
      setMessages([]);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
    setShowMenu(false);
  };
  return (
    <div className="flex items-center justify-between gap-9 bg-white dark:text-white dark:bg-dark-grayish  py-2 px-4 lg:px-10 shadow-2xl">
      <div className="flex items-center gap-3">
        <span
          className="bg-slate-600 p-1 text-white rounded-lg md:hidden mr-1 "
          onClick={() => dispatch(setSelectedChat(""))}
        >
          <KeyboardBackspaceIcon
            className="text-4xl"
            style={{ fontSize: "25px" }}
          />
        </span>
        <div className="w-11 h-11 rounded-full bg-slate-400">
          <img
            src={sender.profilePic}
            alt=""
            className="w-full h-full object-cover rounded-full"
            style={{
              boxShadow: "0 3px 2px rgba(0,0,0,0.2)",
              border: "1px solid gray",
            }}
          />
        </div>

        <span className="font-semibold text-lg md:text-xl">
          {sender.username}
        </span>
      </div>
      <div className="flex items-center gap-4 relative">
        <CallIcon className="cursor-pointer" />
        <MoreVertIcon
          className="cursor-pointer"
          onClick={() => setShowMenu(true)}
        />
        {showMenu && (
          <div className="z-10 bg-white text-black dark:bg-dark-primary dark:text-white shadow-lg w-72 py-4 pb-0  absolute right-0 top-[150%] ">
            <p className="text-center text-xl px-6">
              {sender.username}
              <span onClick={() => {}} className="cursor-pointer float-right">
                <CancelIcon
                  className="mr-3"
                  onClick={() => setShowMenu(false)}
                />
              </span>
            </p>
            <hr className="mt-4" />
            <ul className="py-4 flex flex-col ">
              <li
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-grayish hover:font-medium px-5 py-2.5"
                onClick={() => {
                  dispatch(setModalType("userProfile"));
                  setShowMenu(false);
                }}
              >
                <span className="w-12 inline-block">
                  <VisibilityIcon className="text-green-400" />
                </span>
                <span className="font-medium ">View Profile</span>
              </li>
              <li
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-grayish px-5 py-2.5"
                onClick={emptyChat}
              >
                <span className="w-12 inline-block">
                  <DeleteIcon className="text-red-500" />
                </span>
                <span className="font-medium ">Empty Chat</span>
              </li>
              <li className="cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-grayish px-5 py-2.5">
                <span className="w-12 inline-block">
                  <ImageIcon className="text-gray-600 dark:text-gray-50" />
                </span>
                <span className="font-medium ">change Wallpaper</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
