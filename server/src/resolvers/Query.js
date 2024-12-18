const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

const Query = {
  posts: async (_, { cursor, limit = 10 }) => {
    const query = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};
    return await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author") // Populate the post's author
      .populate({
        path: "likes", // Populate the likes field
        populate: {
          path: "author", // Populate the author field within each like
        },
      })
      .populate("comments"); // Populate the comments field
  },
  post: async (_, { id }) => {
    return await Post.findById(id)
      .populate("author") // Populate the post's author
      .populate({
        path: "likes",
        populate: {
          path: "author", // Populate the author of each like
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "author", // Populate the author of each comment
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