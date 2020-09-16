const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return console.log("Validation error: " + error);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Incorrect email or password");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Incorrect email or password");
  }

  const token = user.generateAuthToken();
  console.log(token);
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
