const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const { User, validate } = require("../models/user.model");
const router = require("express").Router();
require("dotenv").config();
router.route("/").post(async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(200).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("That user already exisits!");
    } else {
      //// Add new user
      user = new User({
        username: req.body.username,
        position: req.body.position,
        email: req.body.email,
        password: req.body.password,
        activeToken: crypto.randomBytes(16).toString("hex"),
        activeExpires: Date.now() + 24 * 3600 * 1000,
      });
      /// encrypt the user password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      res.status(201).send({
        username: user.username,
        position: user.position,
        email: user.email,
        id: user._id,
      });

      //Send mail to user
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        from: "KaymedenovaZ@yandex.ru",
        // to: user.email,
        to: "zh.kaymedenova@gmail.com",
        subject: "Account Verification Token",
        text:
          "Hello, \n\n" +
          "Please, verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/confirmation/" +
          user.activeToken,
      };
      sgMail.send(msg);
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
