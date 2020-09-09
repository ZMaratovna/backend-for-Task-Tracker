const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLengh: 3,
    },
    position: {
      type: String,
    },
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLengh: 3,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLengh: 8,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
