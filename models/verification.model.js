const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    requered: true,
    default: Date.now(),
    expires: 43200,
  },
});

const Token = new mongoose.model("Token", TokenSchema);

module.exports = Token;
