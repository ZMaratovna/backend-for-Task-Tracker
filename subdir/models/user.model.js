const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");

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
    isActive: {
      type: Boolean,
      default: false,
    },
    activeToken: {
      type: String,
    },
    activeExpires: {
      type: Date,
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

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ _id: this._id }, config.get("PrivateKey"), {
//     expiresIn: 3600,
//   });
//   return token;
// };
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      position: this.position,
    },
    "Secret",
    {
      expiresIn: 3600,
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    position: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    tasks: Joi.array().items(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
