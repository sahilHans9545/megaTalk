import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
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
  console.log("SCROLL ", messages);
  return (
    <div className="px-3 py-4">
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
                      src={message.sender.profilePic}
                      className="w-8 h-8 rounded-full "
                      alt=""
                    />
                  </div>
                )}

                <div
                  className={`ms-10 ${
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
                  <p
                    className={`${
                      message.sender._id === user._id
                        ? "bg-color6 text-white rounded-tr-[2px]"
                        : "bg-white rounded-tl-[2px]"
                    } rounded-[20px] px-4 py-1 `}
                  >
                    {message.content}
                  </p>
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
