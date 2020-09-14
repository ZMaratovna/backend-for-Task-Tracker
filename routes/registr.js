const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const { User, validate } = require("../models/user.model");
const Token = require("../models/verification.model");
const router = require("express").Router();
require("dotenv").config();
router.route("/").post(async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      console.log("validation error ", error);
      return res.send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.send("That user already exisits!");
    } else {
      //// Add new user
      user = new User({
        username: req.body.username,
        position: req.body.position,
        email: req.body.email,
        password: req.body.password,
      });
      /// encrypt the user password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log("newUser", user);

      //Create verification token
      const token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();
      console.log("token", token);
      res.send({ user, token });

      //Send mail to user

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        from: "KaymedenovaZ@yandex.ru",
        to: user.email,
        subject: "Account Verification Token",
        text:
          "Hello, \n\n" +
          "Please, verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/confirmaton/" +
          token.token +
          ".\n",
      };
      sgMail.send(msg);
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
