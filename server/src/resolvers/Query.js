const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

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
posts: async (_, { cursor, limit = 10 }) => {
    const query = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};
    return await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author") // Populate the post's author
      .populate({
        path: "likes",
        populate: {
          path: "author", // Populate the author of each like
        },
      })
      .populate("comments"); // Populate comments
  },
  comments: async (_, { postId }) => {
    return await Comment.find({ post: postId }).populate("author");
  },
  likes: async (_, { postId }) => {
    return await Like.find({ post: postId }).populate("author");
  },
};

module.exports = Query;