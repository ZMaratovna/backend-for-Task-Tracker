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
///get task by task_Id
router.route("/:id").get((req, res) => {
  Task.findById(req.params.id)
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json("Error: ") + err);
});

///get comments from task
router.route("/project/:id").get((req, res) => {
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
    executor: "",
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
  await User.updateOne(
    { _id: req.body.developer },
    {
      $push: { tasks: req.params.taskId },
    }
  );

  await Task.updateOne(
    { _id: req.params.taskId },
    {
      $set: { executor: req.body.developer },
    }
  );
  res.send("Task was assigned");
});

/// Change task status
router.route("/status/:taskId").post(async (req, res) => {
  await Task.updateOne(
    { _id: req.params.taskId },
    {
      $set: { status: req.body.status },
    }
  );

  res.send(`Status was changed to ${req.body.status}`);
});

/// Delete task
router.route("/:taskId").delete((req, res) => {
  Task.findByIdAndDelete(req.params.taskId)
    .then(() => res.json("task deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

///Edit task content
router.route("/edit/:id").post((req, res) => {
  Task.findById(req.params.id).then((task) => {
    task.content = req.body.content;
    task.executor = req.body.developer;
    task
      .save()
      .then(() => res.json("Task updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
