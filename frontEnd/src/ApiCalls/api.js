import axios from "axios";

export const getUser = (username) => {
  return axios
    .get(`https://megatalkbackend.onrender.com/api/getUser/${username}`)
    .then((response) => {
      // Handle the successful response
      // console.log("salu", response.data);
      return response.data;
    })
    .catch((error) => {
      // Handle error
      console.error("Error:", error);
      return error;
    });
};
