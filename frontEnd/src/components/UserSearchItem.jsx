import React from "react";
import userImg from "../assets/user.png";
const UserSearchItem = ({ email, username, profile, admin = "" }) => {
  return (
    <div className="flex items-center gap-2 bg-color4 p-2 rounded-md cursor-pointer">
      <img
        src={profile ? profile : userImg}
        className="w-9 h-9 bg-slate-200 rounded-full"
        alt=""
      />
      <div className="text-white">
        <p>
          {username}{" "}
          {admin && username === admin && (
            <span className="ms-3 bg-white text-dark-primary px-2 text-sm rounded-md py-0.5">
              {" "}
              Admin
            </span>
          )}
        </p>
        <p>
          <span className="font-bold">Email :</span> {email}
        </p>
      </div>
    </div>
  );
};

export default UserSearchItem;
