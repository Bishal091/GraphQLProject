const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString(); // Explicitly convert to string
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

module.exports = mongoose.model("Like", likeSchema);