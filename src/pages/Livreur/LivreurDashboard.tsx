// import React, { useState } from 'react';
// import { Package, MapPin, Clock, CheckCircle, AlertCircle, User, Bell, Menu, Search, Filter, Truck, Route, Calendar } from 'lucide-react';

// const LivreurDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState(null);

//   // Données simulées
//   const deliveryStats = {
//     totalPackages: 24,
//     delivered: 18,
//     pending: 6,
//     todayEarnings: 150.75
//   };

//   const packages = [
//     {
//       id: 'PKG001',
//       recipient: 'Marie Dubois',
//       address: '123 Rue de la Paix, Paris 75001',
//       status: 'pending',
//       priority: 'high',
//       estimatedTime: '14:30',
//       distance: '2.5 km',
//       phone: '+33 1 23 45 67 89',
//       notes: 'Sonner à l\'interphone'
//     },
//     {
//       id: 'PKG002',
//       recipient: 'Jean Martin',
//       address: '456 Avenue des Champs, Paris 75008',
//       status: 'delivered',
//       priority: 'normal',
//       deliveredAt: '12:15',
//       distance: '1.8 km',
//       phone: '+33 1 98 76 54 32'
//     },
//     {
//       id: 'PKG003',
//       recipient: 'Sophie Bernard',
//       address: '789 Boulevard Saint-Germain, Paris 75006',
//       status: 'pending',
//       priority: 'normal',
//       estimatedTime: '15:45',
//       distance: '3.2 km',
//       phone: '+33 1 11 22 33 44'
//     }
//   ];

//   const StatusBadge = ({ status }) => {
//     const badges = {
//       pending: 'bg-warning text-dark',
//       delivered: 'bg-success text-white',
//       failed: 'bg-danger text-white'
//     };
    
//     const icons = {
//       pending: <Clock size={12} />,
//       delivered: <CheckCircle size={12} />,
//       failed: <AlertCircle size={12} />
//     };

//     return (
//       <span className={`badge ${badges[status]} d-flex align-items-center gap-1`}>
//         {icons[status]}
//         {status === 'pending' ? 'En cours' : status === 'delivered' ? 'Livré' : 'Échec'}
//       </span>
//     );
//   };

//   const PriorityBadge = ({ priority }) => {
//     const badges = {
//       high: 'bg-danger text-white',
//       normal: 'bg-secondary text-white',
//       low: 'bg-light text-dark'
//     };

//     return (
//       <span className={`badge ${badges[priority]}`}>
//         {priority === 'high' ? 'Urgent' : priority === 'normal' ? 'Normal' : 'Faible'}
//       </span>
//     );
//   };

