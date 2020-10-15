const router = require("express").Router();
let { User } = require("../models/user.model");
let Project = require("../models/project.model");
const auth = require("../middleware/auth");

///return Users arrays (all, developers and managers)
// router.get("/", auth, (req, res) => {
//   User.find().then((users) => {
//     const devs = users.filter((user) => user.position === "developer");
//     const mng = users.filter((user) => user.position === "manager");
//     res
//       .send({ all: users, devs, mng })
//       .catch((err) => res.status(400).json("Error: " + err));
//   });
// });

//retun user object
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get array of developers
router.route("/").get((req, res) => {
  User.find({ position: "developer" })
    .then((devs) => res.send(devs))
    .catch((err) => res.status(400).json("Error: " + err));
});

///return array of user projects
router.route("/projects/:id").get(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user.position === "manager") {
    const projects = await Project.find({ manager: req.params.id });
    return res.send(projects);
  } else {
    await User.findById(req.params.id)
      .populate("projects")
      .exec((err, developer) => res.send(developer.projects));
    // if (developer.projects.length > 0) {
    //   const projects = await developer.projects.map(async (objId) => {
    //     const user = await Project.findOne({ _id: objId })
    //       .populate("developers")
    //       .exec(((err, project) => console.log(project.developers[0])));
    //     console.log(user);
    //   });
    //   console.log("projects map", projects);
    //   res.send(projects);
    // } else res.send([]);
  }
});

//get array of user tasks
router.route("/tasks/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user.tasks))
    .catch((err) => res.status(400).json("Error:" + err));
});

module.exports = router;
