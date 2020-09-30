const router = require("express").Router();
const Task = require("../models/task.model");
const { User } = require("../models/user.model");
const Project = require("../models/project.model");
const auth = require("../middleware/auth");

/// Get list of all tasks
router.route("/").get((req, res) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: ") + err);
});

// Get task from project
router.route("/project/:projectId").get(async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.send(tasks);
});

//Get tasks assigned to developer
router.route("/:userId").get((req, res) => {
  Task.find({ executor: req.params.userId })
    .then((tasks) => res.send(tasks))
    .catch((err) => res.status(400).json("Error: ") + err);
});

///get task by task_Id
router.route("/:id").get((req, res) => {
  Task.findById(req.params.id)
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json("Error: ") + err);
});

///get comments from task
router.route("/comments/:id").get((req, res) => {
  Task.findById(req.params.id)
    .then((task) => res.json(task.comments))
    .catch((err) => res.status(400).json("Error: ") + err);
});

///  Initial task addition
router.route("/add/:projectId").post(async (req, res) => {
  const newTask = new Task({
    content: req.body.content,
    comments: [],
    status: "waiting",
    project: req.params.projectId,
  });
  await newTask.save();
  await Project.updateOne(
    { _id: req.params.projectId },
    {
      $push: { tasks: newTask._id },
    }
  );
  await User.updateOne(
    { _id: req.body.manager },
    {
      $push: { tasks: req.params.taskId },
    }
  );

  res.send(newTask);
});

/// Assign task to developer and push taskId to developer and manager tasks array
router.route("/assign/:taskId").post(async (req, res) => {
  console.log(req.body);
  await User.updateOne(
    { _id: req.body.devId },
    {
      $push: { tasks: req.params.taskId },
    }
  );

  await Task.updateOne(
    { _id: req.params.taskId },
    {
      $set: { executor: req.body.devId },
    }
  );
  res.send({
    executor: req.body.devId,
  });
});

/// Change task status
router.route("/status/:taskId").post(async (req, res) => {
  console.log(req.body);
  await Task.updateOne(
    { _id: req.params.taskId },
    {
      $set: { status: req.body.status },
    }
  );

  res.send({ id: req.params.taskId, status: req.body.status });
});

/// Delete task
router.route("/:taskId").delete((req, res) => {
  Task.findByIdAndDelete(req.params.taskId)
    .then((task) => res.send(task))
    .catch((err) => res.status(400).json("Error: " + err));
});

///Edit task content
router.route("/update/:id").post((req, res) => {
  console.log(req.body);
  Task.findById(req.params.id).then((task) => {
    task.content = req.body.content;
    task
      .save()
      .then(() => res.send(task))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
