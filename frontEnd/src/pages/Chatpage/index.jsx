import React, { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import MyChats from "../../components/MyChats";
import ChatBox from "../../components/ChatBox";
import Header from "../../components/Header";
import "./style.css";
import SideMenu from "../../components/SideMenu";
import Modal from "../../components/Modals";
import { useSelector } from "react-redux";

const ChatPage = ({ user, setUser }) => {
  const [ShowSideDrawer, setShowSideDrawer] = useState(false);
  const modalType = useSelector((state) => state.modalType);

  const selectedChat = useSelector((state) => state.chatData.selectedChat);
  useEffect(() => {
    console.log("I am chatpage");
    // alert("opend");
  }, []);
  return (
    <div id="chatPage" className="flex flex-col">
      <Header setShowSideDrawer={setShowSideDrawer} />
      {ShowSideDrawer && <SideDrawer setShowSideDrawer={setShowSideDrawer} />}
      <div className="flex flex-1 h-[60vh]">
        <SideMenu />

        <div
          className={`md:[380px] lg:w-[400px] flex-1 md:flex-initial w-auto ${
            selectedChat ? "hidden md:block" : "block"
          }`}
        >
          <MyChats />
        </div>
        <div className={`flex-1 ${selectedChat ? "block" : "hidden md:block"}`}>
          <ChatBox user={user} setUser={setUser} />
        </div>
      </div>
      {modalType && <Modal />}
    </div>
  );
};

export default ChatPage;
