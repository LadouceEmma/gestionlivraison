import React, { useState } from 'react';
import { 
  FaBell, 
  FaUserCircle, 
  FaCog, 
  FaSearch, 
  FaBars,
  FaMoon,
  FaSun
} from 'react-icons/fa';

interface SuperadminHeaderProps {
  toggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

const AdminHeader: React.FC<SuperadminHeaderProps> = ({ 
  toggleSidebar, 
  sidebarCollapsed 
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications] = useState<number>(3);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className={`header shadow-sm d-flex justify-content-between align-items-center ${darkMode ? 'dark-mode' : ''}`} 
      style={{ 
        height: '64px', 
        backgroundColor: '#fff', // Fond blanc
        padding: '0 20px', 
        color: darkMode ? '#fff' : '#000',
        position: 'fixed',
        top: 0,
        right: 0,
        left: sidebarCollapsed ? '80px' : '250px',
        zIndex: 1000,
        transition: 'left 0.3s ease-in-out'
      }}
    >
      <div className="d-flex align-items-center">
        <div className="d-block d-md-none me-3">
          <button 
            className="btn btn-sm text-black border-0" // Icône noire
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>

        <div className="logo d-flex align-items-center">
          <h1 className="fs-4 fw-bold m-0">TrackColis</h1>
          <span className="badge bg-orange text-white ms-2">Admin</span>
        </div>
      </div>

      <div className="header-actions d-flex align-items-center">
        <div className={`search-container me-3 ${showSearch ? 'active' : ''}`}>
          {showSearch ? (
            <div className="input-group">
              <input 
                type="text" 
                className="form-control form-control-sm border-0" 
                placeholder="Rechercher..." 
                style={{ width: '200px' }}
              />
              <button 
                className="btn btn-sm bg-orange text-white border-0" 
                onClick={() => setShowSearch(false)}
              >
                ×
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-sm icon-btn" 
              title="Rechercher" 
              onClick={() => setShowSearch(true)}
            >
              <FaSearch size={18} />
            </button>
          )}
        </div>

        <div className="position-relative mx-3">
          <button className="btn btn-sm icon-btn" title="Notifications">
            <FaBell size={20} />
            {notifications > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications}
                <span className="visually-hidden">notifications non lues</span>
              </span>
            )}
          </button>
        </div>

        <div className="mx-3">
          <button 
            className="btn btn-sm icon-btn" 
            title={darkMode ? "Mode clair" : "Mode sombre"} 
            onClick={toggleDarkMode}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        <div className="mx-3">
          <button className="btn btn-sm icon-btn" title="Paramètres">
            <FaCog size={20} />
          </button>
        </div>

        <div className="dropdown">
          <button 
            className="btn btn-sm dropdown-toggle d-flex align-items-center" 
            type="button" 
            id="userDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <FaUserCircle size={22} className="me-2" />
            <span className="d-none d-md-inline">Admin</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
            <li><a className="dropdown-item" href="#profile">Mon profil</a></li>
            <li><a className="dropdown-item" href="#settings">Paramètres</a></li>
            <li><hr className="dropdown-divider" /></li>
          </ul>
        </div>
      </div>

      <style>{`
        .bg-orange {
          background-color: #FF9800;
        }
        
        .text-white {
          color: #fff;
        }

        .text-black {
          color: #000;
        }

        .icon-btn {
          color: inherit;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .icon-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .dark-mode .icon-btn:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .search-container.active {
          background-color: white;
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .header {
            left: 0 !important;
            padding: 0 10px;
          }
          
          .logo h1 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;