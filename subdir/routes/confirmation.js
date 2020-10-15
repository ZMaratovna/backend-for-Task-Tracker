const router = require("express").Router();
const { User } = require("../models/user.model");

router.route("/:activeToken").get(async (req, res, next) => {
  try {
    console.log("req.params", req.params);
    const user = await User.findOne({
      activeToken: req.params.activeToken,
    });
    if (user) {
      user.isActive = true;
      await user.save();
      return res.send(user);
    } else {
      return res.render("message", {
        title: "fail to activate",
        content: "Your activation link is invalid, please register again",
      });
    }
  } catch (e) {
    console.log("Confirmation error: " + e);
  }
});

module.exports = router;
