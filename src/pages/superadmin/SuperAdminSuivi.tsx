// import { useEffect, useState } from 'react';
// import SuperadminHeader from './composants/header';
// import SuperadminSidebar from './composants/sidebar';
// import Map from './composants/Map'; // Composant de carte
// import axios from 'axios';
// import { Package, Map as MapIcon, Truck, Home, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api';
// const GEOCODING_API_KEY = 'eLyTwROTX2XUOjnoUg2ZOVEHHxtHNjBHtWRbUnnA5muwgwF7Sz8ITQYgsoQTimF6'; // Remplacez par votre clé API de géocodage

// const SuiviColis = () => {
//   const [colis, setColis] = useState([]);
//   const [selectedState, setSelectedState] = useState('tout'); // État par défaut
//   const [agences, setAgences] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchColis();
//     fetchAgences();
//   }, [selectedState]);

//   const fetchColis = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token'); // Récupération du token
//     try {
//       const response = await axios.get(`${API_URL}/colis/${selectedState}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setColis(response.data);
//       setError(null);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des colis:', err);
//       setError('Impossible de récupérer les colis');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAgences = async () => {
//     const token = localStorage.getItem('token'); // Récupération du token
//     try {
//       const response = await axios.get(`${API_URL}/agences`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const agencesWithCoords = await Promise.all(response.data.map(async (agence) => {
//         const coords = await getCoordinates(agence.adresse);
//         return { ...agence, latitude: coords.lat, longitude: coords.lng };
//       }));
//       setAgences(agencesWithCoords);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des agences:', err);
//     }
//   };

//   const getCoordinates = async (adresse) => {
//     const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(adresse)}&key=${GEOCODING_API_KEY}`);
//     const { lat, lng } = response.data.results[0].geometry;
//     return { lat, lng };
//   };

//   const handleStateChange = (state) => {
//     setSelectedState(state);
//   };

