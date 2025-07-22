import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Box as PackageIcon,
  Home,
  Settings,
  User,
  Search,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'react-feather';
import {  QrCode, Send } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div 
      className={`d-flex flex-column p-3 shadow ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`} 
      style={{ 
        minHeight: '100vh', 
        transition: 'width 0.3s', 
        width: collapsed ? '80px' : '250px',
        backgroundColor: '#FF9800', // Fond orange
        color: '#fff' // Texte blanc pour lisibilité
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-white text-orange-500 p-2 rounded-circle me-2">
            <PackageIcon size={20} />
          </div>
          {!collapsed && <span className="fw-bold">ColisExpress</span>}
        </div>
        <button 
          className="btn btn-link text-decoration-none text-white p-0"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="mb-4">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control border-end-0 bg-white text-dark" 
            placeholder="Rechercher..." 
            style={{ display: collapsed ? 'none' : 'block' }}
          />
          <button className="btn btn-outline-light border-start-0">
            <Search size={18} color="#fff" />
          </button>
        </div>
      </div>
      
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column">
          <li className="nav-item mb-2">
            <NavLink 
              to="/ClientDashboard" 
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "bg-white text-orange-500" : ""
                }`
              }
            >
              <Home size={18} className="me-2" />
              {!collapsed && "Tableau de bord"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink 
              to="/ColisPreenregistrement" 
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "bg-white text-orange-500" : ""
                }`
              }
            >
              <PackageIcon size={18} className="me-2" />
              {!collapsed && "Colis"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink 
              to="/ClientHistory" 
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "bg-white text-orange-500" : ""
                }`
              }
            >
              <Send size={18} className="me-2" />
              {!collapsed && "Mes Expéditions"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink 
              to="/clientchat" 
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "bg-white text-orange-500" : ""
                }`
              }
            >
              <Truck size={18} className="me-2" />
              {!collapsed && "Messagerie"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink 
              to="/profilclient" 
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "bg-white text-orange-500" : ""
                }`
              }
            >
              <User size={18} className="me-2" />
              {!collapsed && "Profil"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/settings" 
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "bg-white-50 text-orange-200" : ""
                }`
              }
            >
              <Settings size={18} className="me-2" />
              {!collapsed && "Paramètres"}
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto">
        <button className="btn btn-sm btn-outline-light w-100 mb-2">
          <QrCode size={16} className="me-1" color="#fff" />
          {!collapsed && "Scanner colis"}
        </button>
        <button 
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
        >
          <LogOut size={16} className={collapsed ? '' : 'me-1'} color="#fff" />
          {!collapsed && "Déconnexion"}
        </button>
      </div>

      <style>{`
        .text-orange-500 {
          color: #FF9800;
        }
        
        .bg-orange-100 {
          background-color: #FF9800 !important;
        }
        
        .nav-link {
          transition: background-color 0.2s, color 0.2s;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-expanded .nav-link.active {
          background-color: #fff;
          color: #FF9800 !important;
        }
        
        .sidebar-collapsed .nav-link {
          justify-content: center;
        }
        
        .sidebar-collapsed .nav-link span {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
