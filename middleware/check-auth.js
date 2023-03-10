const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    // console.log(req.headers.authorization.split(" ")[1]);
    // console.log(req.header("x-auth-token").split(" "));
    // console.log("token", typeof req.header("x-auth-token"));
    if (!token)
      return res
        .status(401)
        .json({ msg: "No authentication token, access denied" });
    const verified = jwt.verify(token, "MY_secret_Key");
    console.log(verified);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied" });
    req.user = verified.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = auth;
