const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { User, generateAuthToken } = require("../models/user.model");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Incorrect email or password");
  }
  if (!user.isActive) {
    return res.send("Please confirm your email address before");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Incorrect email or password");
  }

  const token = user.generateAuthToken();
  res.header("x-auth-token", token);
  //res.send(_.pick(user, ["_id", "username", "email", "position"]));
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
