import React, { useEffect, useState } from "react";
import ChatWith from "./ChatWith";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { setChats, setSelectedChat } from "../store/slices/chatSlice";
import { getSender, getSenderIndex } from "../config/chaLogics";
import { setModalType } from "../store/slices/modalSlice";
import userImg from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import { logOut } from "../store/slices/userSlice";
import { Oval } from "react-loader-spinner";

const MyChats = () => {
  const { userInfo, userData } = useSelector((state) => state.user);
  // const userData = useSelector((state) => state.user.userData);
  const [displayChats, setDisplayChats] = useState([]);
  const { chats, fetchAgain, selectedChat } = useSelector(
    (state) => state.chatData
  );
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // console.log("CHAT DATA ", chats);
  const fetchChats = async () => {
    // console.log(user._id);
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "https://megatalkbackend.onrender.com/api/chat",
        config
      );

      setDisplayChats(data);
      dispatch(setChats(data));
      setLoading(false);

      // console.log("FETCED CHATS ARE = ", data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(error);
        toast.error("Your session time out!");
        localStorage.removeItem("userInfo");
        dispatch(logOut());
        navigate("/");
      } else {
        toast(error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);
  // useEffect(() => {
  //   fetchChats();
  // }, []);
  return (
    <div
      className={`bg-[#2C3544] dark:bg-dark-primary h-full  pt-7 pb-11 relative flex flex-col  `}
    >
      <div className="px-4">
        <input
          type="text"
          placeholder="search chats..."
          className="w-full px-5 py-2 bg-[#27313D] text-white outline-red-300 border-b-2 border-transparent focus:border-gray-100 focus:outline-none"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />

        <div className="mt-4">
          <ChatWith
            setDisplayChats={setDisplayChats}
            chats={chats}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll mt-7">
        <p className=" text-white dark:text-light-text dark:font-semibold px-4">
          YOUR CONVERSATIONS
        </p>
        <div className="mt-7">
          {loading && (
            <div className="flex justify-center py-5">
              <Oval
                height={35}
                width={35}
                color="#e9e5e5"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#bababa"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          )}

          {!loading && displayChats.length === 0 && (
            <p className="text-2xl text-white text-center">Chats Empty!</p>
          )}

          <ul className="flex flex-col">
            {displayChats &&
              displayChats.map((userChat, id) => {
                return (
                  <li
                    className={`flex gap-5 items-center py-2 px-4 cursor-pointer ${
                      selectedChat?._id === userChat?._id
                        ? "  dark:shadow-md shadow-sm shadow-color2 bg-[#817c7c6b] dark:bg-dark-grayish"
                        : ""
                    } border-b-2 border-[#384453]`}
                    key={id}
                    onClick={() => dispatch(setSelectedChat(userChat))}
                  >
                    <div className="chatProfileImg w-10 h-10 rounded-lg bg-gray-50 overflow-hidden">
                      <img
                        src={
                          userChat.users[
                            getSenderIndex(userData, userChat.users)
                          ].profilePic || userImg
                        }
                        alt=""
                        className="w-full h-full  object-cover"
                      />
                    </div>
                    <div className="flex-1 max-w-[290px]">
                      <p className="text-white text-lg font-medium">
                        {!userChat.isGroupChat
                          ? getSender(userData, userChat.users)
                          : userChat.chatName}
                      </p>
                      <span
                        className={`${
                          selectedChat === userChat
                            ? "text-white"
                            : "text-[#a4a4a4]"
                        } inline-block w-52 text-ellipsis overflow-hidden whitespace-nowrap`}
                      >
                        {userChat?.latestMessage?.content || "Send Hello!"}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div
        className="absolute left-0 bottom-0 bg-color6 text-white text-center px-4 py-2 w-full cursor-pointer"
        onClick={() => dispatch(setModalType("createGroup"))}
      >
        Create a New Group
      </div>
    </div>
  );
};

export default MyChats;
