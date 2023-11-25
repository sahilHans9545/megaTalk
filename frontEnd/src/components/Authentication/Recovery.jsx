import React from "react";
import logo from "../../assets/logo.png";

const Recovery = () => {
  return (
    <div
      id="homePage"
      className=" flex min-h-screen bg-[#0F172A] justify-center"
    >
      <div className=" flex flex-col items-center w-[400px]">
        <img src={logo} alt="" className="w-[120px]" />

        <div className="bg-white text-center mt-6  rounded-lg shadow-xl w-full overflow-hidden">
          <h1 className="px-4 py-4  bg-blue-600 text-white text-2xl font-semibold">
            Password Recovery
          </h1>
          <p className="px-4 text-sm mt-6">
            Enter 6 digit OTP address sent to your email address to recover
            password.
          </p>
          <div className="p-4 pt-0 mt-6 w-[300px] mx-auto">
            <form action="">
              <div className="mb-4">
                <input
                  type="text"
                  className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-400"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className=" w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm   px-5 py-2.5 text-center "
                >
                  Recover
                </button>
              </div>
              <p className="text-[13.5px] mt-3 text-center">
                Can&apos;t get OTP ?
                <span className="text-red-500 font-semibold cursor-pointer">
                  {" "}
                  Resend
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
