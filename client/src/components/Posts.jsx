import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POSTS } from "../graphql/queries";
import { LIKE_POST } from "../graphql/mutations";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaSpinner,
  FaEllipsisV,
  FaUser,
  FaEdit,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaRocket,
  FaUsers,
  FaTag,
  FaShareAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PostOptionsMenu = ({ postId, authorId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "cache-and-network",
  });


  const [likePost] = useMutation(LIKE_POST, {
    update(cache, { data }) {
      const currentUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      try {
        const { posts } = cache.readQuery({ query: GET_POSTS });

        const updatedPosts = posts.map((post) => {
          // Check if the post matches the like/unlike operation
          if (data && data.likePost && post.id === data.likePost.post.id) {
            // If data is null, it means the post was unliked
            if (!data.likePost) {
              return {
                ...post,
                likes: post.likes.filter(
                  (like) => like.author.id !== currentUser.id
                ),
              };
            }

            // If it's a new like
            return {
              ...post,
              likes: [
                ...post.likes,
                {
                  id: data.likePost.id,
                  author: data.likePost.author,
                },
              ],
            };
          }
          return post;
        });

        cache.writeQuery({
          query: GET_POSTS,
          data: { posts: updatedPosts },
        });
      } catch (error) {
        console.error("Cache update error:", error);
      }
    },
    onError: (error) => {
      console.error("Like mutation error:", error);
      toast.error(`Error toggling like: ${error.message}`);
    },
  });

  const handleLikeToggle = async (postId) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      toast.error("Please login to like/unlike this post!");
      navigate("/login");
      return;
    }

    let currentUser;
    try {
      currentUser = JSON.parse(storedUser);
    } catch (parseError) {
      toast.error("Error parsing user information. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      await likePost({
        variables: { postId },
        optimisticResponse: {
          likePost: {
            __typename: "Like",
            id: `toggle-like-${postId}`,
            author: {
              __typename: "User",
              id: currentUser.id,
              username: currentUser.username,
            },
            post: {
              __typename: "Post",
              id: postId,
            },
          },
        },
        update: (cache, { data }) => {
          try {
            const existingPosts = cache.readQuery({ query: GET_POSTS });

            if (existingPosts && existingPosts.posts) {
              const updatedPosts = existingPosts.posts.map((post) => {
                if (post.id === postId) {
                  const isCurrentUserLike = post.likes.some(
                    (like) => like.author.id === currentUser.id
                  );

                  if (isCurrentUserLike) {
                    // Remove the like
                    return {
                      ...post,
                      likes: post.likes.filter(
                        (like) => like.author.id !== currentUser.id
                      ),
                    };
                  } else {
                    // Add the like
                    return {
                      ...post,
                      likes: [
                        ...post.likes,
                        {
                          __typename: "Like",
                          id: `new-like-${postId}-${currentUser.id}`,
                          author: {
                            __typename: "User",
                            id: currentUser.id,
                            username: currentUser.username,
                          },
                        },
                      ],
                    };
                  }
                }
                return post;
              });

              cache.writeQuery({
                query: GET_POSTS,
                data: { posts: updatedPosts },
              });
            }
          } catch (error) {
            console.error("Cache update error:", error);
          }
        },
      });
    } catch (error) {
      console.error("Like toggle error:", error);
      toast.error(`Failed to toggle like: ${error.message}`);
    }
  };

  const isPostLiked = (postId) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || !data?.posts) return false;

    let currentUser;
    try {
      currentUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user", error);
      return false;
    }

    const post = data.posts.find((p) => p.id === postId);
    if (!post || !post.likes) return false;

    return post.likes.some(
      (like) => like && like.author && like.author.id === currentUser.id
    );
  };

  // State for search and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Filter and sort posts
  const filteredPosts = data?.posts
    ? data.posts
        .filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "date") {
            return b.createdAt - a.createdAt;
          } else if (sortBy === "likes") {
            return b.likes.length - a.likes.length;
          } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
          }
          return 0;
        })
    : [];

  // Get current time and greet user
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Morning";
    if (currentHour < 18) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      {/* Welcome Section with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100 flex flex-col md:flex-row items-center"
      >
        <div className="flex-grow">
          <h1 className="text-2xl  font-medium font-sans text-gray-800 mb-2">
            {getGreeting()}, Welcome to <span>Burrr</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-green-500 inline-block"
  >
    <path d="M12.428 2.928a7.5 7.5 0 0 1 9.143 9.143 3 3 0 0 1-2.028 2.029l-3.57.714-2.214 2.214c.174.59.24 1.08.204 1.43-.064.616-.339 1.31-.906 1.877-.828.828-2.202.856-3.016.042-.813-.814-.785-2.188.042-3.016.567-.567 1.261-.842 1.877-.906.35-.036.84.03 1.43.204l2.214-2.214.714-3.57A3 3 0 0 1 19.5 9.357a7.5 7.5 0 0 1-9.143-9.143a2 2 0 0 1 2.071 2.071ZM15.072 15.072a1 1 0 0 1-1.414 0L3.515 4.93a1 1 0 1 1 1.414-1.414L15.072 13.657a1 1 0 0 1 0 1.414Z" />
  </svg>
          </h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaRocket className="text-indigo-600" />
            <FaUsers className="text-green-600" />
            <FaShareAlt className="text-blue-600" />
            <p className="text-lg italic tracking-wide">
              Explore, share, and connect with the community.
            </p>
          </div>
        </div>
        <Link 
  to="/create-post" 
  className="ml-4 bg-indigo-600 text-white px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2"
>
  <FaEdit />
  <span>Create Post</span>
</Link>

      </motion.div>

      {/* Search and Sort Section with Improved Alignment */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
      >
        <div className="flex w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-r-0 border-gray-300 rounded-l-lg rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition-all duration-300 flex items-center">
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort" className="text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Date</option>
            <option value="likes">Likes</option>
            <option value="title">Title</option>
          </select>
          {sortBy === "date" && (
            <FaSortAmountDown className="text-indigo-600" />
          )}
          {sortBy === "likes" && <FaSortAmountUp className="text-indigo-600" />}
        </div>
      </motion.div>

      {/* Posts Section */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="h-10 w-10 text-indigo-600 animate-spin" />
          </motion.span>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500 text-xl">
            Failed to load posts. {error.message}
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No posts found. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6 flex-grow">
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
                  <PostOptionsMenu postId={post.id} authorId={post.author.id} />
                </div>

                <Link to={`/post/${post.id}`} className="block">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                </Link>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-end justify-end space-x-2 p-1">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <Link
                      to={`/post/${post.id}`}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                      +{post.tags.length - 2}
                    </Link>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center p-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikeToggle(post.id)}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                  >
                    {isPostLiked(post.id) ? (
                      <FaHeart size={24} />
                    ) : (
                      <FaRegHeart size={24} />
                    )}
                    <span className="text-sm">{post.likes.length}</span>
                  </button>
                  <Link
                    to={`/post/${post.id}`}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
                  >
                    <FaComment size={24} />
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;