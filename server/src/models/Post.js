const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }], // Reference the Like model
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Reference the Comment model
});

module.exports = mongoose.model("Post", postSchema);