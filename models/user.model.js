const mongoose = require("mongoose");
const Joi = require("joi");

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
      default: "manager",
    },
    email: {
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    position: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    tasks: Joi.array().items(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
