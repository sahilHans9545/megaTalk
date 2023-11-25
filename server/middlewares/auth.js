const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    req.user = decodedToken;
    // res.json(decodedToken);
    console.log(decodedToken);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Authentication Failed!" });
  }
};

function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

module.exports = { Auth, localVariables };
