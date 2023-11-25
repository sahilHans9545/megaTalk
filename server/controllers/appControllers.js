const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/sendMail");
// console.log(User);

const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await User.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: "Authentication Error" });
  }
};

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          private
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user.userId },
  });
  res.send(users);
});

const verifyUserAccount = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, "uiyiurwytjuhiu");

    // Check if the user ID from the token matches the request
    if (decodedToken.userId !== id) {
      console.log(decodedToken.userId);
      console.log(id);
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already verified
    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Mark the user as verified
    user.verified = true;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, profilePic } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // console.log("existingUser here", existingUser);
      res.status(400).json({ message: "User already Exist", status: "no" });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        profilePic,
      });

      const token = jwt.sign(
        {
          userId: newUser._id,
          username: newUser.username,
        },
        "uiyiurwytjuhiu",
        { expiresIn: "1h" }
      );

      const url = `http://localhost:5173/user/${newUser._id}/verify/${token}`;
      await sendMail(newUser.email, "Verify Email", url);

      // console.log(newUser);
      const { password, ...rest } = newUser.toJSON();

      res
        .status(200)
        .send({ message: "An Email sent to your account please verify" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     User.findOne({ username })
//       .then((user) => {
//         // if(!user.verified){
//         //    res.status
//         // }
//         bcrypt
//           .compare(password, user.password)
//           .then((passwordCheck) => {
//             if (!passwordCheck)
//               return res
//                 .status(400)
//                 .send({ error: "Password doesn't Matched...!" });
//             const token = jwt.sign(
//               {
//                 userId: user._id,
//                 username: user.username,
//               },
//               "uiyiurwytjuhiu",
//               { expiresIn: "24h" }
//             );

//             return res.status(200).json({
//               msg: "Login Successful...",
//               username: user.username,
//               token: token,
//             });
//           })
//           .catch((err) => {
//             return res
//               .status(400)
//               .send({ error: "Password doesn't Matched...!" });
//           });
//       })
//       .catch((err) => {
//         return res.status(404).send({ error: "Username not found." });
//       });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// };

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Username not found." });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "Password doesn't Matched...!" });
    }

    if (!user.verified) {
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        "uiyiurwytjuhiu",
        { expiresIn: "24h" }
      );

      const url = `http://localhost:5000/api/user/${user._id}/verify/${token}`;
      await sendMail(user.email, "Verify Email", url);

      return res.status(401).json({
        message: "User not verified. Another verification email has been sent.",
      });
    }

    // User is already verified, proceed with login
    const authToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      "uiyiurwytjuhiu",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      msg: "Login Successful...",
      username: user.username,
      token: authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(501).send({ error: "Couldn't find the user..." });

    const { password, ...rest } = user.toJSON();

    return res.status(201).send(rest);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: "Cannot Find user Data" });
  }
};

const updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const { userId } = req.user;
    // console.log(id);
    if (userId) {
      const body = req.body;
      const update = await User.updateOne({ _id: userId }, body);
      // if (update) return res.status(201).send({ user: update });
      if (update) {
        // If the update was successful, fetch the updated user
        const updatedUser = await User.findById(userId);
        const { password, ...rest } = updatedUser.toJSON();
        return res.status(201).send(rest);
      } else {
        // Handle the case where the update was not successful
        return res.status(500).send({ error: "Failed to update user." });
      }
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

const generateOtp = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

const verifyOtp = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

const resetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Access granted" });
    // return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
};

// update the password when we have valid session

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).send({ error: "Username not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updateResult = await User.updateOne(
        { username: user.username },
        { password: hashedPassword }
      );

      if (updateResult.modifiedCount === 1) {
        req.app.locals.resetSession = false; // Reset session
        return res.status(201).send({ msg: "Record Updated...!" });
      } else {
        console.log(updateResult);
        return res.status(500).send({ error: "Failed to update password" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

module.exports = {
  verifyUserAccount,
  register,
  login,
  generateOtp,
  verifyOtp,
  resetSession,
  resetPassword,
  updateUser,
  getUser,
  verifyUser,
  allUsers,
};
