import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Box as PackageIcon,
  Home,
  History,
  MapPin,
  Settings,
  User,
  QrCode,
  Search,
  BarChart,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'react-feather';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`d-flex flex-column p-3 bg-white shadow ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`} 
         style={{ minHeight: '100vh', transition: 'width 0.3s', width: collapsed ? '80px' : '250px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-orange-100 text-danger p-2 rounded-circle me-2">
            <PackageIcon size={20} />
          </div>
          {!collapsed && <span className="fw-bold">ColisExpress</span>}
        </div>
        <button 
          className="btn btn-link text-decoration-none text-dark p-0"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="mb-4">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control border-end-0" 
            placeholder="Rechercher..." 
            style={{ display: collapsed ? 'none' : 'block' }}
          />
          <button className="btn btn-outline-warning border-start-0">
            <Search size={18} />
          </button>
        </div>
      </div>
      
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column">
          <li className="nav-item mb-2">
            <NavLink to="/" className="nav-link d-flex align-items-center" >
              <Home size={18} className="me-2" />
              {!collapsed && "Tableau de bord"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/historiqueCient" className="nav-link d-flex align-items-center">
              <History size={18} className="me-2" />
              {!collapsed && "Historique"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/suiviClient" className="nav-link d-flex align-items-center" >
              <Truck size={18} className="me-2" />
              {!collapsed && "Suivi en direct"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/relay-points" className="nav-link d-flex align-items-center" >
              <MapPin size={18} className="me-2" />
              {!collapsed && "Points relais"}
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/profile" className="nav-link d-flex align-items-center" >
              <User size={18} className="me-2" />
              {!collapsed && "Profil"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/settings" className="nav-link d-flex align-items-center">
              <Settings size={18} className="me-2" />
              {!collapsed && "Paramètres"}
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto">
        <button className="btn btn-sm btn-outline-warning w-100 mb-2">
          <QrCode size={16} className="me-1" />
          {!collapsed && "Scanner colis"}
        </button>
        <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center">
          <LogOut size={16} className={collapsed ? '' : 'me-1'} />
          {!collapsed && "Déconnexion"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;