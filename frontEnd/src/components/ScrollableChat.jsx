import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import userImg from "../assets/user.png";
import {
  getOnceSenderUsername,
  isLastMessage,
  isPreviousDiff,
  isSameSender,
} from "../config/chaLogics";

const ScrollableChat = ({ messages, istyping }) => {
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.user.userData);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages, istyping]);

  const convertTime = (createdTime) => {
    const utcTimestamp = "2023-11-29T08:43:53.274Z";
    const date = new Date(createdTime);

    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedTime;
  };

  return (
    <div className="px-2 sm:px-3 py-4">
      {messages &&
        messages.map((message, i) => {
          return (
            <div key={i}>
              <div
                className={`flex gap-2  relative ${
                  message.sender._id === user._id ? "justify-end" : ""
                }`}
              >
                {(isSameSender(messages, message, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <div className="absolute bottom-0">
                    <img
                      src={message.sender.profilePic || userImg}
                      className="w-8 h-8 rounded-full "
                      alt=""
                    />
                  </div>
                )}

                <div
                  className={`ms-9 md:ms-10 ${
                    isPreviousDiff(messages, message, i, user._id)
                      ? "mt-4"
                      : "mt-[3.5px]"
                  }  `}
                >
                  {getOnceSenderUsername(messages, message, i, user._id) && (
                    <p className="text-xs font-semibold bg-white rounded-tl-lg rounded-tr-lg px-1 pt-[2px] mb-[2.5px] w-fit">
                      {message.sender.username}
                    </p>
                  )}
                  <div
                    className={`${
                      message.sender._id === user._id
                        ? "bg-color6 text-white rounded-tr-[2px]"
                        : "bg-white rounded-tl-[2px]"
                    } rounded-[20px] px-4 py-1 pb-2 relative`}
                  >
                    <p>
                      {" "}
                      {message.content} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp;
                    </p>
                    {/* <p className="pr-16 pt-1"> */}
                    <span className="text-[10px] absolute bottom-0.5 right-3">
                      {message?.createdTime}
                    </span>
                    {/* </p> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {istyping && (
        <span className="relative left-3 top-3">
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color="#fff"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </span>
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ScrollableChat;
