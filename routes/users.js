const router = require("express").Router();
let User = require("../models/user.model");
const auth = require("../middleware/auth");

///return Users arrays (all, developers and managers)
router.get("/", auth, (req, res) => {
  User.find().then((users) => {
    const devs = users.filter((user) => user.position === "developer");
    const mng = users.filter((user) => user.position === "Manager");
    res
      .json({ all: users, devs, mng })
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

//retun user object
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get array of developers
router.route("/").get((req, res) => {
  User.find()
    .then((users) => {
      console.log(users.filter((user) => user.position === "developer"));
      res.json(users);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

///return array of user projects
router.route("/projects/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user.projects))
    .catch((err) => res.status(400).json("Error:" + err));
});

//get array of user tasks
router.route("/tasks/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user.tasks))
    .catch((err) => res.status(400).json("Error:" + err));
});

module.exports = router;
