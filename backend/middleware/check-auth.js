const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, "secret_key_should_be_longer");
    req.userData = { email: tokenData.email, userId: tokenData.userId };
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth failed!"
    });
  }
};
