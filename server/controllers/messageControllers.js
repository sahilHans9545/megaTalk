const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic email",
    });
    // message = await message.populate("chat.users", "username profilePic email");   //Both working similar
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Empty Chat
//@route           GET /api/emptyChat/:chatId
//@access          Protected
const emptyMessages = asyncHandler(async (req, res) => {
  try {
    const result = await Message.deleteMany({ chat: req.params.chatId });
    if (result.deletedCount > 0) {
      return res.status(200).json({ msg: "Chat deleted.", result: result });
    } else {
      return res
        .status(404)
        .json({ msg: "No messages found for the specified chat id." });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage, emptyMessages };
