import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "Modal",
  initialState: "",
  //   initialState: [],
  reducers: {
    setModalType(state, action) {
      return action.payload;
    },
  },
});
export const { setModalType } = modalSlice.actions;

export { modalSlice };
