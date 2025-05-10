import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import AuthorList from "./components/Auth/AuthorList";
import AuthorForm from "./components/Auth/AuthorForm";
import AuthorDetails from "./components/Auth/AuthorDetails.js";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authors" element={<AuthorList />} />
        <Route path="/authors/:id" element={<AuthorDetails />} />
        <Route path="/add-author" element={<AuthorForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
