import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";

import userImg from "../../assets/user.png";
import { setModalType } from "../../store/slices/modalSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { setUser } from "../../store/slices/userSlice";

const About = () => {
  const user = useSelector((state) => state.user.userData);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [File, setFile] = useState(user.profilePic);
  const [About, setAbout] = useState(user.about);

  return (
    <div className="bg-white shadow-2xl fixed right-0 top-0 w-[400px] h-full px-5 py-7 z-10"></div>
  );
};

export default About;
