import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chatData",
  initialState: {
    chats: [],
    selectedChat: "",
  },
  //   initialState: [],
  reducers: {
    setChats(state, action) {
      return { ...state, chats: action.payload };
    },
    setSelectedChat(state, action) {
      return { ...state, selectedChat: action.payload };
    },
    clearChat(state, action) {
      return {};
    },
  },
});
export const { setChats, setSelectedChat, clearChat } = chatSlice.actions;

export { chatSlice };
