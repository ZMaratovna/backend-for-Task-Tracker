const router = require("express").Router();
const Task = require("../models/task.model");

router.route("/").get((req, res) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: ") + err);
});
router.route("/:id").get((req, res) => {
  Task.findById(req.params.id)
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json("Error: ") + err);
});

router.route("/add").post((req, res) => {
  const content = req.body.content;
  const comments = req.body.comments;
  const status = req.body.status;
  const executor = req.body.developer;
  const project = req.body.project;

  const newTask = new Task({
    content,
    comments,
    status,
    executor,
    project,
  });

  newTask
    .save()
    .then(() => res.json("task added!"))
    .catch((err) => res.status(400).json("Error :" + err));
});

router.route("/:id").delete((req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.json("task daleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Task.findById(req.params.id).then((task) => {
    task.content = req.body.content;
    task.comments = req.body.comments;
    task.status = req.body.status;
    task.executor = req.body.developer;
    task.project = req.body.project;

    task
      .save()
      .then(() => res.json("Tasl updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
