export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender._id !== m.sender._id &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[i].sender._id !== userId &&
    messages[i].sender._id
  );
};

export const getSender = (loggedUser, users) => {
  // console.log(users);
  return users[0]?._id === loggedUser?._id
    ? users[1].username
    : users[0].username;
};
export const getSenderIndex = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? 1 : 0;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const getOnceSenderUsername = (messages, m, i, userId) => {
  if (i == 0 && messages[i].sender._id !== userId) return true;
  if (i == 0) return false;
  return (
    messages[i - 1].sender._id !== messages[i].sender._id &&
    messages[i].sender._id !== userId
  );
};

export const isPreviousDiff = (messages, m, i, userId) => {
  if (i == 0) return false;

  return messages[i - 1].sender._id !== messages[i].sender._id;
};

export const getProfileName = (username = "") => {
  const nameArray = username.split(" ");
  console.log(nameArray);
  if (username === "") return;
  if (nameArray.length < 2) {
    return nameArray[0].substring(0, 2).toUpperCase();
  } else {
    return nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase();
  }
};
