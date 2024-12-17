const Post = require("../models/Post");
const Like = require("../models/Like");

const Query = {
  posts: async (_, { cursor, limit = 10 }) => {
    const query = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};
    return await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author")
      .populate("likes") // Populate likes
      .populate("comments"); // Populate comments
  },
  post: async (_, { id }) => {
    return await Post.findById(id)
      .populate("author")
      .populate("comments") // Populate comments
      .populate({
        path: "comments",
        populate: {
          path: "author", // Populate the author field inside comments
        },
      });
  },
  comments: async (_, { postId }) => {
    return await Comment.find({ post: postId }).populate("author");
  },
  likes: async (_, { postId }) => {
    return await Like.find({ post: postId }).populate("author");
  },
};

module.exports = Query;