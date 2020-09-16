const router = require("express").Router();
const Comment = require("../models/comment.model");
const auth = require("../middleware/auth");
router.route("/").get((req, res) => {
  Comment.find()
    .then((comments) => res.json(comments))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const content = req.body.content;
  const comments = req.body.comments;
  const task = req.body.task;
  const author = req.body.author;

  const newComment = new Comment({
    content,
    comments,
    task,
    author,
  });

  newComment
    .save()
    .then(() => res.json("new comment added!"))
    .catch((err) => res.json("Error: " + err));
});
router.route("/:id").delete((req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then(() => res.json("comment was deleted!"))
    .catch((err) => res.json("Error: " + err));
});
router.route("/update/:id").post((req, res) => {
  Comment.findById(req.params.id).then((comment) => {
    comment.content = req.body.content;

    comment
      .save()
      .then(() => res.json("comment was updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
