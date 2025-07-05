import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  agence: string;
}

const AdminProfil: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('/api/user/profile') // endpoint pour récupérer le profil de l'utilisateur connecté
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <div className="container mt-4">Chargement du profil...</div>;

  return (
    <div className="container mt-4">
      <h3>👤 Mon profil</h3>
      <div className="card mt-3 p-3">
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Rôle :</strong> {user.role}</p>
        <p><strong>Agence :</strong> {user.agence}</p>
      </div>
    </div>
  );
};

export default AdminProfil;
