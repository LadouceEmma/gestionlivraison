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

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Configuration d'axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api'  // Ajout du préfixe /livreur
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

const LivreurSuivi = () => {
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
  const [validated, setValidated] = useState(false);
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
      let errorMessage = 'Erreur de chargement des colis';
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        errorMessage = err.response.data?.error || err.message || errorMessage;
      }
      setError(errorMessage);
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
        
        // Convertir en float pour l'envoi
        api.post('/position', { 
          latitude: parseFloat(latitude), 
          longitude: parseFloat(longitude) 
        })
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
      const payload = {
        ...locationData,
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude)
      };
      await api.post(`/colis/${selectedColis.code_suivi}/demarrer`, payload);
      fetchColisAssignes();
      setShowStartModal(false);
    } catch (err) {
      let errorMessage = 'Erreur de démarrage de la livraison';
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        errorMessage = err.response.data?.error || err.message || errorMessage;
      }
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
      const payload = {
        ...locationData,
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude)
      };
      await api.post(`/colis/${selectedColis.code_suivi}/livrer`, payload);
      fetchColisAssignes();
      setShowDeliverModal(false);
    } catch (err) {
      let errorMessage = 'Erreur lors de la livraison';
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        errorMessage = err.response.data?.error || err.message || errorMessage;
      }
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
                  required
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
                  required
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

export default LivreurSuivi;