//   const DashboardTab = () => (
//     <div className="container-fluid py-4">
//       {/* Stats Cards */}
//       <div className="row mb-4">
//         <div className="col-md-3 col-6 mb-3">
//           <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #ff6b35'}}>
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h3 className="mb-1" style={{color: '#ff6b35'}}>{deliveryStats.totalPackages}</h3>
//                   <p className="text-muted mb-0 small">Total Colis</p>
//                 </div>
//                 <Package size={32} style={{color: '#ff6b35'}} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3 col-6 mb-3">
//           <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #28a745'}}>
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h3 className="mb-1 text-success">{deliveryStats.delivered}</h3>
//                   <p className="text-muted mb-0 small">Livrés</p>
//                 </div>
//                 <CheckCircle size={32} className="text-success" />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3 col-6 mb-3">
//           <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #ffc107'}}>
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h3 className="mb-1 text-warning">{deliveryStats.pending}</h3>
//                   <p className="text-muted mb-0 small">En attente</p>
//                 </div>
//                 <Clock size={32} className="text-warning" />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3 col-6 mb-3">
//           <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #17a2b8'}}>
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h3 className="mb-1 text-info">{deliveryStats.todayEarnings}€</h3>
//                   <p className="text-muted mb-0 small">Gains aujourd'hui</p>
//                 </div>
//                 <Truck size={32} className="text-info" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="card border-0 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title mb-3">Actions rapides</h5>
//               <div className="row">
//                 <div className="col-md-3 col-6 mb-2">
//                   <button className="btn btn-outline-primary w-100" style={{borderColor: '#ff6b35', color: '#ff6b35'}}>
//                     <Route size={20} className="me-2" />
//                     Optimiser tournée
//                   </button>
//                 </div>
//                 <div className="col-md-3 col-6 mb-2">
//                   <button className="btn btn-outline-primary w-100" style={{borderColor: '#ff6b35', color: '#ff6b35'}}>
//                     <MapPin size={20} className="me-2" />
//                     Navigation
//                   </button>
//                 </div>
//                 <div className="col-md-3 col-6 mb-2">
//                   <button className="btn btn-outline-primary w-100" style={{borderColor: '#ff6b35', color: '#ff6b35'}}>
//                     <Calendar size={20} className="me-2" />
//                     Planning
//                   </button>
//                 </div>
//                 <div className="col-md-3 col-6 mb-2">
//                   <button className="btn btn-outline-primary w-100" style={{borderColor: '#ff6b35', color: '#ff6b35'}}>
//                     <Bell size={20} className="me-2" />
//                     Notifications
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Package List */}
//       <div className="row">
//         <div className="col-12">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white border-0">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <h5 className="mb-0">Mes livraisons</h5>
//                 <div className="d-flex gap-2">
//                   <button className="btn btn-sm btn-outline-secondary">
//                     <Filter size={16} />
//                   </button>
//                   <button className="btn btn-sm btn-outline-secondary">
//                     <Search size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="card-body p-0">
//               <div className="table-responsive">
//                 <table className="table table-hover mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Colis</th>
//                       <th>Destinataire</th>
//                       <th>Adresse</th>
//                       <th>Statut</th>
//                       <th>Priorité</th>
//                       <th>Heure</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {packages.map((pkg) => (
//                       <tr key={pkg.id}>
//                         <td>
//                           <strong>{pkg.id}</strong>
//                           <br />
//                           <small className="text-muted">{pkg.distance}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong>{pkg.recipient}</strong>
//                             <br />
//                             <small className="text-muted">{pkg.phone}</small>
//                           </div>
//                         </td>
//                         <td>
//                           <small>{pkg.address}</small>
//                         </td>
//                         <td>
//                           <StatusBadge status={pkg.status} />
//                         </td>
//                         <td>
//                           <PriorityBadge priority={pkg.priority} />
//                         </td>
//                         <td>
//                           <small>
//                             {pkg.status === 'delivered' ? (
//                               <span className="text-success">Livré à {pkg.deliveredAt}</span>
//                             ) : (
//                               <span>Prévu à {pkg.estimatedTime}</span>
//                             )}
//                           </small>
//                         </td>
//                         <td>
//                           <div className="btn-group btn-group-sm">
//                             <button 
//                               className="btn btn-outline-primary"
//                               style={{borderColor: '#ff6b35', color: '#ff6b35'}}
//                               onClick={() => setSelectedPackage(pkg)}
//                             >
//                               <MapPin size={14} />
//                             </button>
//                             <button 
//                               className="btn btn-outline-success"
//                               disabled={pkg.status === 'delivered'}
//                             >
//                               <CheckCircle size={14} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const ProfileTab = () => (
//     <div className="container-fluid py-4">
//       <div className="row">
//         <div className="col-lg-4 mb-4">
//           <div className="card border-0 shadow-sm">
//             <div className="card-body text-center">
//               <div className="mb-3">
//                 <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
//                   <User size={40} className="text-secondary" />
//                 </div>
//               </div>
//               <h5>Pierre Durand</h5>
//               <p className="text-muted">Livreur Expert</p>
//               <div className="row text-center">
//                 <div className="col-4">
//                   <h6>4.8</h6>
//                   <small className="text-muted">Note</small>
//                 </div>
//                 <div className="col-4">
//                   <h6>156</h6>
//                   <small className="text-muted">Livraisons</small>
//                 </div>
//                 <div className="col-4">
//                   <h6>98%</h6>
//                   <small className="text-muted">Réussite</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-8">
//           <div className="card border-0 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Informations personnelles</h5>
//               <div>
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Nom</label>
//                     <input type="text" className="form-control" defaultValue="Pierre Durand" />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Email</label>
//                     <input type="email" className="form-control" defaultValue="pierre.durand@example.com" />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Téléphone</label>
//                     <input type="tel" className="form-control" defaultValue="+33 6 12 34 56 78" />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Véhicule</label>
//                     <select className="form-select">
//                       <option>Scooter</option>
//                       <option>Vélo</option>
//                       <option>Voiture</option>
//                     </select>
//                   </div>
//                 </div>
//                 <button type="button" className="btn text-white" style={{backgroundColor: '#ff6b35'}}>
//                   Mettre à jour
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-vh-100 bg-light">
//       {/* Header */}
//       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
//         <div className="container-fluid">
//           <button
//             className="navbar-toggler border-0"
//             type="button"
//             onClick={() => setShowSidebar(!showSidebar)}
//           >
//             <Menu size={24} />
//           </button>
//           <div className="navbar-brand fw-bold" style={{color: '#ff6b35'}}>
//             <Package size={28} className="me-2" />
//             DeliveryApp
//           </div>
//           <div className="d-flex align-items-center">
//             <button className="btn btn-link text-dark me-2">
//               <Bell size={20} />
//             </button>
//             <button className="btn btn-link text-dark">
//               <User size={20} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="d-flex">
//         {/* Sidebar */}
//         <div className={`sidebar bg-white shadow-sm ${showSidebar ? 'show' : ''}`} style={{
//           width: '250px',
//           minHeight: 'calc(100vh - 56px)',
//           transform: showSidebar ? 'translateX(0)' : 'translateX(-250px)',
//           transition: 'transform 0.3s ease-in-out',
//           position: 'fixed',
//           top: '56px',
//           left: '0',
//           zIndex: 1000
//         }}>
//           <div className="p-3">
//             <ul className="nav nav-pills flex-column">
//               <li className="nav-item mb-2">
//                 <button
//                   className={`nav-link w-100 text-start ${activeTab === 'dashboard' ? 'active' : ''}`}
//                   style={{
//                     backgroundColor: activeTab === 'dashboard' ? '#ff6b35' : 'transparent',
//                     color: activeTab === 'dashboard' ? 'white' : '#333'
//                   }}
//                   onClick={() => setActiveTab('dashboard')}
//                 >
//                   <Package size={18} className="me-2" />
//                   Tableau de bord
//                 </button>
//               </li>
//               <li className="nav-item mb-2">
//                 <button
//                   className={`nav-link w-100 text-start ${activeTab === 'profile' ? 'active' : ''}`}
//                   style={{
//                     backgroundColor: activeTab === 'profile' ? '#ff6b35' : 'transparent',
//                     color: activeTab === 'profile' ? 'white' : '#333'
//                   }}
//                   onClick={() => setActiveTab('profile')}
//                 >
//                   <User size={18} className="me-2" />
//                   Profil
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-grow-1" style={{marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease-in-out'}}>
//           {activeTab === 'dashboard' && <DashboardTab />}
//           {activeTab === 'profile' && <ProfileTab />}
//         </div>
//       </div>

