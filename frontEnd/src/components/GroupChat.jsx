import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../store/slices/chatSlice";
import { setModalType } from "../store/slices/modalSlice";

const GroupChat = () => {
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  const dispatch = useDispatch();
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
          <VisibilityIcon
            className="cursor-pointer"
            onClick={() => dispatch(setModalType("updateGroup"))}
          />
          <InfoIcon
            className="cursor-pointer"
            onClick={() => dispatch(setModalType("groupAbout"))}
          />
          <ExitToAppIcon className="text-red-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
