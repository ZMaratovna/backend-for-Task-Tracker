const router = require("express").Router();
const Comment = require("../models/comment.model");
const Task = require("../models/task.model");

/// Get all comments

router.route("/").get((req, res) => {
  Comment.find()
    .then((comments) => res.json(comments))
    .catch((err) => res.status(400).json("Error: " + err));
});
/// Add new comment to task
router.route("/add/:taskId").post(async (req, res) => {
  //Add comment  to comments collection and Update task (push comment id in array of comments)
  try {
    const newComment = new Comment({
      content: req.body.content,
      task: req.params.taskId,
      author: req.body.user,
    });
    await newComment.save();

    await Task.updateOne(
      { _id: req.params.taskId },
      {
        $push: { comments: newComment._id },
      }
    );
    return res.send(newComment);
  } catch (e) {
    return res.send("Error: " + e);
  }
});

/// Delete comment
router.route("/:id").delete(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.send("comment was deleted");
});

/// Edit comment by user
router.route("/update/:id").post(async (req, res) => {
  await Comment.updateOne(
    { _id: req.params.id },
    {
      $set: {
        content: req.body.content,
      },
    }
  );
  res.send("comment was updated");
});

module.exports = router;
