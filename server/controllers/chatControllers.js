const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // console.log(req.user.userId);

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // You use populate to replace the ObjectIDs in the "chats" sheet with actual user and message details.

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username profilePic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username profilePic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  console.log(typeof req.body.users);
  //   var users = JSON.parse(req.body.users);
  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user.userId);
  // console.log("users", users);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      groupDesc: req.body.description,
      isGroupChat: true,
      groupAdmin: req.user.userId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  console.log("I AM HERE");
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const chatWallpaper = asyncHandler(async (req, res) => {
  const { chatId, wallpaper } = req.body;
  console.log("CHECK ", req.user.userId);
  console.log(wallpaper);

  const validUser = await Chat.find({
    chatId,
    users: { $elemMatch: { $eq: req.user.userId } },
  });
  if (!validUser) {
    res.status(400).send({ message: "Not a Authorized user." });
  }

  // check if the requester is admin

  const addWallpaper = await Chat.findByIdAndUpdate(
    chatId,
    {
      wallpaper,
    },
    {
      new: true,
    }
  ).populate("users", "-password");

  if (!addWallpaper) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(addWallpaper);
  }
});

const clearWallpaper = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  const validUser = await Chat.find({
    chatId,
    users: { $elemMatch: { $eq: req.user.userId } },
  });
  if (!validUser) {
    res.status(400).json({ message: "Not a Authorized user." });
  }

  const defaultWallpaper = await Chat.findByIdAndUpdate(
    chatId,
    {
      wallpaper: "",
    },
    {
      new: true,
    }
  ).populate("users", "-password");

  if (!defaultWallpaper) {
    res.status(404).send({ message: "Not found" });
    throw new Error("Chat Not Found");
  } else {
    res.json(defaultWallpaper);
  }
});

// const sendNotification = asyncHandler(async (req, res) => {
//   try {
//     const { receiverId, updatedAt, chatId } = req.body;

//     let user = await User.findOne({ _id: receiverId });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if a notification with the given chatId already exists
//     const existingNotification = user.notifications.find(
//       (notification) => notification.chatId === chatId
//     );

//     if (existingNotification) {
//       existingNotification.count += 1;
//       existingNotification.updatedAt = updatedAt;
//     } else {
//       user.notifications.push({
//         username: req.user.username,
//         count: 1,
//         chatId,
//         updatedAt: updatedAt,
//       });
//     }
//     user.notifications.sort((a, b) => b.updatedAt - a.updatedAt);
//     await user.save();
//     res.status(200).json({ message: "Notifications send" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  chatWallpaper,
  clearWallpaper,
  // sendNotification,
};
