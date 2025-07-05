// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="text-center mt-5">
      <h1>404</h1>
      <p>Page non trouvée</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default NotFound;
