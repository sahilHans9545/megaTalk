import React from "react";
import CreateGroupChat from "./CreateGroupChat";
import { useDispatch, useSelector } from "react-redux";
import UpdateGroupChat from "./UpdateGroupChat";
import GroupAbout from "./GroupAbout";
import UpdateProfile from "./UpdateProfile";
import { setModalType } from "../../store/slices/modalSlice";
import About from "./About";
import UserProfile from "./UserProfile";
import LoggedProfile from "./LoggedProfile";
import Wallpaper from "./wallpaper";
import SideMenu from "../SideMenu";
const Modal = ({ socket }) => {
  const modalType = useSelector((state) => state.modalType);
  const dispatch = useDispatch();

  return (
    <div className="z-20">
      <div
        className="bg-[rgba(0,0,0,0.4)] w-full h-screen fixed left-0 top-0"
        onClick={() => dispatch(setModalType(""))}
      ></div>
      {modalType === "createGroup" && <CreateGroupChat />}
      {modalType === "updateGroup" && <UpdateGroupChat />}
      {modalType === "groupAbout" && <GroupAbout />}
      {modalType === "Profile" && <UpdateProfile />}
      {modalType === "About" && <About />}
      {modalType === "userProfile" && <UserProfile />}
      {modalType === "LoggedUserProfile" && <LoggedProfile />}
      {modalType === "wallpaper" && <Wallpaper socket={socket} />}
      {modalType === "mobileSideMenu" && <SideMenu />}
    </div>
  );
};

export default Modal;