//       {/* Package Detail Modal */}
//       {selectedPackage && (
//         <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Détails du colis {selectedPackage.id}</h5>
//                 <button type="button" className="btn-close" onClick={() => setSelectedPackage(null)}></button>
//               </div>
//               <div className="modal-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <h6>Destinataire</h6>
//                     <p>{selectedPackage.recipient}</p>
//                     <h6>Adresse</h6>
//                     <p>{selectedPackage.address}</p>
//                     <h6>Téléphone</h6>
//                     <p>{selectedPackage.phone}</p>
//                   </div>
//                   <div className="col-md-6">
//                     <h6>Statut</h6>
//                     <p><StatusBadge status={selectedPackage.status} /></p>
//                     <h6>Priorité</h6>
//                     <p><PriorityBadge priority={selectedPackage.priority} /></p>
//                     <h6>Distance</h6>
//                     <p>{selectedPackage.distance}</p>
//                     {selectedPackage.notes && (
//                       <>
//                         <h6>Notes</h6>
//                         <p>{selectedPackage.notes}</p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={() => setSelectedPackage(null)}>
//                   Fermer
//                 </button>
//                 <button type="button" className="btn text-white" style={{backgroundColor: '#ff6b35'}}>
//                   Commencer livraison
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Overlay for sidebar on mobile */}
//       {showSidebar && (
//         <div 
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{zIndex: 999}}
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* Bootstrap CSS */}
//       <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
//       <style jsx>{`
//         @media (max-width: 992px) {
//           .sidebar {
//             position: fixed !important;
//           }
//           .flex-grow-1 {
//             margin-left: 0 !important;
//           }
//         }
        
