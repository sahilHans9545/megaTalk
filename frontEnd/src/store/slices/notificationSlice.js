import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "Notification",
  initialState: [],
  reducers: {
    setNotifications(state, action) {
      return action.payload;
    },
  },
});
export const { setNotifications } = notificationSlice.actions;

export { notificationSlice };
