import { useContext, useState } from 'react';
import { UserContext } from '../../../services/UseProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaUsers, 
  FaChartBar, 
  FaSignOutAlt, 
  FaHistory, 
  FaTruck, 
  FaBars,
  FaUserCircle,
 
  FaServicestack
} from 'react-icons/fa';

const AdminSidebar = () => {
  const user = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (user === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-orange" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admindashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/admincolis', label: 'Gestion des colis', icon: <FaBox /> },
    { path: '/adminusers', label: 'Utilisateurs', icon: <FaUsers /> },
    { path: '/assigncolis', label: 'Livraisons', icon: <FaServicestack /> },
    { path: '//colis/historique/admin', label: 'Suivi colis', icon: <FaTruck /> },
    { path: '/adminhistorique', label: 'Historique', icon: <FaHistory /> },
   
  ];

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  return (
    <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      <div 
        className="bg-orange shadow vh-100 border-end transition-all" 
        style={{ 
          width: collapsed ? '80px' : '250px', 
          position: 'fixed',
          transition: 'width 0.3s ease-in-out'
        }}
      >
        <div className="d-flex justify-content-end p-2">
          <button 
            className="btn btn-sm btn-light border-0" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Développer" : "Réduire"}
          >
            <FaBars />
          </button>
        </div>

        <div className="text-center mb-4 px-3">
          <div className="logo-container mb-3">
            <div className="app-logo bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <span className="text-orange fw-bold fs-4">A</span>
            </div>
          </div>
          {!collapsed }
        </div>

        <div className={`user-info text-center mb-4 ${collapsed ? 'px-2' : 'px-3'}`}>
          {collapsed ? (
            <div className="d-flex justify-content-center">
              <FaUserCircle size={24} className="text-white" />
            </div>
          ) : (
            <>
              <div className="user-avatar bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <span className="fw-bold">{user.nom?.charAt(0) || 'U'}</span>
              </div>
              <h6 className="mt-2 mb-0 text-truncate text-white">{user.nom}</h6>
              <p className="text-muted small text-truncate">{user.email}</p>
            </>
          )}
        </div>

        <div className="px-3">
          <ul className="nav flex-column">
            {navItems.map((item, index) => (
              <li className="nav-item mb-2" key={index}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded ${
                    location.pathname === item.path 
                      ? 'active bg-white text-orange fw-bold' 
                      : 'text-white hover-effect'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <span className={collapsed ? 'mx-auto' : 'me-3'}>{item.icon}</span>
                  {!collapsed && item.label}
                </Link>
              </li>
            ))}

            <li className="nav-item mt-4">
              <button
                onClick={handleLogout}
                className="btn btn-light text-danger w-100 d-flex align-items-center justify-content-center py-2 border logout-btn"
                title={collapsed ? 'Déconnexion' : ''}
              >
                <FaSignOutAlt className={collapsed ? 'mx-auto' : 'me-2'} />
                {!collapsed && 'Déconnexion'}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ width: collapsed ? '80px' : '250px', height: '1px' }}></div>

      <style>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .bg-white {
          background-color: white;
        }
        
        .text-orange {
          color: #FF8C00;
        }
        
        .bg-orange {
          background-color: #FF8C00;
        }
        
        .hover-effect:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }
        
        .logout-btn:hover {
          background-color: #fee2e2;
          color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .sidebar-container:not(.collapsed) {
            position: absolute;
            z-index: 1000;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;