const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const auth = require("../utils/auth");

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

    // Populate the author field before returning the comment
    await comment.populate("author");

    return comment;
  },
  likePost: async (_, { postId }, { user }) => {
    if (!user) throw new Error("Authentication required");
  
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
  
    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ post: postId, author: user.userId });
    if (existingLike) {
      throw new Error("You have already liked this post");
    }
  
    // Create a new like
    const newLike = new Like({
      post: postId,
      author: user.userId,
    });
    await newLike.save();
  
    // Add the like to the post's likes array
    post.likes.push(newLike._id);
    await post.save();
  
    // Add the like to the user's likedPosts array
    const currentUser = await User.findById(user.userId);
    currentUser.likedPosts.push(newLike._id);
    await currentUser.save();
  
    return post; // Return the updated post with the new likes array
  },
  unlikePost: async (_, { postId }, { user }) => {
    if (!user) throw new Error("Authentication required");
  
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
  
    // Find the like
    const like = await Like.findOne({ post: postId, author: user.userId });
    if (!like) {
      throw new Error("You have not liked this post");
    }
  
    // Remove the like
    await like.deleteOne();
  
    // Remove the like from the post's likes array
    post.likes = post.likes.filter((id) => id.toString() !== like._id.toString());
    await post.save();
  
    // Remove the like from the user's likedPosts array
    const currentUser = await User.findById(user.userId);
    currentUser.likedPosts = currentUser.likedPosts.filter(
      (id) => id.toString() !== like._id.toString()
    );
    await currentUser.save();
  
    return post; // Return the updated post with the updated likes array
  },

};

module.exports = Mutation;
