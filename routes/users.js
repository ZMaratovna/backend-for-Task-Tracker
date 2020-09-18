const router = require("express").Router();
let { User } = require("../models/user.model");
let Project = require("../models/project.model");
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

///return array of manager projects
router.route("/projects/:id").get(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user.position === "manager") {
    const projects = await Project.find({ manager: req.params.id });
    return res.send(projects.map((p) => p.manager.name));
  } else {
    const developer = await User.findById(req.params.id);
    console.log("developer projects", developer.projects);
    if (developer.projects.length > 0) {
      developer.projects.forEach((objId) =>
        Project.findOne({ _id: objId }).then((obj) => res.send(obj.name))
      );
    } else res.send([]);
  }
});

//get array of user tasks
router.route("/tasks/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user.tasks))
    .catch((err) => res.status(400).json("Error:" + err));
});

module.exports = router;
