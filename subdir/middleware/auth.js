const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).end("Access denied!");
  }
  try {
    const decoded = jwt.verify(token, config.get("PrivateKey"));
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("Invalid JWT");
  }
};
