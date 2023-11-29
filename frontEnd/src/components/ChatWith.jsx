import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSender } from "../config/chaLogics";

const displayTypes = ["ALL", "PEOPLE", "GROUP", "UNREAD"];
const ChatWith = ({ setDisplayChats, chats, searchTerm }) => {
  const [filter, setFilter] = useState("ALL");
  // const chats = useSelector((state) => state.chatData.chats);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (filter === "PEOPLE") {
      let searchedChats = chats?.filter((chat) => {
        return (
          !chat?.isGroupChat &&
          getSender(userData, chat.users)
            .toLowerCase()
            .includes(searchTerm?.toLowerCase())
        );
      });
      setDisplayChats(searchedChats);
    } else if (filter === "GROUP") {
      let searchedChats = chats?.filter((chat) => {
        return (
          chat?.isGroupChat &&
          chat.chatName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setDisplayChats(searchedChats);
    } else {
      let searchedChats = chats?.filter((chat) => {
        return (
          (!chat?.isGroupChat &&
            getSender(userData, chat.users)
              .toLowerCase()
              .includes(searchTerm?.toLowerCase())) ||
          (chat?.isGroupChat &&
            chat.chatName?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      setDisplayChats(searchedChats);
    }
  }, [filter, searchTerm, chats]);

  return (
    <div>
      <ul className="flex text-[#a4a4a4] dark:text-light-text text-sm font-semibold gap-8 sm:justify-start sm:gap-6 lg:gap-10 lg:ps-5">
        {displayTypes.map((type, id) => {
          return (
            <li
              key={id}
              className={`cursor-pointer ${
                filter === type ? "text-white" : ""
              }`}
              onClick={() => {
                setFilter(type);
              }}
            >
              {type}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatWith;
