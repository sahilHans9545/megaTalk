import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { getUser } from "../ApiCalls/api";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const rememberRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);

    const url = "http://localhost:5000/api/login";
    const data = {
      username,
      password,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(url, data, { headers });

      let userData = null;

      try {
        userData = await getUser(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      const userInfo = {
        username: response.data.username,
        token: response.data.token,
      };

      // Check if the checkbox is checked
      if (rememberRef.current.checked) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      dispatch(setUser({ isLoggedIn: true, userInfo, userData }));

      navigate("/chats");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = () => {
  //   setLoading(true);
  //   const url = "http://localhost:5000/api/login";
  //   const data = {
  //     username,
  //     password,
  //   };

  //   const headers = {
  //     "Content-Type": "application/json",
  //   };
  //   setLoading(true);
  //   axios
  //     .post(url, data, { headers })
  //     .then((response) => {
  //       console.log("Response:", response);
  //       let data = {
  //         username: response.data.username,
  //         token: response.data.token,
  //       };
  //       console.log(rememberRef);
  //       localStorage.setItem("userInfo", JSON.stringify(data));
  //       const userD = getUser(data.username);
  //       let userDATA = "";

  //       userD
  //         .then((userData) => {
  //           console.log("USR DATA IS ", userData);
  //           userDATA = userData;
  //           dispatch(
  //             setUser({ isLoggedIn: true, userInfo: data, userData: userDATA })
  //           );
  //         })
  //         .catch((error) => {
  //           console.error("Error:", error);
  //           dispatch(
  //             setUser({ isLoggedIn: true, userInfo: data, userData: userDATA })
  //           );
  //         });
  //       setLoading(false);
  //       navigate("/chats");
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error.response.data);
  //       setLoading(false);
  //       toast.error(error.response.data.message);
  //     });
  //   setLoading(false);
  // };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          handleSubmit();
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Enter username <span className="text-red-600">*</span>
          </label>
          <input
            type="username"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
            placeholder="Enter your Email address"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div className="mb-4">
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
              value={password}
              placeholder="Enter Password"
              onChange={(e) => {
                setShowPassword(false);
                setPassword(e.target.value);
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute top-1/2 translate-y-[-50%] right-5"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300    ring-offset-gray-800 focus:ring-offset-gray-800"
              ref={rememberRef}
            />
          </div>
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium text-black "
          >
            Remember me
          </label>
        </div>
        {loading === false ? (
          <div>
            <button
              type="submit"
              className=" w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm   px-5 py-2.5 text-center "
            >
              {/* {!loading ? ( */}
              Login
              {/* ) : ( */}
              {/* )} */}
            </button>
          </div>
        ) : (
          <span className="">
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
          </span>
        )}
        {/* <div className="mt-3">
          <button
            type="submit"
            className=" w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm   px-5 py-2.5 text-center "
          >
            Login as a Guest
          </button>
        </div>
        <p className="text-[13px] mt-3 text-center">
          Forgot password ?{" "}
          <Link to="/recovery" className="text-red-500 font-semibold">
            Recover Now
          </Link>
        </p> */}
      </form>
    </div>
  );
};

export default Login;
