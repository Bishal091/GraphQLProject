import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTag, FaFileAlt, FaRegListAlt, FaPencilAlt, FaCheck } from "react-icons/fa";


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [createPost, { loading, error }] = useMutation(CREATE_POST);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: {
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
<div className="relative min-h-[90vh] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6 md:p-8 md:py-4">
  <button className="absolute top-4 left-4 flex items-center gap-2 text-black" onClick={() => navigate("/")}>
    <FaArrowLeft
      className="text-indigo-600 cursor-pointer bg-white rounded-full p-1"
      size={36}
    />
    Back
  </button>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-8 md:p-12 lg:p-16 lg:py-10"
      >
        <motion.div 
          variants={itemVariants} 
          className="text-center mb-8"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3"
          >
            <FaRegListAlt className="text-indigo-600" size={36} />
            Create a New Post
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 mt-2"
          >
            Share your thoughts and ideas with the world
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <div>
              <label htmlFor="title" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaFileAlt className="mr-2 text-indigo-500" size={20} />
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaPencilAlt className="mr-2 text-indigo-500" size={20} />
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-y"
                placeholder="Write your post content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="tags" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" size={20} />
                Tags (optional)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Add tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-xl"
            >
              {error.message}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 group"
            >
              {loading ? "Creating..." : "Create Post"}
              <FaCheck className="ml-2 group-hover:translate-x-1 transition-transform bg-green-500 rounded-full p-1" size={20} />
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;