//         .table-responsive {
//           max-height: 600px;
//           overflow-y: auto;
//         }
        
//         .card:hover {
//           transform: translateY(-2px);
//           transition: transform 0.2s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LivreurDashboard;
// src/pages/LivreurDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner, 
  ListGroup,
  Badge,
  Modal,
  Form,
  Alert
} from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LivreurSidebar from './composants/sidebar';
import LivreurHeader from './composants/header';
//import './LivreurDashboard.css'; // Fichier CSS pour les styles supplémentaires

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Configuration d'axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Icônes personnalisées
const createCustomIcon = (iconUrl) => L.icon({
  iconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const livreurIcon = createCustomIcon('https://cdn-icons-png.flaticon.com/512/447/447031.png');
const colisIcon = createCustomIcon('https://cdn-icons-png.flaticon.com/512/2748/2748558.png');

// Composant pour recentrer la carte
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LivreurDashboard = () => {
  const [colisList, setColisList] = useState([]);
  const [selectedColis, setSelectedColis] = useState(null);
  const [position, setPosition] = useState([48.8566, 2.3522]); // Position par défaut
  const [loading, setLoading] = useState({
    colis: false,
    position: false,
    livraison: false
  });
  const [error, setError] = useState('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [locationData, setLocationData] = useState({
    location: '',
    latitude: '',
    longitude: ''
  });
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const navigate = useNavigate();

  // Vérifier les permissions de géolocalisation
  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(status.state);
        
        status.onchange = () => {
          setPermissionStatus(status.state);
          if (status.state === 'granted') {
            getCurrentLocation();
          }
        };
      } catch (error) {
        console.error("Erreur de vérification des permissions:", error);
      }
    }
  };

  // Récupérer les colis assignés
  const fetchColisAssignes = async () => {
    setLoading(prev => ({...prev, colis: true}));
    setError('');
    
    try {
      const response = await api.get('/colis');
      setColisList(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erreur de chargement des colis';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(prev => ({...prev, colis: false}));
    }
  };

  // Obtenir la position actuelle
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }
    
    setLoading(prev => ({...prev, position: true}));
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        setLocationData({
          location: 'Position actuelle',
          latitude: latitude.toString(),
          longitude: longitude.toString()
        });
        
        api.post('/position', { latitude, longitude })
          .catch(err => console.error("Erreur d'envoi de position", err));
          
        setLoading(prev => ({...prev, position: false}));
      },
      (error) => {
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Information de localisation indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'La demande de localisation a expiré';
            break;
          default:
            errorMessage = 'Erreur inconnue lors de la localisation';
        }
        
        setError(errorMessage);
        setLoading(prev => ({...prev, position: false}));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Démarrer une livraison
  const demarrerLivraison = async () => {
    if (!selectedColis) return;
    
    setLoading(prev => ({...prev, livraison: true}));
    setError('');
    
    try {
      await api.post(`/colis/${selectedColis.code_suivi}/demarrer`, locationData);
      fetchColisAssignes();
      setShowStartModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erreur de démarrage de la livraison';
      setError(errorMessage);
    } finally {
      setLoading(prev => ({...prev, livraison: false}));
    }
  };

  // Marquer un colis comme livré
  const livrerColis = async () => {
    if (!selectedColis) return;
    
    setLoading(prev => ({...prev, livraison: true}));
    setError('');
    
    try {
      await api.post(`/colis/${selectedColis.code_suivi}/livrer`, locationData);
      fetchColisAssignes();
      setShowDeliverModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la livraison';
      setError(errorMessage);
    } finally {
      setLoading(prev => ({...prev, livraison: false}));
    }
  };

  // Initialisation
  useEffect(() => {
    checkLocationPermission();
    fetchColisAssignes();
    
    if (permissionStatus === 'granted') {
      getCurrentLocation();
    }
    
    const interval = setInterval(() => {
      if (permissionStatus === 'granted') {
        getCurrentLocation();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [permissionStatus]);

  // Statut des badges
  const statusColors = {
    'Enregistré': 'primary',
    'En transit': 'info',
    'Expédié': 'info',
    'En livraison': 'warning',
    'Livré': 'success',
    'Retourné': 'danger'
  };

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <LivreurHeader />
      <div className="d-flex flex-grow-1">
        <LivreurSidebar />
        <main className="flex-grow-1 p-4 main-content">
          <div className="dashboard-header mb-4">
            <h2 className="text-center text-orange">Tableau de Bord Livreur</h2>
          </div>

          {error && (
            <div className="mb-3">
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            </div>
          )}

          <Row>
            <Col md={5}>
              <Card className="mb-4 shadow-sm border-orange">
                <Card.Header className="bg-orange text-white">
                  <h5>Colis Assignés</h5>
                </Card.Header>
                <Card.Body>
                  {loading.colis ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="orange" />
                      <p className="mt-2">Chargement des colis...</p>
                    </div>
                  ) : colisList.length > 0 ? (
                    <ListGroup>
                      {colisList.map(colis => (
                        <ListGroup.Item key={colis.id} className="py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{colis.code_suivi}</h6>
                              <p className="mb-1">
                                <strong>Destinataire:</strong> {colis.destinataire_nom}
                              </p>
                              <p className="mb-1">
                                <Badge pill bg={statusColors[colis.statut] || 'secondary'}>
                                  {colis.statut}
                                </Badge>
                              </p>
                            </div>
                            <div>
                              {colis.statut === 'En livraison' ? (
                                <Button 
                                  variant="orange"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedColis(colis);
                                    setShowDeliverModal(true);
                                  }}
                                >
                                  Livrer
                                </Button>
                              ) : (
                                <Button 
                                  variant="orange-outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedColis(colis);
                                    setShowStartModal(true);
                                  }}
                                  disabled={!['Expédié', 'En transit'].includes(colis.statut)}
                                >
                                  Démarrer
                                </Button>
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Alert variant="info" className="text-center">
                      Aucun colis assigné pour le moment
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={7}>
              <Card className="mb-4 shadow-sm border-orange">
                <Card.Header className="bg-orange text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Ma Position Actuelle</h5>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={loading.position || permissionStatus === 'denied'}
                    className="btn-orange"
                  >
                    {loading.position ? (
                      <Spinner size="sm" animation="border" variant="light" />
                    ) : (
                      <i className="fas fa-sync-alt"></i>
                    )}
                  </Button>
                </Card.Header>
                <Card.Body className="p-0" style={{ height: '400px' }}>
                  <MapContainer 
                    center={position} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    
                    <RecenterMap center={position} />
                    
                    <Marker position={position} icon={livreurIcon}>
                      <Popup>Votre position actuelle</Popup>
                    </Marker>
                    
                    {colisList
                      .filter(colis => colis.latitude && colis.longitude)
                      .map(colis => (
                        <Marker 
                          key={colis.id}
                          position={[colis.latitude, colis.longitude]} 
                          icon={colisIcon}
                          eventHandlers={{
                            click: () => setSelectedColis(colis)
                          }}
                        >
                          <Popup>
                            <strong>📦 {colis.code_suivi}</strong><br />
                            {colis.destinataire_adresse}<br />
                            <Badge bg={statusColors[colis.statut] || 'secondary'}>
                              {colis.statut}
                            </Badge>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                </Card.Body>
                <Card.Footer className="bg-white">
                  {permissionStatus === 'denied' ? (
                    <Alert variant="warning" className="mb-0 py-2">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Autorisation de géolocalisation refusée. Activez-la dans les paramètres de votre navigateur.
                    </Alert>
                  ) : (
                    <div className="text-muted small">
                      {position ? (
                        `Position: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
                      ) : (
                        "En attente de localisation..."
                      )}
                    </div>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* Modal pour démarrer la livraison */}
          <Modal show={showStartModal} onHide={() => setShowStartModal(false)}>
            <Modal.Header closeButton className="bg-orange text-white">
              <Modal.Title>Démarrer la livraison</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-3">
                Confirmez-vous le démarrage de la livraison pour le colis{' '}
                <strong className="text-orange">{selectedColis?.code_suivi}</strong>?
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Position de départ</Form.Label>
                <Form.Control 
                  type="text" 
                  value={locationData.location}
                  onChange={(e) => setLocationData({...locationData, location: e.target.value})}
                  placeholder="Entrez votre position actuelle"
                />
              </Form.Group>
              
              <Button 
                variant="orange-outline" 
                onClick={getCurrentLocation}
                disabled={loading.position}
                className="w-100"
              >
                {loading.position ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <i className="fas fa-location-arrow me-2"></i>
                    Utiliser ma position actuelle
                  </>
                )}
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowStartModal(false)}>
                Annuler
              </Button>
              <Button 
                variant="orange" 
                onClick={demarrerLivraison}
                disabled={loading.livraison}
              >
                {loading.livraison ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  'Démarrer la livraison'
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal pour marquer comme livré */}
          <Modal show={showDeliverModal} onHide={() => setShowDeliverModal(false)}>
            <Modal.Header closeButton className="bg-orange text-white">
              <Modal.Title>Confirmer la livraison</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-3">
                Confirmez-vous la livraison du colis{' '}
                <strong className="text-orange">{selectedColis?.code_suivi}</strong> à l'adresse :
              </p>
              
              <p className="fw-bold mb-4">{selectedColis?.destinataire_adresse}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Position de livraison</Form.Label>
                <Form.Control 
                  type="text" 
                  value={locationData.location}
                  onChange={(e) => setLocationData({...locationData, location: e.target.value})}
                  placeholder="Entrez l'adresse de livraison"
                />
              </Form.Group>
              
              <Button 
                variant="orange-outline" 
                onClick={getCurrentLocation}
                disabled={loading.position}
                className="w-100"
              >
                {loading.position ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <i className="fas fa-location-arrow me-2"></i>
                    Utiliser ma position actuelle
                  </>
                )}
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeliverModal(false)}>
                Annuler
              </Button>
              <Button 
                variant="orange" 
                onClick={livrerColis}
                disabled={loading.livraison}
              >
                {loading.livraison ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  'Confirmer la livraison'
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default LivreurDashboard;