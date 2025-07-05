import React from 'react';
import { FaBell, FaUserCircle, FaCog } from 'react-icons/fa';

const ReceptionistHeader: React.FC = () => (
  <header className="header d-flex justify-content-between align-items-center" style={{ height: '60px', backgroundColor: '#FF9800', padding: '0 20px', color: '#fff' }}>
    <div className="logo">
      <h1 style={{ margin: 0 }}>TrackColis</h1>
    </div>
    <div className="header-icons d-flex align-items-center">
      <div className="icon mx-3" title="Notifications">
        <FaBell size={24} />
      </div>
      <div className="icon mx-3" title="Profil">
        <FaUserCircle size={24} />
      </div>
      <div className="icon mx-3" title="Paramètres">
        <FaCog size={24} />
      </div>
    </div>
  </header>
);

export default ReceptionistHeader;