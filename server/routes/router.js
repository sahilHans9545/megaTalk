const { Router } = require("express");
const router = Router();
const controller = require("../controllers/appControllers");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers.js");

const {
  sendMessage,
  allMessages,
  emptyMessages,
} = require("../controllers/messageControllers.js");

const AuthObj = require("../middlewares/auth");

/** POST Methods */

router.route("/user/:id/verify/:token").get(controller.verifyUserAccount); // register user
router.route("/register").post(controller.register); // register user
router.route("/login").post(controller.login); // login in app

/*GET Methods */
router.route("/getuser/:username").get(controller.getUser); // user with username
router
  .route("/generateOTP")
  .get(controller.verifyUser, AuthObj.localVariables, controller.generateOtp); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOtp); // verify generated OTP
router.route("/createResetSession").get(controller.resetSession); // reset all the variables

/** PUT Methods */

router.route("/updateuser").put(AuthObj.Auth, controller.updateUser); // is use to update the user profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // use to reset password

router.route("/user").get(AuthObj.Auth, controller.allUsers);
router.route("/chat").post(AuthObj.Auth, accessChat);
router.route("/chat").get(AuthObj.Auth, fetchChats);
router.route("/chat/group").post(AuthObj.Auth, createGroupChat);
router.route("/chat/rename").put(AuthObj.Auth, renameGroup);
router.route("/group/removeUser").put(AuthObj.Auth, removeFromGroup);
router.route("/group/addUser").put(AuthObj.Auth, addToGroup);

router.route("/message/:chatId").get(AuthObj.Auth, allMessages);
router.route("/message").post(AuthObj.Auth, sendMessage);
router.route("/emptyChat/:chatId").get(AuthObj.Auth, emptyMessages);

module.exports = router;
