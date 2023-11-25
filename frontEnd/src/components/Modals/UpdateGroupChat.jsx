import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "../../store/slices/modalSlice";

const UpdateGroupChat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  return (
    <div className="bg-white dark:bg-dark-secondary dark:text-white  shadow-xl w-96 h-min-72 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] p-4 pb-20">
      <p className="text-center text-2xl">
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
        <div className="mb-4">
          <input
            type="username"
            id="email"
            className="bg-gray-50 dark:bg-dark-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
            placeholder="Group name"
            onChange={(e) => setGroupChatName(e.target.value)}
            value={groupChatName}
            required
          />
        </div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              id="password"
              className="bg-gray-50 dark:bg-dark-primary border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 "
              required
              //   value={search}
              placeholder="Add Users eg. sahil , ayush"
              //   onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div
          className="absolute left-0 bottom-0 bg-green-500 text-white text-center px-4 py-2 w-full cursor-pointer"
          //   onClick={() => handleSubmit()}
        >
          Update
        </div>
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
      {/* {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {searchResult?.slice(0, 3).map((user) => (
            <div key={user._id} onClick={() => handleGroup(user)}>
              {" "}
              <UserSearchItem
                username={user.username}
                email={user.email}
                profile={user.profilePic}
              />
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default UpdateGroupChat;
