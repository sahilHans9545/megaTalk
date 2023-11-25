import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getSenderFull } from "../../config/chaLogics";
import Profile from "./Profile";

const UserProfile = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  const [Data, setData] = useState({});

  const userInfo = useSelector((state) => state.user.userInfo);
  const user = useSelector((state) => state.user.userData);
  const [groupChatName, setGroupChatName] = useState("");

  useEffect(() => {
    if (selectedChat) {
      setData(getSenderFull(user, selectedChat.users));
    } else {
      setData(user);
    }
  }, []);

  return <Profile Data={Data} />;
};

export default UserProfile;
