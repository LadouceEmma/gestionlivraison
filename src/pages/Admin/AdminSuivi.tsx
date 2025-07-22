import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { 
  Card, 
  Button, 
  Table, 
  Alert, 
  Spinner, 
  Badge,
  ListGroup,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


// Interfaces
interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
}

interface Agence {
  id: number;
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
}

interface Suivi {
  id: number;
  date_heure: string;
  statut: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  commentaire?: string;
  user: User;
}

interface Colis {
  id: number;
  code_suivi: string;
  statut: string;
  client_id?: number;
  destinataire_nom: string;
  destinataire_adresse: string;
  agence_depart: number;
  agence_arrivee: number;
  latitude?: number;
  longitude?: number;
  suivis?: Suivi[];
  receptionniste_id?: number;
  poids?: number;
  valeur?: number;
  contenu?: string;
  livraison?: string;
}

interface LoadingState {
  list: boolean;
}

// Configuration des icônes Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import AdminSidebar from './composants/sidebar';
import AdminHeader from './composants/header';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Icônes personnalisées
const colisIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2748/2748558.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const agenceDepartIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41]
});

const agenceArriveeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41]
});

const agenceIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [25, 25]
});

// Hiérarchie des statuts
const statusHierarchy = [
  'Enregistré', 
  'En transit', 
  'Expédié', 
  'En livraison', 
  'Livré', 
  'Retourné'
];

// Délimitation du Cameroun
const CAMEROON_BOUNDS = L.latLngBounds(
  L.latLng(1.65, 8.45),
  L.latLng(13.08, 16.20)
);
const CAMEROON_CENTER = [7.37, 12.35];

// Composant pour contraindre la carte au Cameroun
function CameroonBounds() {
  const map = useMap();
  
  useEffect(() => {
    map.setMaxBounds(CAMEROON_BOUNDS);
    map.on('drag', () => {
      map.panInsideBounds(CAMEROON_BOUNDS, { animate: false });
    });
  }, [map]);

  return null;
}

