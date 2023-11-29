import React, { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "../../../store/slices/modalSlice";
import axios from "axios";
import ImagesGrid from "./ImagesGrid";
import { toast } from "react-toastify";

import { setSelectedChat } from "../../../store/slices/chatSlice";
import OvalLoading from "../../OvalLoading";

const wallpaperTypes = [
  "Nature",
  "Love",
  "Beach",
  "Mountain",
  "Night",
  "Travel",
  "Forests",
  "Birds",
  "Flowers",
  "Pets",
  "Stars",
  "Space",
  "Anime",
  "Painting",
  "India",
];

const Wallpaper = ({ socket }) => {
  const [bgType, setBgType] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState("");
  const { userInfo, userData } = useSelector((state) => state.user);
  const { selectedChat } = useSelector((state) => state.chatData);

  const dispatch = useDispatch();

  const clearWallpaper = async (image) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/clearWallpaper`,
        {
          chatId: selectedChat._id,
        },
        config
      );
      setLoading(false);
      dispatch(setModalType(""));
      console.log("DATA", data);
      dispatch(setSelectedChat(data));
      socket.emit("wallpaper change", data, userData._id);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error Occured!");
    }
  };

  const fetchImages = async () => {
    try {
      const url = `https://api.unsplash.com/search/photos?page=1&per_page=9&query=${bgType}&client_id=nBzOc5Qy0lc6qsF7V2MvxF1amDLYkTxswq5Pb3SF0vg`;
      const { data } = await axios.get(url);
      setImages(data.results);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [bgType]);

  return (
    <div className="bg-white dark:bg-dark-secondary dark:text-white  shadow-xl w-[600px]  h-min-72 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] p-4 pb-10 max-w-[90vw] max-h-[85vh] overflow-auto ">
      {bgType ? (
        <div className="flex flex-col gap-2">
          <div className="flex1 overflow-auto">
            <ImagesGrid socket={socket} images={images} />
          </div>
          <span
            className="self-end w-fit float-right border border-color5 text-color5 py-2 px-7 cursor-pointer text-center hover:bg-color7 hover:text-white dark:bg-color6 dark:text-white"
            onClick={() => setBgType("")}
          >
            Back
          </span>
        </div>
      ) : (
        <div>
          <p className="text-center text-2xl font-medium">
            Change Background :
            <span
              onClick={() => {
                dispatch(setModalType(""));
              }}
              className="cursor-pointer float-right"
            >
              <CancelIcon className="mr-3" />
            </span>
          </p>

          <div className="wallpaperTypes my-5">
            {wallpaperTypes.map((type, id) => {
              return (
                <span
                  key={id}
                  className="border py-1 px-2 text-center cursor-pointer"
                  onClick={() => setBgType(type)}
                >
                  {type}
                </span>
              );
            })}
            {!loading ? (
              <span
                className="border border-color5 dark:bg-color6 dark:text-white text-color5 py-1 px-2 text-center cursor-pointer"
                onClick={clearWallpaper}
              >
                Clear
              </span>
            ) : (
              <OvalLoading />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallpaper;
