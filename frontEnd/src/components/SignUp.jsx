import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import userImg from "../assets/user.png";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { getUser } from "../ApiCalls/api";
import { toast } from "react-toastify";
import postDetails from "../utils/profileUpload";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [File, setFile] = useState("");
  const [pic, setPic] = useState("");
  const [username, setUsername] = useState();
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);

  const handleSubmit = () => {
    if (!username || !email || !password) {
      toast.error("Fill all the fields to register!");
      return;
    }
    setLoading(true);
    const url = "http://localhost:5000/api/register";
    const data = {
      username,
      email,
      profilePic: pic,
      password,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .post(url, data, { headers })
      .then((response) => {
        console.log("Response:", response);
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.error("Error:", error.response.data);
        toast.error(error.response?.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onUpload = async (e) => {
    setPicLoading(true);
    try {
      const data = await postDetails(e.target.files[0]);
      setPic(data.url);
      console.log(data.url);
      setPicLoading(false);
    } catch (error) {
      setPicLoading(false);
      toast.error(error);
    }
  };

  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const filereader = new FileReader(file);
  //     filereader.readAsDataURL(file);
  //     filereader.onload = () => {
  //       resolve(filereader.result);
  //     };
  //     // filereader.onerror((err) => reject(err));
  //     filereader.onerror = (err) => {
  //       reject(err);
  //     };
  //   });
  // };

  // const onUpload = async (e) => {
  //   console.log(e.target.files[0]);
  //   const base64 = await convertToBase64(e.target.files[0]);
  //   setFile(base64);
  // };
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3 flex justify-center">
          <label
            htmlFor="profile"
            className="block mb-2 text-sm font-medium text-gray-900 cursor-pointer "
          >
            <img
              src={pic || userImg}
              alt=""
              className={`w-[140px] h-[140px] object-cover rounded-full ${
                File ? "shadow-xl" : ""
              } `}
            />
          </label>
          <input
            type="file"
            id="profile"
            placeholder="Enter your image"
            className="hidden "
            // onChange={onUpload}
            onChange={onUpload}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
            placeholder="Username"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Email Address <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
            placeholder="Enter your Email address"
            required
            onChange={(e) => {
              SetEmail(e.target.value);
            }}
            value={email}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={!showPassword ? "password" : "text"}
              id="password"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 "
              required
              placeholder="Enter Password"
              onChange={(e) => {
                setShowPassword(false);
                setPassword(e.target.value);
              }}
              value={password}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute top-1/2 translate-y-[-50%] right-5"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
        </div>

        {!loading && !picLoading ? (
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className=" w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm   px-5 py-2.5 text-center "
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <Oval
              height={25}
              width={25}
              color="#000"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#bababa"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;
