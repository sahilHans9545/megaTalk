import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../store/slices/chatSlice";
import { setModalType } from "../store/slices/modalSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { getProfileName } from "../config/chaLogics";

const GroupChat = () => {
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  const { userData, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const leaveGroup = async () => {
    if (selectedChat.groupAdmin._id === userData._id) {
      toast("You are an Admin..");
      return;
    }
    try {
      // setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `https://megatalkbackend.onrender.com/api/group/removeUser`,
        {
          chatId: selectedChat._id,
          userId: userData._id,
        },
        config
      );
      toast.success(`You left the Group successfully!`);
      // console.log("DATA", data);
      dispatch(setSelectedChat(""));
    } catch (error) {
      toast.error("Error Occured!");
      // setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-9 bg-white dark:bg-dark-grayish dark:text-white py-2 px-3 lg:px-10 shadow-inner">
        <div className="flex items-center gap-3">
          <span
            className="bg-slate-600 dark:bg-dark-primary p-1 text-white rounded-lg md:hidden "
            onClick={() => dispatch(setSelectedChat(""))}
          >
            <KeyboardBackspaceIcon style={{ fontSize: "25px" }} />
          </span>
          <div className="md:w-11 md:h-11 h-10 w-10 rounded-full bg-blue-100 dark:text-black text-sm font-medium flex justify-center items-center">
            {getProfileName(selectedChat.chatName)}
          </div>

          <span className="font-semibold text-lg md:text-xl">
            {selectedChat.chatName}
          </span>
        </div>
        <div className="flex items-center gap-4 relative">
          {selectedChat.groupAdmin._id === userData._id && (
            <VisibilityIcon
              className="cursor-pointer"
              onClick={() => dispatch(setModalType("updateGroup"))}
            />
          )}

          <InfoIcon
            className="cursor-pointer"
            onClick={() => dispatch(setModalType("groupAbout"))}
          />
          {selectedChat.groupAdmin._id !== userData._id && (
            <ExitToAppIcon
              className="text-red-500 cursor-pointer"
              onClick={() => leaveGroup()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
