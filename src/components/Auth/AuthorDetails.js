import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AuthorDetails = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      const response = await fetch(`/api/authors/${authorId}`);
      const data = await response.json();
      setAuthor(data);
    };

    fetchAuthorDetails();
  }, [authorId]);

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{author.name}</h2>
      <img src={author.image} alt={author.name} style={{ width: '200px', height: '200px' }} />
      <p><strong>Biografia:</strong> {author.bio}</p>
    </div>
  );
};

export default AuthorDetails;
