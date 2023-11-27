import React, { useEffect, useState } from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  setFetchAgain,
  setMessages,
  setSelectedChat,
} from "../store/slices/chatSlice";
import { Oval, ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { getSenderFull } from "../config/chaLogics";
import io from "socket.io-client";
import socket from "../socket";
import ChatHeader from "./ChatHeader";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useRef } from "react";
import GroupChat from "./GroupChat";
import defaultBg from "../assets/defaultChatBg.png";
import { setNotifications } from "../store/slices/notificationSlice";

let selectedChatCompare;

const SingleChat = () => {
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  const { userInfo } = useSelector((state) => state.user);
  // const { notification } = useSelector((state) => state);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [sender, setSender] = useState({});
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const { fetchAgain, messages } = useSelector((state) => state.chatData);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://megatalkbackend.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      // setMessages(data);
      dispatch(setMessages(data));
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error("Error Occured");
    }
  };

  const sendMessage = async (event = {}) => {
    console.log(userInfo);
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "https://megatalkbackend.onrender.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // setMessages([...messages, data]);
        dispatch(setMessages([...messages, data]));
        socket.emit("new message", data);
        dispatch(setFetchAgain(!fetchAgain));

        // toast.success("Message Sent.");
      } catch (error) {
        toast.error("Error Occured");
        console.log(error);
      }
    }
  };
  const typingHandler = (e) => {
    // setLoading(false);
    setNewMessage(e.target.value);
    console.log(inputRef.current.selectionStart, "--> Typing");

    // if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const addEmoji = (e) => {
    inputRef.current.focus();
    const start = newMessage.slice(0, inputRef.current.selectionStart);
    const end = newMessage.slice(inputRef.current.selectionStart);
    // console.log(start, end);
    const text = start + e.native + end;
    setNewMessage(text);
    setCursorPosition(start.length + e.native.length);
  };

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    setSender(getSenderFull(user, selectedChat.users));
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <div className="flex flex-col h-full">
      {selectedChat.isGroupChat ? (
        <GroupChat />
      ) : (
        <ChatHeader
          sender={sender}
          setMessages={setMessages}
          messages={messages}
        />
      )}

      <div
        className="chatTextBox flex-1 overflow-auto"
        style={{
          backgroundImage: `url(${
            selectedChat.wallpaper ? selectedChat.wallpaper : defaultBg
          })`,
        }}
      >
        {/* {selectedChat._id} */}
        {loading ? (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Oval
              height={45}
              width={45}
              color="#e9e5e5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#bababa"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </span>
        ) : (
          <ScrollableChat messages={messages} istyping={istyping} />
        )}
        {/* <ScrollableChat messages={messages} istyping={istyping} /> */}
      </div>

      <div className="flex gap-3 items-center py-4 px-4 lg:px-10 relative">
        <InsertEmoticonIcon
          className="cursor-pointer dark:text-white"
          onClick={() => {
            setShowEmoji((prev) => !prev);
          }}
        />

        <input
          type="text"
          required
          className="w-full py-2.5 ps-4 pr-7 border-[2px] border-gray-400 dark:text-white focus:outline-blue-500 rounded-full dark:bg-dark-primary"
          onKeyDown={sendMessage}
          value={newMessage}
          onChange={typingHandler}
          placeholder="Type a message"
          ref={inputRef}
        />
        <SendIcon
          className="dark:text-white absolute right-9 lg:right-16 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            console.log("SLSLSL");
            sendMessage();
          }}
        />
        {showEmoji && (
          <div className="absolute bottom-20 sm:bottom-24 sm:left-5 left-0 w-[100%] ">
            {" "}
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              maxFrequentRows={1}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleChat;
