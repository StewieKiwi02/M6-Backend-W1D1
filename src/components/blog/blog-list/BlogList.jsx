import React from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = ({ posts }) => {
  return (
    <Row>
      {posts.length > 0 ? (
        posts.map((post, i) => (
          <Col
            key={`item-${i}`}
            md={4}
            style={{
              marginBottom: 50,
            }}
          >
            <BlogItem key={post.title} {...post} />
          </Col>
        ))
      ) : (
        <p>Nessun articolo trovato.</p>
      )}
    </Row>
  );
};

export default BlogList;
