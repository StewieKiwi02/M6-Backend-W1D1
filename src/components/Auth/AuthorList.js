import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await fetch('/api/authors');
      const data = await response.json();
      setAuthors(data);
    };

    fetchAuthors();
  }, []);

  return (
    <div>
      <h2>Lista degli Autori</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <img src={author.image} alt={author.name} style={{ width: '50px', height: '50px' }} />
            <h3>{author.name}</h3>
            <p>{author.bio.substring(0, 100)}...</p>
            <Link to={`/authors/${author.id}`}>Vedi Dettagli</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
