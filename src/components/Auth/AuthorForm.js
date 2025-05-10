import React, { useState } from 'react';

const AuthorForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const authorData = new FormData();
    authorData.append('name', name);
    authorData.append('bio', bio);
    if (image) {
      authorData.append('image', image);
    }
    onSubmit(authorData); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome dell'Autore</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Biografia</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div>
        <label>Carica un'immagine</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button type="submit">Aggiungi Autore</button>
    </form>
  );
};

export default AuthorForm;
