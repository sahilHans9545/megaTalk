import io from "socket.io-client";

const socket = io("https://megatalk.onrender.com",{
  transports: ["websocket", "polling", "flashsocket"],
});

export default socket;