//   const getStateIcon = (state) => {
//     switch(state) {
//       case 'enregistre': return <Clock />;
//       case 'en transit': return <Truck />;
//       case 'arrivee': return <Home />;
//       case 'expedie': return <CheckCircle />;
//       default: return <Package />;
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     switch(status.toLowerCase()) {
//       case 'expedie':
//         return 'bg-success';
//       case 'en transit':
//         return 'bg-warning text-dark';
//       case 'enregistre':
//         return 'bg-info text-dark';
//       case 'arrivee':
//         return 'bg-primary';
//       default:
//         return 'bg-secondary';
//     }
//   };

//   return (
//     <div className="d-flex">
//       <SuperadminSidebar />
//       <div className="main-content w-100 bg-light">
//         <SuperadminHeader />
        
//         <div className="container py-4">
//           {/* Main Card */}
//           <div className="card shadow-sm border-0 mb-4">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ borderBottom: '3px solid #FF8C00' }}>
//               <h4 className="mb-0 d-flex align-items-center">
//                 <MapIcon className="me-2" style={{ color: '#FF8C00' }} />
//                 Suivi des Colis
//               </h4>
//             </div>
            
//             <div className="card-body">
//               {/* Filtres d'état stylisés */}
//               <div className="status-filter mb-4">
//                 <div className="row g-3">
//                   {['tout', 'enregistre', 'en transit', 'arrivee', 'expedie'].map(state => (
//                     <div className="col" key={state}>
//                       <div 
//                         className={`card border-0 cursor-pointer h-100 ${selectedState === state ? 'shadow' : 'shadow-sm'}`}
//                         onClick={() => handleStateChange(state)}
//                         style={{
//                           backgroundColor: selectedState === state ? '#FF8C00' : '#FFF3E0',
//                           cursor: 'pointer',
//                           transition: 'all 0.3s ease'
//                         }}
//                       >
//                         <div className="card-body p-3 text-center">
//                           <div className="d-flex justify-content-center mb-2">
//                             <div className={`rounded-circle p-2 d-flex justify-content-center align-items-center`}
//                               style={{ 
//                                 backgroundColor: selectedState === state ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 140, 0, 0.2)',
//                                 width: '40px', 
//                                 height: '40px' 
//                               }}
//                             >
//                               {getStateIcon(state)}
//                             </div>
//                           </div>
//                           <h6 className={`mb-0 ${selectedState === state ? 'text-white' : 'text-dark'}`}>
//                             {state.charAt(0).toUpperCase() + state.slice(1)}
//                           </h6>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Error message */}
//               {error && (
//                 <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
//                   <AlertCircle className="me-2" />
//                   {error}
//                 </div>
//               )}
              
//               {/* Loading state */}
//               {loading && (
//                 <div className="text-center p-4">
//                   <div className="spinner-border" style={{ color: '#FF8C00' }} role="status">
//                     <span className="visually-hidden">Chargement...</span>
//                   </div>
//                 </div>
//               )}
              
//               {/* Carte et Liste de colis */}
//               <div className="row g-4">
//                 {/* Liste des colis */}
//                 <div className="col-lg-5">
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-header bg-white" style={{ borderBottom: '2px solid #FFF3E0' }}>
//                       <h5 className="mb-0 d-flex align-items-center">
//                         <Package className="me-2" style={{ color: '#FF8C00' }} />
//                         Liste des Colis ({colis.length})
//                       </h5>
//                     </div>
//                     <div className="card-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                       {colis.length > 0 ? (
//                         <div className="list-group list-group-flush">
//                           {colis.map(item => (
//                             <div key={item.id} className="list-group-item list-group-item-action border-0 border-bottom py-3">
//                               <div className="d-flex justify-content-between">
//                                 <h6 className="mb-1" style={{ color: '#FF8C00' }}>{item.code_suivi}</h6>
//                                 <span className={`badge ${getStatusBadgeClass(item.statut)}`}>
//                                   {item.statut}
//                                 </span>
//                               </div>
//                               <p className="mb-1"><strong>Destinataire:</strong> {item.destinataire}</p>
//                               {item.adresse_destinataire && (
//                                 <p className="mb-1 text-muted small">
//                                   <i className="bi bi-geo-alt me-1"></i> {item.adresse_destinataire}
//                                 </p>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-center p-4 text-muted">
//                           <Package size={32} className="mb-2" />
//                           <p>Aucun colis trouvé pour ce statut</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Carte */}
//                 <div className="col-lg-7">
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-header bg-white" style={{ borderBottom: '2px solid #FFF3E0' }}>
//                       <h5 className="mb-0 d-flex align-items-center">
//                         <MapIcon className="me-2" style={{ color: '#FF8C00' }} />
//                         Localisation des Colis
//                       </h5>
//                     </div>
//                     <div className="card-body p-0" style={{ height: '500px' }}>
//                       <Map agences={agences} colis={colis} selectedState={selectedState} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Résumé des statistiques */}
//               <div className="row mt-4 g-3">
//                 <div className="col-md-3">
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-body d-flex align-items-center">
//                       <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
//                         <Package size={24} style={{ color: '#FF8C00' }} />
//                       </div>
//                       <div>
//                         <h6 className="mb-0">Total</h6>
//                         <h3 className="mb-0" style={{ color: '#FF8C00' }}>{colis.length}</h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="col-md-3">
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-body d-flex align-items-center">
//                       <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
//                         <Clock size={24} style={{ color: '#FF8C00' }} />
//                       </div>
//                       <div>
//                         <h6 className="mb-0">Enregistrés</h6>
//                         <h3 className="mb-0" style={{ color: '#FF8C00' }}>
//                           {colis.filter(c => c.statut.toLowerCase() === 'enregistre').length}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="col-md-3">
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-body d-flex align-items-center">
//                       <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
//                         <Truck size={24} style={{ color: '#FF8C00' }} />
//                       </div>
//                       <div>
//                         <h6 className="mb-0">En Transit</h6>
//                         <h3 className="mb-0" style={{ color: '#FF8C00' }}>
//                           {colis.filter(c => c.statut.toLowerCase() === 'en transit').length}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="col-md-3">
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-body d-flex align-items-center">
//                       <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
//                         <CheckCircle size={24} style={{ color: '#FF8C00' }} />
//                       </div>
//                       <div>
//                         <h6 className="mb-0">Expédiés</h6>
//                         <h3 className="mb-0" style={{ color: '#FF8C00' }}>
//                           {colis.filter(c => c.statut.toLowerCase() === 'expedie').length}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuiviColis;
// SuiviColis.tsx
import { useEffect, useState } from 'react';
import SuperadminHeader from './composants/header';
import SuperadminSidebar from './composants/sidebar';
import Map from './composants/Map';
import axios from 'axios';
import {
  Package,
  Map as MapIcon,
  Truck,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const SuiviColis = () => {
  const [colis, setColis] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('all');
  const [agences, setAgences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchColis();
  }, [selectedState, search]);

  useEffect(() => {
    fetchAgences();
  }, []);

  const fetchColis = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/colis/${selectedState}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: search,
          page: 1,
          per_page: 100,
        },
      });

      // On garde tous les colis, même sans coords
      setColis(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des colis.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgences = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/agences`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // On filtre les agences sans coordonnées valides pour la carte
      const agencesWithCoords = response.data.filter(
        (agence: any) =>
          agence.latitude && agence.longitude && agence.latitude !== 0 && agence.longitude !== 0
      );

      setAgences(agencesWithCoords);
    } catch (err) {
      console.error('Erreur lors de la récupération des agences:', err);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'enregistre':
        return <Clock />;
      case 'en transit':
        return <Truck />;
      case 'livre':
        return <Home />;
      case 'expedie':
        return <CheckCircle />;
      default:
        return <Package />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'expedie':
        return 'bg-success';
      case 'en transit':
        return 'bg-warning text-dark';
      case 'enregistre':
        return 'bg-info text-dark';
      case 'livre':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="d-flex">
      <SuperadminSidebar />
      <div className="main-content w-100 bg-light">
        <SuperadminHeader />
        <div className="container py-4">
          <div className="card shadow-sm border-0 mb-4">
            <div
              className="card-header bg-white d-flex justify-content-between align-items-center"
              style={{ borderBottom: '3px solid #FF8C00' }}
            >
              <h4 className="mb-0 d-flex align-items-center">
                <MapIcon className="me-2" style={{ color: '#FF8C00' }} />
                Suivi des Colis
              </h4>
              <div className="d-flex align-items-center">
                <Search className="me-2" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Recherche par code suivi"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="card-body">
              {/* Statut Filters */}
              <div className="status-filter mb-4">
                <div className="row g-3">
                  {['all', 'enregistre', 'en transit', 'livre', 'expedie'].map((state) => (
                    <div className="col" key={state}>
                      <div
                        className={`card border-0 cursor-pointer h-100 ${
                          selectedState === state ? 'shadow' : 'shadow-sm'
                        }`}
                        onClick={() => handleStateChange(state)}
                        style={{
                          backgroundColor:
                            selectedState === state ? '#FF8C00' : '#FFF3E0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div className="card-body p-3 text-center">
                          <div className="d-flex justify-content-center mb-2">
                            <div
                              className="rounded-circle p-2 d-flex justify-content-center align-items-center"
                              style={{
                                backgroundColor:
                                  selectedState === state
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(255,140,0,0.2)',
                                width: '40px',
                                height: '40px',
                              }}
                            >
                              {getStateIcon(state)}
                            </div>
                          </div>
                          <h6
                            className={`mb-0 ${
                              selectedState === state ? 'text-white' : 'text-dark'
                            }`}
                          >
                            {state === 'all'
                              ? 'Tout'
                              : state.charAt(0).toUpperCase() + state.slice(1)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4">
                  <AlertCircle className="me-2" />
                  {error}
                </div>
              )}

              {/* Chargement */}
              {loading && (
                <div className="text-center p-4">
                  <div className="spinner-border" style={{ color: '#FF8C00' }} role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              )}

              <div className="row g-4">
                <div className="col-lg-5">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white" style={{ borderBottom: '2px solid #FFF3E0' }}>
                      <h5 className="mb-0 d-flex align-items-center">
                        <Package className="me-2" style={{ color: '#FF8C00' }} />
                        Liste des Colis ({colis.length})
                      </h5>
                    </div>
                    <div className="card-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {colis.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {colis.map((item) => (
                            <div key={item.id} className="list-group-item border-bottom py-3">
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-1" style={{ color: '#FF8C00' }}>{item.code_suivi}</h6>
                                <span className={`badge ${getStatusBadgeClass(item.statut)}`}>
                                  {item.statut}
                                </span>
                              </div>
                              <p className="mb-1"><strong>Destinataire:</strong> {item.destinataire || item.destinataire_nom || 'non renseigne'}</p>
                              {item.adresse_destinataire && (
                                <p className="mb-1 text-muted small">{item.adresse_destinataire}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 text-muted">
                          <Package size={32} className="mb-2" />
                          <p>Aucun colis trouvé pour ce statut</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white" style={{ borderBottom: '2px solid #FFF3E0' }}>
                      <h5 className="mb-0 d-flex align-items-center">
                        <MapIcon className="me-2" style={{ color: '#FF8C00' }} />
                        Localisation
                      </h5>
                    </div>
                    <div className="card-body p-0" style={{ height: '500px' }}>
                      <Map agences={agences} colis={colis} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiviColis;
