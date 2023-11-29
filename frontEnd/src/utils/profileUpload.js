const postDetails = (pics) => {
  if (pics === undefined) {
    return Promise.reject("Please Select an Image!");
  }

  if (
    pics.type === "image/jpeg" ||
    pics.type === "image/png" ||
    pics.type === "image/jpg"
  ) {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "MegaTalk");
    data.append("cloud_name", "dfl5ed5gw");

    return fetch("https://api.cloudinary.com/v1_1/dfl5ed5gw/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  } else {
    return Promise.reject("Invalid Image Type!");
  }
};

export default postDetails;
