import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../ApiCalls/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: localStorage.getItem("userInfo") ? true : false,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : "",
    userData: "",
  },
  //   initialState: [],
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },

    logOut(state, action) {
      // (state.isLoggedIn = false), (state.userData = {});
      localStorage.removeItem("userInfo");
      return {};
    },
  },
});
// console.log(userSlice);
// console.log(userSlice.actions);
export const { setUser, logOut } = userSlice.actions;

export { userSlice };
