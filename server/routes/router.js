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
  chatWallpaper,
  clearWallpaper,
  // sendNotification,
} = require("../controllers/chatControllers.js");

const {
  sendMessage,
  allMessages,
  emptyMessages,
} = require("../controllers/messageControllers.js");

const AuthObj = require("../middlewares/auth");

/** POST Methods */

router.route("/user/:id/verify/:token").get(controller.verifyUserAccount); // user Account verification
router.route("/register").post(controller.register); // register user
router.route("/login").post(controller.login); // login in app
router.route("/resendMail").post(controller.resendVerificationEmail); // Resend mail for veritfication

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
// router.route("/send_notification").post(AuthObj.Auth, sendNotification);
router.route("/chat").get(AuthObj.Auth, fetchChats);
router.route("/chat/group").post(AuthObj.Auth, createGroupChat);
router.route("/chat/rename").put(AuthObj.Auth, renameGroup);
router.route("/chat/wallpaper").put(AuthObj.Auth, chatWallpaper);
router.route("/chat/clearWallpaper").put(AuthObj.Auth, clearWallpaper);
router.route("/group/removeUser").put(AuthObj.Auth, removeFromGroup);
router.route("/group/addUser").put(AuthObj.Auth, addToGroup);
// router.route("/group/leave").put(AuthObj.Auth, leaveGroup);

router.route("/message/:chatId").get(AuthObj.Auth, allMessages);
router.route("/message").post(AuthObj.Auth, sendMessage);
router.route("/emptyChat/:chatId").get(AuthObj.Auth, emptyMessages);

module.exports = router;
