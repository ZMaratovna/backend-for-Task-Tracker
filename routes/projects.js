const router = require("express").Router();
const Project = require("../models/project.model");
const { User } = require("../models/user.model");

router.route("/:projectId").get((req, res) => {
  Project.find({ _id: req.params.projectId })
    .then((project) => res.send(project))
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
    .then(() => res.send("project added!"))
    .catch((err) => res.status(400).send("Error: " + err));
});

/// manager create project /   has refs  to project in user model
router.route("/add/:id").post(async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      content: req.body.content,
      manager: req.params.id, // ref to User
      developers: [], // ref to User
      tasks: [], //ref to Task
    });
    await newProject.save();
    res.status(201).send(newProject);
    await User.updateOne(
      { _id: req.params.id },
      {
        $push: {
          projects: newProject,
        },
      }
    );
  } catch (e) {
    res.send("Error:" + e);
  }
});

/// Manager assign project to developer (devId)
router.route("/assign").post(async (req, res) => {
  try {
    console.log(req.body.project);
    await Project.updateOne(
      { _id: req.body.project },
      {
        $push: { developers: req.body.developer },
      },
      { unique: true, dropDups: true }
    );

    await User.updateOne(
      { _id: req.body.developer },
      {
        $push: { projects: req.body.project },
      }
    );
    res.send({ executor: req.body.developer, project: req.body.project });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
