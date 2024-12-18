const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const auth = require("../utils/auth");
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const mongoose = require("mongoose");

const Mutation = {
  createUser: async (_, { username, email, password }) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
      await user.save();

      // Generate token
      const token = auth.generateToken(user.id);

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  },
  login: async (_, { username, password }) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    // Generate token
    const token = auth.generateToken(user.id);

    // Return AuthPayload
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  },
  createPost: async (_, { title, content, tags }, { user }) => {
    if (!user) throw new Error("Authentication required");

    // Create the post with the authenticated user as the author
    const post = new Post({
      title,
      content,
      tags,
      author: user.userId, // Ensure this is set correctly
    });

    await post.save();

    // Populate the author field before returning the post
    await post.populate("author");

    return post;
  },
  createComment: async (_, { postId, content }, { user }) => {
    if (!user) throw new Error("Authentication required");
  
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
  
    // Create the comment with the authenticated user as the author
    const comment = new Comment({
      post: postId,
      content,
      author: user.userId, // Ensure this is set correctly
    });
  
    await comment.save();
  
    // Add the comment's ID to the post's comments array
    post.comments.push(comment._id);
    await post.save();
  
    // Populate the author field before returning the comment
    await comment.populate("author");
  
    // Populate the post field before returning the comment
    await comment.populate("post");
  
    return comment;
  },
  likePost: async (_, { postId }, { user }) => {
    if (!user) throw new AuthenticationError("Authentication required");

    // Ensure postId is converted to a valid ObjectId
    const validPostId = new mongoose.Types.ObjectId(postId);

    const post = await Post.findById(validPostId).populate({
      path: "likes",
      populate: { path: "author" },
    });
    if (!post) throw new UserInputError("Post not found");

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({
      post: validPostId,
      author: user.userId,
    }).populate("author");

    if (existingLike) {
      // Unlike the post
      await Like.deleteOne({ _id: existingLike._id });

      post.likes = post.likes.filter(
        (like) => like.author._id.toString() !== user.userId
      );
      await post.save();

      return null; // Indicate unlike
    }

    // Create a new like
    const newLike = new Like({
      post: validPostId,
      author: user.userId,
    });
    await newLike.save();

    // Add the like to the post's likes array
    post.likes.push(newLike);
    await post.save();

    // Fully populate the new like
    await newLike.populate("author");

    // Ensure all IDs are converted to strings
    return {
      id: newLike._id.toString(),
      post: {
        id: post._id.toString(),
      },
      author: {
        id: newLike.author._id.toString(),
        username: newLike.author.username,
      },
    };
  },
};

module.exports = Mutation;
