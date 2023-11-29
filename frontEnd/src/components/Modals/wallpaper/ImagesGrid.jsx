import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../../store/slices/chatSlice";
import { toast } from "react-toastify";
import axios from "axios";
import OvalLoading from "../../OvalLoading";
import { setModalType } from "../../../store/slices/modalSlice";

const ImagesGrid = ({ socket, images }) => {
  const { selectedChat } = useSelector((state) => state.chatData);
  const { userInfo, userData } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const changeWallpaper = async (image) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/wallpaper`,
        {
          chatId: selectedChat._id,
          wallpaper: image,
        },
        config
      );
      setLoading(false);
      dispatch(setModalType(""));
      toast.success("Wallpaper changed Successfully");
      console.log("DATA", data);
      dispatch(setSelectedChat(data));
      socket.emit("wallpaper change", data, userData._id);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error Occured!");
    }
  };

  return (
    <div className="wallpaperImageGrid">
      {images.map((image, id) => (
        <div key={id} className="relative group">
          <img src={image?.urls?.small} alt="BG IMAGE" />

          <button
            className="opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white px-3 py-1 text-white text-sm bg-dark-primary"
            onClick={() =>
              changeWallpaper(
                image?.urls?.full || image?.urls?.regular || image?.urls?.small
              )
            }
          >
            APPLY
          </button>
        </div>
      ))}
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <OvalLoading />
        </div>
      )}
    </div>
  );
};

export default ImagesGrid;