const AdminSuivi= () => {
  const navigate = useNavigate();
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [agences, setAgences] = useState<Agence[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    list: false
  });
  const [error, setError] = useState('');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Couleurs des badges selon statut
  const statusColors: Record<string, string> = {
    'Enregistré': 'warning',
    'En transit': 'info',
    'Expédié': 'info',
    'En livraison': 'primary',
    'Livré': 'success',
    'Retourné': 'danger'
  };

  // Trouver une agence par son ID
  const findAgenceById = (id: number): Agence | undefined => {
    return agences.find(agence => agence.id === id);
  };

  // Fonction de calcul de distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Estimation du temps restant
  const estimateRemainingTime = (statut: string, distance: number): string => {
    if (statut === 'Livré') return '✅ Livraison effectuée';
    if (statut === 'Retourné') return '🔄 Colis retourné';
    
    const vitesseMoyenne = 60;
    const heures = distance / vitesseMoyenne;
    
    if (heures < 0.5) return '🛵 Livraison imminente (moins de 30 min)';
    if (heures < 1) return '🚙 Livraison dans moins d\'1 heure';
    if (heures < 2) return '🚚 Livraison dans 1-2 heures';
    if (heures < 24) return `⏳ Livraison prévue dans ${Math.round(heures)} heures`;
    
    const jours = Math.round(heures / 24);
    if (jours === 1) return '📅 Livraison prévue demain';
    return `📅 Livraison prévue dans ${jours} jours`;
  };

  // Calcul des informations de distance
  const calculateDistanceInfo = (colis: Colis): string => {
    const agenceDepart = findAgenceById(colis.agence_depart);
    const agenceArrivee = findAgenceById(colis.agence_arrivee);

    if (!agenceDepart || !agenceArrivee || !colis.latitude || !colis.longitude) {
      return 'Informations de trajet non disponibles';
    }

    const totalDistance = calculateDistance(
      agenceDepart.latitude, 
      agenceDepart.longitude,
      agenceArrivee.latitude,
      agenceArrivee.longitude
    );

    const distanceParcourue = calculateDistance(
      agenceDepart.latitude,
      agenceDepart.longitude,
      colis.latitude,
      colis.longitude
    );

    const distanceRestante = calculateDistance(
      colis.latitude,
      colis.longitude,
      agenceArrivee.latitude,
      agenceArrivee.longitude
    );

    const progression = Math.round((distanceParcourue / totalDistance) * 100);

    return `
      <div class="distance-info">
        <div class="distance-total">📏 <strong>Distance totale:</strong> ${totalDistance.toFixed(1)} km</div>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progression}%"></div>
        </div>
        <div class="distance-details">
          <span class="distance-parcourue">✅ ${distanceParcourue.toFixed(1)} km parcourus (${progression}%)</span>
          <span class="distance-restante">⏳ ${distanceRestante.toFixed(1)} km restants</span>
        </div>
        <div class="temps-restant">⏱ ${estimateRemainingTime(colis.statut, distanceRestante)}</div>
      </div>
    `;
  };

  // Chargement des données
  const fetchColis = async () => {
    setLoading(prev => ({...prev, list: true}));
    setError('');
    
    try {
      const response = await api.get('/colis/receptionniste');
      setColisList(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erreur lors du chargement des colis');
    } finally {
      setLoading(prev => ({...prev, list: false}));
    }
  };

  const fetchAgences = async () => {
    try {
      const response = await api.get('/agences');
      setAgences(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des agences:', err);
    }
  };

  useEffect(() => {
    fetchColis();
    fetchAgences();
  }, []);

  const handleViewHistory = () => {
    if (selectedColis?.code_suivi) {
      navigate(`/colis/historique/admin`);
    }
  };

  const renderAgenceInfo = (id: number): string => {
    const agence = findAgenceById(id);
    return agence ? `${agence.nom} (${agence.adresse})` : 'Non disponible';
  };

  const isValidCameroonCoordinate = (lat?: number, lng?: number): boolean => {
    if (!lat || !lng) return false;
    return (
      lat >= CAMEROON_BOUNDS.getSouth() && 
      lat <= CAMEROON_BOUNDS.getNorth() &&
      lng >= CAMEROON_BOUNDS.getWest() && 
      lng <= CAMEROON_BOUNDS.getEast()
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fff' }}>
      <AdminHeader />
      
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        
        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#fffaf0' }}>
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <h2 style={{ color: '#e67e22' }}>Suivi des Colis</h2>
              </Col>
            </Row>

            {error && (
              <Row className="mb-3">
                <Col>
                  <Alert variant="warning" onClose={() => setError('')} dismissible>
                    {error}
                  </Alert>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={5}>
                <Card className="mb-4 shadow-sm" style={{ borderColor: '#e67e22' }}>
                  <Card.Header className="d-flex justify-content-between align-items-center" 
                    style={{ backgroundColor: '#e67e22', color: 'white' }}>
                    <h5 className="mb-0">Liste des Colis</h5>
                    <Button 
                      variant="light" 
                      onClick={fetchColis} 
                      disabled={loading.list}
                      style={{ color: '#e67e22' }}
                    >
                      {loading.list ? <Spinner size="sm" /> : 'Rafraîchir'}
                    </Button>
                  </Card.Header>
                  
                  <Card.Body style={{ backgroundColor: '#fff' }}>
                    {loading.list ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" variant="warning" />
                      </div>
                    ) : colisList.length > 0 ? (
                      <Table striped hover responsive>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Destinataire</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {colisList.map(colis => (
                            <tr key={colis.id}>
                              <td>{colis.code_suivi}</td>
                              <td>{colis.destinataire_nom}</td>
                              <td>
                                <Badge pill bg={statusColors[colis.statut] || 'secondary'}>
                                  {colis.statut}
                                </Badge>
                              </td>
                              <td>
                                <Button 
                                  size="sm" 
                                  variant="outline-warning"
                                  onClick={() => setSelectedColis(colis)}
                                >
                                  Suivi
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">Aucun colis disponible</Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={7}>
                <Row>
                  <Col>
                    <Card className="mb-4 shadow-sm" style={{ borderColor: '#e67e22' }}>
                      <Card.Header style={{ backgroundColor: '#e67e22', color: 'white' }}>
                        <h5>Localisation du colis</h5>
                      </Card.Header>
                      <Card.Body className="p-0" style={{ height: '400px', backgroundColor: '#fff' }}>
                        {selectedColis ? (
                          <MapContainer 
                            center={
                              isValidCameroonCoordinate(selectedColis.latitude, selectedColis.longitude)
                                ? [selectedColis.latitude!, selectedColis.longitude!]
                                : findAgenceById(selectedColis.agence_depart)?.latitude
                                  ? [findAgenceById(selectedColis.agence_depart)!.latitude, findAgenceById(selectedColis.agence_depart)!.longitude]
                                  : CAMEROON_CENTER
                            }
                            zoom={7}
                            style={{ height: '100%' }}
                            minZoom={6}
                          >
                            <CameroonBounds />
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; OpenStreetMap'
                            />

                            {/* Affichage de toutes les agences */}
                            {agences.map(agence => (
                              <Marker
                                key={`agence-${agence.id}`}
                                position={[agence.latitude, agence.longitude]}
                                icon={agenceIcon}
                              >
                                <Popup>
                                  <strong>🏢 {agence.nom}</strong><br />
                                  {agence.adresse}
                                </Popup>
                              </Marker>
                            ))}

                            {/* Agence de départ */}
                            {findAgenceById(selectedColis.agence_depart) && (
                              <Marker 
                                position={[
                                  findAgenceById(selectedColis.agence_depart)!.latitude,
                                  findAgenceById(selectedColis.agence_depart)!.longitude
                                ]}
                                icon={agenceDepartIcon}
                              >
                                <Popup>
                                  <strong>🟦 Agence de Départ</strong><br />
                                  {findAgenceById(selectedColis.agence_depart)!.nom}<br />
                                  {findAgenceById(selectedColis.agence_depart)!.adresse}
                                </Popup>
                              </Marker>
                            )}

                            {/* Agence d'arrivée */}
                            {findAgenceById(selectedColis.agence_arrivee) && (
                              <Marker 
                                position={[
                                  findAgenceById(selectedColis.agence_arrivee)!.latitude,
                                  findAgenceById(selectedColis.agence_arrivee)!.longitude
                                ]}
                                icon={agenceArriveeIcon}
                              >
                                <Popup>
                                  <strong>🟩 Agence d'Arrivée</strong><br />
                                  {findAgenceById(selectedColis.agence_arrivee)!.nom}<br />
                                  {findAgenceById(selectedColis.agence_arrivee)!.adresse}
                                </Popup>
                              </Marker>
                            )}

                            {/* Position actuelle du colis */}
                            {isValidCameroonCoordinate(selectedColis.latitude, selectedColis.longitude) && (
                              <Marker 
                                position={[selectedColis.latitude!, selectedColis.longitude!]}
                                icon={colisIcon}
                              >
                                <Popup>
                                  <strong>📦 Colis {selectedColis.code_suivi}</strong><br />
                                  Statut: <Badge bg={statusColors[selectedColis.statut]}>{selectedColis.statut}</Badge><br />
                                  Position actuelle: {selectedColis.destinataire_adresse || 'Localisation inconnue'}<br />
                                  <div dangerouslySetInnerHTML={{ __html: calculateDistanceInfo(selectedColis) }} />
                                </Popup>
                              </Marker>
                            )}

                            {/* Lignes de trajet */}
                            {findAgenceById(selectedColis.agence_depart) && 
                             findAgenceById(selectedColis.agence_arrivee) &&
                             isValidCameroonCoordinate(selectedColis.latitude, selectedColis.longitude) && (
                              <>
                                <Polyline
                                  positions={[
                                    [findAgenceById(selectedColis.agence_depart)!.latitude, findAgenceById(selectedColis.agence_depart)!.longitude],
                                    [selectedColis.latitude!, selectedColis.longitude!]
                                  ]}
                                  color="blue"
                                  weight={3}
                                />
                                <Polyline
                                  positions={[
                                    [selectedColis.latitude!, selectedColis.longitude!],
                                    [findAgenceById(selectedColis.agence_arrivee)!.latitude, findAgenceById(selectedColis.agence_arrivee)!.longitude]
                                  ]}
                                  color="green"
                                  weight={3}
                                  dashArray="5, 5"
                                />
                              </>
                            )}
                          </MapContainer>
                        ) : (
                          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%', backgroundColor: '#fff' }}>
                            <p className="text-muted">Sélectionnez un colis pour voir sa localisation</p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {selectedColis && (
                  <>
                    <Row>
                      <Col>
                        <Card className="shadow-sm mb-4" style={{ borderColor: '#e67e22' }}>
                          <Card.Header className="d-flex justify-content-between align-items-center" 
                            style={{ backgroundColor: '#e67e22', color: 'white' }}>
                            <h5>Détails du colis {selectedColis.code_suivi}</h5>
                            <Button 
                              variant="light"
                              onClick={handleViewHistory}
                              style={{ color: '#e67e22' }}
                            >
                              Voir l'historique complet
                            </Button>
                          </Card.Header>
                          <Card.Body style={{ backgroundColor: '#fff' }}>
                            <Row>
                              <Col md={6}>
                                <ListGroup variant="flush">
                                  <ListGroup.Item className="bg-transparent">
                                    <strong>Client ID:</strong> {selectedColis.client_id?.nom || 'Non spécifié'}
                                  </ListGroup.Item>
                                  <ListGroup.Item className="bg-transparent">
                                    <strong>Destinataire:</strong> {selectedColis.destinataire_nom}
                                  </ListGroup.Item>
                                  <ListGroup.Item className="bg-transparent">
                                    <strong>Adresse:</strong> {selectedColis.destinataire_adresse || 'Non spécifiée'}
                                  </ListGroup.Item>
                                </ListGroup>
                              </Col>
                              <Col md={6}>
                                <ListGroup variant="flush">
                                  <ListGroup.Item className="bg-transparent">
                                    <strong>Statut:</strong> 
                                    <Badge pill bg={statusColors[selectedColis.statut] || 'secondary'}>
                                      {selectedColis.statut}
                                    </Badge>
                                  </ListGroup.Item>
                                  <ListGroup.Item className="bg-transparent">
                                    <strong>Agence départ:</strong> {renderAgenceInfo(selectedColis.agence_depart)}
                                  </ListGroup.Item>
                                  <ListGroup.Item className="bg-transparent">
                                    <strong>Agence arrivée:</strong> {renderAgenceInfo(selectedColis.agence_arrivee)}
                                  </ListGroup.Item>
                                </ListGroup>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default AdminSuivi;