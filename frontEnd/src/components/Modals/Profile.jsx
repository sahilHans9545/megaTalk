import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch } from "react-redux";
import { setModalType } from "../../store/slices/modalSlice";
import userImg from "../../assets/user.png";

const Profile = ({ Data }) => {
  const dispatch = useDispatch();
  return (
    <div className="bg-color1 dark:bg-dark-secondary border-color4 border-4 dark:text-white  shadow-xl w-96 max-w-[90%] max-h-screen overflow-auto h-min-72 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] p-4 pb-10">
      <p className="text-center text-2xl">
        {Data?.username}
        <span
          onClick={() => {
            dispatch(setModalType(""));
          }}
          className="cursor-pointer float-right"
        >
          <CancelIcon className="mr-3" />
        </span>
      </p>
      <div className="mt-8 flex flex-col gap-5">
        <img
          src={Data?.profilePic || userImg}
          alt=""
          className="w-40 h-40 object-cover self-center"
        />
        <pre className="whitespace-pre-wrap break-words">{Data?.about}</pre>
      </div>
    </div>
  );
};

export default Profile;
