import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { chatSlice } from "./slices/chatSlice";
import { modalSlice } from "./slices/modalSlice";
import { themeSlice } from "./slices/themeSlice";
import { notificationSlice } from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    chatData: chatSlice.reducer,
    modalType: modalSlice.reducer,
    theme: themeSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export default store;
