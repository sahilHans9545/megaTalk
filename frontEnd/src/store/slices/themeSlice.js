import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themeColor: localStorage.getItem("themeColor") || "blue",
    siteMode: "",
  },
  //   initialState: [],
  reducers: {
    setthemeColor(state, action) {
      return { ...state, themeColor: action.payload };
    },
    setSiteMode(state, action) {
      return { ...state, siteMode: action.payload };
    },
    clearTheme(state, action) {
      return {};
    },
  },
});
export const { setthemeColor, setSiteMode, clearTheme } = themeSlice.actions;

export { themeSlice };
