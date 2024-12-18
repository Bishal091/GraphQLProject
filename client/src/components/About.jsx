import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaCode, FaUsers, FaLightbulb, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const About = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("user");

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/create-post"); // Redirect to create post if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center"
      >
        About Our<Link to="/" className="hover:text-green-300  text-3xl sm:text-4xl md:text-5xl flex items-center justify-center ">
  <span>Burrr</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-green-500"
  >
    <path d="M12.428 2.928a7.5 7.5 0 0 1 9.143 9.143 3 3 0 0 1-2.028 2.029l-3.57.714-2.214 2.214c.174.59.24 1.08.204 1.43-.064.616-.339 1.31-.906 1.877-.828.828-2.202.856-3.016.042-.813-.814-.785-2.188.042-3.016.567-.567 1.261-.842 1.877-.906.35-.036.84.03 1.43.204l2.214-2.214.714-3.57A3 3 0 0 1 19.5 9.357a7.5 7.5 0 0 1-9.143-9.143a2 2 0 0 1 2.071 2.071ZM15.072 15.072a1 1 0 0 1-1.414 0L3.515 4.93a1 1 0 1 1 1.414-1.414L15.072 13.657a1 1 0 0 1 0 1.414Z" />
  </svg>
</Link>
      </motion.h1>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl"
      >
        {/* Mission Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaHeart className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            I aim to create a community where ideas flourish and knowledge is
            shared freely. My mission is to inspire and connect people through
            meaningful content.
          </p>
        </motion.div>

        {/* Technology Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaCode className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology</h2>
          <p className="text-gray-600">
            Built with modern technologies like React, GraphQL, and Tailwind
            CSS, our platform ensures a seamless and responsive experience for
            all users.
          </p>
        </motion.div>

        {/* Community Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaUsers className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Community</h2>
          <p className="text-gray-600">
            Join a vibrant community of thinkers, creators, and learners. Share
            your thoughts, engage in discussions, and grow together.
          </p>
        </motion.div>

        {/* Inspiration Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaLightbulb className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inspiration</h2>
          <p className="text-gray-600">
            We believe in the power of ideas. Our blog is a platform to spark
            creativity, share insights, and inspire others to think differently.
          </p>
        </motion.div>
      </motion.div>

       {/* Connect with Me Section */}
       <motion.div
        variants={itemVariants}
        className="mt-16 w-full max-w-4xl bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Connect with Me
        </h2>
        <p className="text-gray-600 mb-8">
          Let's stay connected! Follow me on social media for updates, insights,
          and more.
        </p>
        <div className="flex flex-wrap justify-center gap-10">
          {/* GitHub */}
          <a
            href="https://github.com/Bishal091"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <FaGithub size={48} className="mb-2" />
            <span className="text-lg font-medium">GitHub</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/bishal-singh-797129203/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <FaLinkedin size={48} className="mb-2" />
            <span className="text-lg font-medium">LinkedIn</span>
          </a>

          {/* Twitter */}
          <a
            href="https://x.com/Bishal234113"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <FaTwitter size={48} className="mb-2" />
            
            
            <span className="text-lg font-medium">X</span>
          </a>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        variants={itemVariants}
        className="mt-12 w-full max-w-4xl bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Join Our Community
        </h2>
        <p className="text-gray-600 mb-6">
          Whether you're here to read, write, or connect, we're glad you're
          here. Together, we can create something amazing.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all duration-300"
          onClick={handleGetStarted}
        >
          {isLoggedIn ? "Create a Post" : "Get Started"}
        </motion.button>
      </motion.div>

     
    </motion.div>
  );
};

export default About;