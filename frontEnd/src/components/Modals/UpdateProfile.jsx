import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";

import userImg from "../../assets/user.png";
import { setModalType } from "../../store/slices/modalSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { setUser } from "../../store/slices/userSlice";
console.log("ProfileMODAL");
const Profile = () => {
  const user = useSelector((state) => state.user.userData);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [File, setFile] = useState(user.profilePic);
  const [About, setAbout] = useState(user.about);
  console.log("I AM PROFILE MODAL");

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const filereader = new FileReader(file);
      filereader.readAsDataURL(file);
      filereader.onload = () => {
        resolve(filereader.result);
      };
      // filereader.onerror((err) => reject(err));
      filereader.onerror = (err) => {
        reject(err);
      };
    });
  };

  const onUpload = async (e) => {
    console.log(e.target.files[0]);
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const handleSubmit = async () => {
    //
    try {
      const data = {
        profilePic: File,
        about: About,
      };

      console.log("DATA S", data);

      const url = `https://megatalkbackend.onrender.com/api/updateuser?id=${user._id}`;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Make a PUT request using Axios with await
      const response = await axios.put(url, data, config);

      console.log("PUT request successful", response.data);
      toast.success("Updated Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      dispatch(setModalType(""));
      dispatch(setUser({ userData: response.data }));
    } catch (error) {
      console.error("Error making PUT request", error);
      toast.error("Failed to Update the profile!");
    }
  };

  return (
    <div className=" bg-white dark:bg-dark-grayish dark:text-white shadow-2xl fixed right-0 top-0 w-[400px] max-w-[90vw] h-full px-5 py-7 z-10">
      <p className="text-center text-2xl font-semibold mb-7">
        {user.username}
        <span
          onClick={() => {
            dispatch(setModalType(""));
          }}
          className="cursor-pointer float-right"
        >
          <CancelIcon className="mr-3" />
        </span>
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3 flex justify-center">
          <div className="mb-2 text-sm font-medium text-gray-900 cursor-pointer ">
            <img
              src={File || userImg}
              alt=""
              className={`w-[140px] h-[140px] object-cover rounded-full ${
                File ? "shadow-xl" : ""
              } `}
            />
          </div>
          <input
            type="file"
            id="profile"
            placeholder="Enter your image"
            className="hidden "
            onChange={onUpload}
          />
        </div>

        <div className="my-8 flex gap-4 justify-between items-center">
          <button
            className="w-40 py-1 border-[2px] border-red-400 text-red-400 hover:text-white hover:border-transparent hover:bg-red-400"
            onClick={() => setFile("")}
          >
            DELETE
          </button>
          <label
            htmlFor="profile"
            className="w-40 py-1 border-[2px] border-blue-400 text-blue-400 hover:text-white hover:border-transparent hover:bg-blue-400 text-center cursor-pointer"
          >
            CHANGE
          </label>
        </div>

        <div>
          <div className="flex flex-col">
            <label htmlFor="about" className="font-semibold">
              About
            </label>
            <textarea
              name=""
              id="about"
              cols="30"
              rows="5"
              value={About}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write something about yourself"
              className="dark:text-dark-secondary resize-none p-3 mt-3 border-[2px] border-blue-400 focus:outline-blue-400 focus:ring-4 focus:ring-blue-200  "
            >
              {user.about}
            </textarea>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="absolute bottom-0 left-0 w-full text-white bg-green-700 dark:bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium text-sm   px-5 py-2.5 text-center "
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
