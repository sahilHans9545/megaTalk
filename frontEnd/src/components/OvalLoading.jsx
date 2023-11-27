import React from "react";
import { Oval } from "react-loader-spinner";

const OvalLoading = () => {
  return (
    <div className="flex justify-center my-3">
      <Oval
        height={45}
        width={45}
        color="#e9e5e5"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#bababa"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default OvalLoading;
