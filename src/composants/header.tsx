import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Header.css'; // Assurez-vous que le fichier CSS est inclus

const Header: React.FC = () => {
  const [notifications] = useState<number>(3);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Vous êtes déconnecté');
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/path-to-logo.png" alt="Logo" className="logo" />
        <h1 className="app-name">Nom de l'application</h1>
      </div>
      <div className="actions">
        <div className="notifications">
          <FaBell size={24} />
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </div>
        <div className="profile" onClick={goToProfile}>
          <FaUserCircle size={32} />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt size={20} />
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;