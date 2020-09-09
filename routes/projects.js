const router = require("express").Router();
const Project = require("../models/project.model");

router.route("/").get((req, res) => {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((err) => res.status(400).json("Error: " + err));

  // Get the user name through project

  // Project.findOne({ name: "Task-tracker" })
  //   .populate("manager")
  //   .exec((err, project) => {
  //     if (err) {
  //       console.log("error:" + err);
  //     }
  //     console.log("The project manager is %s", project.manager.username);
  //   });
});

/// get array of  project tasks
router.route("/tasks/:id").get((req, res) => {
  Project.findById(req.params.id)
    .then((project) => res.json(project.tasks))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const content = req.body.content;
  const manager = req.body.manager;
  const developers = req.body.developers;
  const tasks = req.body.tasks;

  const newProject = new Project({
    name,
    content,
    manager,
    developers,
    tasks,
  });

  newProject
    .save()
    .then(() => res.json("project added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
