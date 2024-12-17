import React, { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { GET_POSTS } from "../graphql/queries";
import { LIKE_POST, UNLIKE_POST } from "../graphql/mutations";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaSpinner, 
  FaEllipsisV,
  FaUser 
} from "react-icons/fa";
import { toast } from "react-toastify";

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const PostOptionsMenu = ({ postId, authorId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700"
      >
        <FaEllipsisV />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
          {currentUser && currentUser.id === authorId && (
            <>
              <Link 
                to={`/edit-post/${postId}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Post
              </Link>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  // Implement delete post logic
                  setIsOpen(false);
                }}
              >
                Delete Post
              </button>
            </>
          )}
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // Implement report post logic
              setIsOpen(false);
            }}
          >
            Report Post
          </button>
        </div>
      )}
    </div>
  );
};

const Posts = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: () => refetch(), // Refetch posts after a like
  });
  const [unlikePost] = useMutation(UNLIKE_POST, {
    onCompleted: () => refetch(), // Refetch posts after an unlike
  });

  const [likedPosts, setLikedPosts] = useState({});

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to like this post!");
      navigate("/login");
      return;
    }

    try {
      await likePost({ variables: { postId } });
      setLikedPosts(prev => ({ ...prev, [postId]: true }));
      // toast.success("Post liked!");
    } catch (error) {
      toast.error("Error liking post: " + error.message);
    }
  };

  const handleUnlike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to unlike this post!");
      navigate("/login");
      return;
    }

    try {
      await unlikePost({ variables: { postId } });
      setLikedPosts(prev => ({ ...prev, [postId]: false }));
      // toast.success("Post unliked!");
    } catch (error) {
      toast.error("Error unliking post: " + error.message);
    }
  };

  const isPostLiked = (postId) => {
    return likedPosts[postId] || false;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <FaSpinner className="h-10 w-10 text-indigo-600 animate-spin" />
      </motion.span>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-red-500 text-xl">
        Failed to load posts. {error.message}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Community Posts
        </h1>
        <Link
          to="/create-post"
          className="w-full md:w-auto text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
        >
          Create New Post
        </Link>
      </div>

      {data.posts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No posts found. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {data.posts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full p-2">
                      <FaUser className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {post.author.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <PostOptionsMenu 
                    postId={post.id} 
                    authorId={post.author.id} 
                  />
                </div>

                <Link to={`/post/${post.id}`} className="block">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                </Link>

                <div className="flex justify-between items-center  mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => isPostLiked(post.id) ? handleUnlike(post.id) : handleLike(post.id)}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                    >
                      {isPostLiked(post.id) ? <FaHeart /> : <FaRegHeart />}
                      <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <Link
                      to={`/post/${post.id}`}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
                    >
                      <FaComment />
                      <span className="text-sm">{post.comments.length}</span>
                    </Link>
                  </div>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;