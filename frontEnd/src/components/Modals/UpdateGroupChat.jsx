import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "../../store/slices/modalSlice";
import { toast } from "react-toastify";
import { setSelectedChat } from "../../store/slices/chatSlice";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import UserSearchItem from "../UserSearchItem";

const UpdateGroupChat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  const { userInfo, userData } = useSelector((state) => state.user);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occured");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data);

      // console.log(data._id);
      dispatch(setSelectedChat(data));
      // setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occured");
      console.log(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast("User Already in group!");
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
        `http://localhost:5000/api/group/addUser`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      dispatch(setSelectedChat(data));
      toast.success(`${user1.username} added in Group.`);
      // setFetchAgain(!fetchAgain);
      // setLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      // setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (user1._id === userData._id) {
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
        `http://localhost:5000/api/group/removeUser`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      toast.success(`${user1.username} removed from the Group successfully!`);
      console.log("DATA", data);
      // user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      // fetchMessages();
      // setLoading(false);
      dispatch(setSelectedChat(data));
    } catch (error) {
      toast.error("Error Occured!");
      // setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <div className="bg-white dark:bg-dark-secondary dark:text-white  shadow-xl w-96 h-min-72 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] p-4 pb-20 max-w-[90vw] max-h-[85vh] overflow-auto">
      <p className="text-center text-2xl font-medium">
        {selectedChat.chatName}
        <span
          onClick={() => {
            dispatch(setModalType(""));
          }}
          className="cursor-pointer float-right"
        >
          <CancelIcon className="mr-3" />
        </span>
      </p>
      <form action="" className="my-6 mb-0">
        <div className="flex flex-wrap gap-2 mb-4 ">
          {selectedChat.users.map((user) => (
            <span
              key={user._id}
              className="bg-orange-600 text-white rounded-full py-1 px-3 text-sm"
            >
              {" "}
              {user.username}
              <span
                className="cursor-pointer"
                // onClick={() => handleDelete(user)}
              >
                <CloseIcon
                  className="ml-1 w-[20px] h-5"
                  style={{ fontSize: "18px" }}
                  onClick={() => handleRemove(user)}
                />
              </span>
            </span>
          ))}
        </div>
        <div className="mb-4 relative">
          <input
            type="username"
            id="email"
            className="bg-gray-50 dark:bg-dark-primary dark:text-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
            placeholder="Group name"
            onChange={(e) => setGroupChatName(e.target.value)}
            value={groupChatName}
            required
          />
          {!renameLoading ? (
            <button
              className="bg-color8 text-white absolute right-0 top-0 bottom-0 px-3 rounded-lg"
              onClick={handleRename}
            >
              update
            </button>
          ) : (
            <span className=" absolute right-3 top-1/2 -translate-y-1/2">
              <Oval
                height={22}
                width={22}
                color="blue"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#bababa"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </span>
          )}
        </div>
        <div className="mb-4">
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            className="resize-none bg-gray-50 dark:bg-dark-primary dark:text-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
            placeholder="Group description..."
            // onChange={(e) => setGroupDescription(e.target.value)}
            // value={groupDescription}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              className="bg-gray-50 dark:bg-dark-primary border dark:text-white border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 "
              required
              value={search}
              placeholder="Add Users eg. sahil , ayush"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="mt-1">Loading...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {/*  */}
              {searchResult?.slice(0, 3)?.map((user) => (
                <div key={user._id} onClick={() => handleAddUser(user)}>
                  {" "}
                  <UserSearchItem
                    username={user.username}
                    email={user.email}
                    profile={user.profilePic}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div>
          <button className="bg-red-700 text-white  px-3 py-1.5 rounded-lg float-right">
            Leave Group
          </button>
        </div> */}
      </form>
      <div className="flex gap-2 mb-4 flex-wrap">
        {/* {selectedUsers.map((user) => (
          <span
            key={user._id}
            className="bg-orange-600 text-white rounded-full py-1 px-3 text-sm"
          >
            {" "}
            {user.username}
            <span className="cursor-pointer" onClick={() => handleDelete(user)}>
              <CloseIcon className="ml-1 w-[20px] h-5" />
            </span>
          </span>
        ))} */}
      </div>
    </div>
  );
};

export default UpdateGroupChat;
