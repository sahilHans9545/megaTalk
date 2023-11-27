import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "../../store/slices/modalSlice";
import UserSearchItem from "../UserSearchItem";

const GroupAbout = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  return (
    <div className="bg-white dark:bg-dark-secondary dark:text-white shadow-xl w-96 h-min-72 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] p-4 ">
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

      <h3 className="text-lg font-semibold mt-6">Group Description -</h3>
      <pre className="mt-1">{selectedChat.groupDesc}</pre>
      <div className="text-lg font-semibold mt-6">Users</div>
      <div className="flex flex-col h-56 overflow-auto gap-3 mt-2">
        {selectedChat.users.map((user) => {
          return (
            <UserSearchItem
              username={user.username}
              admin={selectedChat.groupAdmin.username}
              email={user.email}
              profile={user.profilePic}
              key={user._id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GroupAbout;
