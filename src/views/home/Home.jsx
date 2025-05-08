import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import axios from "axios";
import NavBar from "../../components/navbar/NavBar";
import "./styles.css";

const Home = props => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");  

  const fetchPosts = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:3001/blogPosts?title=${searchTerm}`);
      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts(searchTerm);  
  }, [searchTerm]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);  
  };

  return (
    <div>
      <NavBar onSearch={handleSearch} /> 
      <Container fluid="sm">
        <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
        <BlogList posts={posts} />  
      </Container>
    </div>
  );
};

export default Home;
