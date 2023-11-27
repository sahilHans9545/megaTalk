import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chatData",
  initialState: {
    chats: [],
    selectedChat: "",
    fetchAgain: false,
    messages: [],
  },
  //   initialState: [],
  reducers: {
    setChats(state, action) {
      return { ...state, chats: action.payload };
    },
    setSelectedChat(state, action) {
      return { ...state, selectedChat: action.payload };
    },
    setFetchAgain(state, action) {
      return { ...state, fetchAgain: action.payload };
    },
    setMessages(state, action) {
      return { ...state, messages: action.payload };
    },
    clearChat(state, action) {
      return {};
    },
  },
});
export const {
  setChats,
  setSelectedChat,
  setFetchAgain,
  clearChat,
  setMessages,
} = chatSlice.actions;

export { chatSlice };
