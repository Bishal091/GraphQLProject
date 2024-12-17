const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Like" }], // Reference the Like model
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Reference the Comment model
});

module.exports = mongoose.model("User", userSchema);