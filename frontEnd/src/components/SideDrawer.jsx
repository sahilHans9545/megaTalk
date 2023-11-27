import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchedUser from "./SearchedUser";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import axios from "axios";
import { setChats } from "../store/slices/chatSlice";

const SideDrawer = ({ setShowSideDrawer }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const chats = useSelector((state) => state.chatData.chats);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!search) {
      toast("🦄 Search field can't be empty !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    setLoading(true);
    console.log(userInfo, "yeah");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `https://megatalkbackend.onrender.com/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
      console.log("SEARCH RESULT IS ", data);
    } catch (error) {
      toast("PEOPLE NOT FOUND");
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    setShowSideDrawer(false);

    try {
      // setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `https://megatalkbackend.onrender.com/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id))
        dispatch(setChats([data, ...chats]));
      // dispatch(setChats())
      console.log(data);
      // setSelectedChat(data);
      // setLoadingChat(false);
    } catch (error) {
      alert("ERROR OCCURED");
    }
  };

  return (
    <div className="w-[340px] fixed top-0 left-0 bg-white dark:bg-dark-secondary h-screen z-10 shadow-2xl">
      <p className="py-4 px-3 text-xl flex items-center justify-between font-semibold dark:bg-dark-primary dark:text-white">
        Search Users...{" "}
        <span
          onClick={() => {
            setShowSideDrawer(false);
          }}
          className="cursor-pointer"
        >
          <CancelIcon className="mr-3" />
        </span>
      </p>
      <hr />
      <div className="px-3 flex items-center gap-3 mt-6">
        <input
          type="text"
          className="bg-[#ebebeb] dark:bg-white flex-1 py-2 px-4 rounded-md"
          placeholder="Enter Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-700 dark:bg-blue-800 text-white p-2 rounded-md"
          onClick={handleSearch}
        >
          GO
        </button>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center mt-9">
          <Audio
            height="40"
            width="40"
            radius="9"
            color="blue"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
          <span className="text-xl dark:text-white">Searching...</span>
        </div>
      )}

      {!loading && searchResult && (
        <div className="flex flex-col gap-2 px-3 mt-5">
          {searchResult.map((user, id) => {
            return (
              <SearchedUser
                email={user.email}
                username={user.username}
                profile={user.profilePic}
                key={id}
                accessChat={accessChat}
                userId={user._id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SideDrawer;
