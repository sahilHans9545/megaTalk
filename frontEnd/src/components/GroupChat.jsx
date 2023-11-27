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
      <div className="flex items-center justify-between gap-9 bg-[#27313D] text-white py-2 px-10 shadow-inner">
        <div className="flex items-center gap-3">
          <span
            className="bg-slate-600 p-2 text-white rounded-lg md:hidden "
            onClick={() => dispatch(setSelectedChat(""))}
          >
            <KeyboardBackspaceIcon />
          </span>
          <div className="w-11 h-11 rounded-full bg-slate-400">
            {/* <img
              src={selectedChat.users[0].profilePic}
              alt=""
              className="w-12 h-12 rounded-full"
            /> */}
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
