import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST_DETAILS } from "../graphql/queries";
import { CREATE_COMMENT } from "../graphql/mutations";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa";

const PostDetail = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // Fetch post details
  const { loading, error, data } = useQuery(GET_POST_DETAILS, {
    variables: { id },
  });

  // Mutation to create a comment
  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POST_DETAILS, variables: { id } }], // Refetch post details after adding a comment
  });

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty!");
      return; // Prevent empty comments
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add a comment!");
      navigate("/login");
      return;
    }
  
    try {
      await createComment({
        variables: { postId: id, content: comment },
      });
      setComment(""); // Clear the comment input
      navigate("/");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Error adding comment: " + error.message);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>;

  const { post } = data;

  return (
    <>

    <button className=" fixed  pr-3 py-1 rounded-lg flex items-center gap-2 text-black" onClick={() => navigate("/")}>
       <FaArrowLeft
         className="text-indigo-600 cursor-pointer bg-gray-400 rounded-full p-1"
         size={36}
       />
       <p className="hidden md:block">

       Back
       </p>
     </button>
 
    <div className="container mx-auto p-4 px-20">

      {/* Post Details */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md rounded-lg p-6 my-8 "
      >
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <p className="text-sm text-gray-500">
  Author: <span className="font-bold">{post.author.username}</span> |{" "}
  {new Date(parseInt(post.createdAt)).toLocaleString()}
</p>

      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {post.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <ul>
            {post.comments.map((comment) => (
              <motion.li
                key={comment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gray-100 p-4 rounded-md mb-4"
              >
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-sm text-gray-500">
                  By: <span className="font-bold">{comment.author.username}</span> |{" "}
                  {new Date(parseInt(comment.createdAt)).toLocaleString()}
                </p>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4">Add a Comment</h3>
        <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Write your comment here..."
            rows="4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Comment
          </button>
        </form>
      </motion.div>
    </div>
    </>
  );
};

export default PostDetail;