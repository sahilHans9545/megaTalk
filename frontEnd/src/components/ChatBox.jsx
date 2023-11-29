import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";
import GroupChat from "./GroupChat";

const ChatBox = ({ socket }) => {
  // console.log("AGREE");
  const [showChat, setShowChat] = useState(false);
  const selectedChat = useSelector((state) => state.chatData.selectedChat);

  return (
    <div className="chatBox bg-white dark:bg-dark-grayish  h-full relative ">
      {!selectedChat ? (
        <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 dark:text-white">
          <img src={logo} alt="" className="w-[150px]" />
          <p className="text-2xl">Click on a User to start chatting.</p>
        </div>
      ) : (
        <SingleChat socket={socket} />
      )}
    </div>
  );
};

export default ChatBox;
