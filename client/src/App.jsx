import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Posts from "./components/Posts";
import PostDetail from "./components/PostsDetail";
import CreatePost from "./components/Create";
import ProtectedRoute from "./utils/ProtectedRoute";
import About from "./components/About";
const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;