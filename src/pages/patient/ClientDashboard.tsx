import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, Button, 
  Spinner, Alert, Form, InputGroup, Tab, Tabs,
  Modal, ListGroup, ProgressBar, Stack
} from 'react-bootstrap';
import { 
  Search,
  Box as PackageIcon,
  GeoAlt as MapPinIcon,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  ArrowLeft,
  Funnel as FilterIcon,
  QrCode as QrCodeIcon,
  ChevronDown,
  ChevronUp,
} from 'react-bootstrap-icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as QrScanner  from '@yudiel/react-qr-scanner';
import api from '../../services/api';
import { Filter, Package } from 'lucide-react';

// Configuration de Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Package {
  id: number;
  code_suivi: string;
  destinataire_nom: string;
  poids: number;
  statut: string;
  date_creation: string;
  latitude?: number;
  longitude?: number;
  qr_code_url: string;
  agence_depart?: string;
  agence_arrivee?: string;
  destinataire_adresse?: string;
}

interface DashboardStats {
  colis_envoyes_du_jour: number;
  colis_livres_du_jour: number;
}

interface TrackingStep {
  date: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ 
    colis_envoyes_du_jour: 0, 
    colis_livres_du_jour: 0 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Package[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [daysFilter, setDaysFilter] = useState(30);
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboardData();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'tracking' && selectedPackage && mapContainerRef.current) {
      initMap();
    }
  }, [activeTab, selectedPackage, trackingSteps]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, packagesResponse] = await Promise.all([
        api.get('/client/dashboard-stats'),
        api.get('/client/colis')
      ]);
      setStats(statsResponse.data);
      setPackages(packagesResponse.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initMap = () => {
    if (!mapContainerRef.current) return;

    // Nettoyer la carte existante
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [48.8566, 2.3522], // Paris par défaut
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajouter les marqueurs pour chaque étape
    trackingSteps.forEach((step, index) => {
      if (step.latitude && step.longitude) {
        const marker = L.marker([step.latitude, step.longitude], { icon: defaultIcon }).addTo(map);
        marker.bindPopup(`
          <b>${step.status}</b><br>
          ${step.location}<br>
          ${new Date(step.date).toLocaleString()}
        `);
      }
    });

    // Ajouter une ligne de parcours si on a plusieurs points
    const validSteps = trackingSteps.filter(step => step.latitude && step.longitude);
    if (validSteps.length > 1) {
      const latLngs = validSteps.map(step => 
        L.latLng(step.latitude as number, step.longitude as number)
      );
      L.polyline(latLngs, { color: '#fd7e14' }).addTo(map);
    }

    // Ajuster la vue pour voir tous les marqueurs
    if (validSteps.length > 0) {
      const group = new L.FeatureGroup(
        validSteps.map(step => 
          L.marker([step.latitude as number, step.longitude as number], { icon: defaultIcon })
        )
      );
      map.fitBounds(group.getBounds().pad(0.2));
    }

    mapRef.current = map;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/client/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data);
      setActiveTab('search');
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setError('Erreur lors de la recherche');
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const url = `/client/history?days=${daysFilter}${statusFilter ? `&status=${statusFilter}` : ''}`;
      const res = await api.get(url);
      setPackages(res.data);
      setActiveTab('history');
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trackPackage = async (pkg: Package) => {
    try {
      setLoading(true);
      const res = await api.get(`/client/track/${pkg.code_suivi}`);
      setSelectedPackage(pkg);
      setTrackingSteps(res.data.tracking_steps);
      setActiveTab('tracking');
    } catch (err) {
      setError('Erreur lors du chargement du suivi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'livré': return 'success';
      case 'en transit': return 'primary';
      case 'en livraison': return 'info';
      case 'enregistré': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'livré': return <CheckCircle className="me-1" />;
      case 'en transit': return <Truck className="me-1" />;
      case 'en livraison': return <PackageIcon className="me-1" />;
      default: return <Clock className="me-1" />;
    }
  };

  const handleScan = (result: string | null) => {
    if (result) {
      setShowScanner(false);
      const foundPackage = [...packages, ...searchResults].find(p => p.code_suivi === result);
      if (foundPackage) {
        trackPackage(foundPackage);
      } else {
        setError('Colis non trouvé');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#fff8f0' }}>
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible className="mb-4">
          {error}
        </Alert>
      )}

      {/* Header avec recherche */}
      <Card className="mb-4 shadow-sm" style={{ borderColor: '#fd7e14' }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <h2 className="mb-0 d-flex align-items-center" style={{ color: '#fd7e14' }}>
                <PackageIcon className="me-2" />
                Tableau de bord client
              </h2>
            </Col>
            <Col md={8}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    placeholder="Rechercher un colis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderColor: '#fd7e14' }}
                  />
                  <Button 
                    variant="warning" 
                    type="submit"
                    style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
                  >
                    <Search />
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    onClick={() => setShowScanner(true)}
                    style={{ color: '#fd7e14', borderColor: '#fd7e14' }}
                  >
                    <QrCodeIcon className="me-1" />
                    Scanner
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Navigation tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'dashboard')}
        className="mb-4"
        variant="pills"
      >

        <Tab eventKey="dashboard" title="Tableau de bord">
          {/* Stats cards */}
          <Row className="mb-4 g-4">
            <Col md={6}>
              <Card style={{ borderColor: '#fd7e14' }}>
                <Card.Body>
                  <Stack direction="horizontal" gap={3}>
                    <div className="bg-warning bg-opacity-10 p-3 rounded">
                      <Package className="text-warning" size={24} />
                    </div>
                    <div>
                      <Card.Title className="text-muted mb-1">Colis envoyés</Card.Title>
                      <h3 className="mb-0" style={{ color: '#fd7e14' }}>{stats.colis_envoyes_du_jour}</h3>
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ borderColor: '#28a745' }}>
                <Card.Body>
                  <Stack direction="horizontal" gap={3}>
                    <div className="bg-success bg-opacity-10 p-3 rounded">
                      <CheckCircle className="text-success" size={24} />
                    </div>
                    <div>
                      <Card.Title className="text-muted mb-1">Colis livrés</Card.Title>
                      <h3 className="mb-0" style={{ color: '#28a745' }}>{stats.colis_livres_du_jour}</h3>
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent packages */}
          <Card className="mb-4" style={{ borderColor: '#fd7e14' }}>
            <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff3e6' }}>
              <h5 className="mb-0">Derniers colis</h5>
              <Button 
                variant="link" 
                onClick={() => {
                  setStatusFilter(null);
                  setDaysFilter(30);
                  setActiveTab('history');
                }}
                style={{ color: '#fd7e14' }}
              >
                Voir l'historique complet
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Destinataire</th>
                    <th>Poids</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.slice(0, 5).map((pkg) => (
                    <tr key={pkg.id}>
                      <td>
                        <Stack direction="horizontal" gap={2}>
                          <img 
                            src={pkg.qr_code_url} 
                            alt="QR Code" 
                            style={{ width: '24px', height: '24px' }}
                          />
                          {pkg.code_suivi}
                        </Stack>
                      </td>
                      <td>{pkg.destinataire_nom}</td>
                      <td>{pkg.poids} kg</td>
                      <td>
                        <Badge bg={getStatusBadge(pkg.statut)}>
                          {getStatusIcon(pkg.statut)}
                          {pkg.statut}
                        </Badge>
                      </td>
                      <td>{new Date(pkg.date_creation).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => trackPackage(pkg)}
                          style={{ color: '#fd7e14', borderColor: '#fd7e14' }}
                        >
                          <Eye className="me-1" />
                          Suivre
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="search" title="Résultats de recherche">
          <Card style={{ borderColor: '#fd7e14' }}>
            <Card.Header style={{ backgroundColor: '#fff3e6' }}>
              <h5 className="mb-0">Résultats pour "{searchQuery}"</h5>
            </Card.Header>
            <Card.Body>
              {searchResults.length === 0 ? (
                <div className="text-center py-5">
                  <Package size={48} className="text-muted mb-3" />
                  <p>Aucun résultat trouvé</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {searchResults.map((pkg) => (
                    <ListGroup.Item key={pkg.id}>
                      <Stack direction="horizontal" gap={3} className="align-items-center">
                        <img 
                          src={pkg.qr_code_url} 
                          alt="QR Code" 
                          style={{ width: '40px', height: '40px' }}
                        />
                        <div className="me-auto">
                          <h6 className="mb-1">{pkg.code_suivi}</h6>
                          <small className="text-muted">{pkg.destinataire_nom}</small>
                        </div>
                        <Badge bg={getStatusBadge(pkg.statut)}>
                          {pkg.statut}
                        </Badge>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => trackPackage(pkg)}
                          style={{ color: '#fd7e14', borderColor: '#fd7e14' }}
                        >
                          <Eye className="me-1" />
                          Suivre
                        </Button>
                      </Stack>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="history" title="Historique">
          <Card className="mb-4" style={{ borderColor: '#fd7e14' }}>
            <Card.Header style={{ backgroundColor: '#fff3e6' }}>
              <Stack direction="horizontal" gap={3} className="justify-content-between">
                <h5 className="mb-0">Historique des colis</h5>
                <Button 
                  variant="outline-warning" 
                  onClick={() => setShowFilters(!showFilters)}
                  style={{ color: '#fd7e14', borderColor: '#fd7e14' }}
                >
                  <Filter className="me-1" />
                  Filtres {showFilters ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </Stack>
            </Card.Header>
            {showFilters && (
              <Card.Body className="bg-light">
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Période</Form.Label>
                      <Form.Select 
                        value={daysFilter}
                        onChange={(e) => setDaysFilter(Number(e.target.value))}
                        style={{ borderColor: '#fd7e14' }}
                      >
                        <option value={7}>7 derniers jours</option>
                        <option value={30}>30 derniers jours</option>
                        <option value={90}>3 derniers mois</option>
                        <option value={365}>1 an</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Statut</Form.Label>
                      <Form.Select
                        value={statusFilter || ''}
                        onChange={(e) => setStatusFilter(e.target.value || null)}
                        style={{ borderColor: '#fd7e14' }}
                      >
                        <option value="">Tous les statuts</option>
                        <option value="Enregistré">Enregistré</option>
                        <option value="En transit">En transit</option>
                        <option value="En livraison">En livraison</option>
                        <option value="Livré">Livré</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button 
                      variant="warning" 
                      onClick={fetchHistory}
                      className="w-100"
                      style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
                    >
                      Appliquer
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            )}
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Destinataire</th>
                    <th>Poids</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.code_suivi}</td>
                      <td>{pkg.destinataire_nom}</td>
                      <td>{pkg.poids} kg</td>
                      <td>
                        <Badge bg={getStatusBadge(pkg.statut)}>
                          {pkg.statut}
                        </Badge>
                      </td>
                      <td>{new Date(pkg.date_creation).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => trackPackage(pkg)}
                          style={{ color: '#fd7e14', borderColor: '#fd7e14' }}
                        >
                          <Eye className="me-1" />
                          Suivre
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="tracking" title="Suivi">
          {selectedPackage && (
            <>
              <Button 
                variant="outline-warning" 
                onClick={() => setActiveTab('dashboard')}
                className="mb-4"
                style={{ color: '#fd7e14', borderColor: '#fd7e14' }}
              >
                <ArrowLeft className="me-1" />
                Retour
              </Button>

              <Card className="mb-4" style={{ borderColor: '#fd7e14' }}>
                <Card.Header style={{ backgroundColor: '#fff3e6' }}>
                  <Stack direction="horizontal" gap={3}>
                    <img 
                      src={selectedPackage.qr_code_url} 
                      alt="QR Code" 
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div>
                      <h5 className="mb-0">Suivi du colis</h5>
                      <small className="text-muted">{selectedPackage.code_suivi}</small>
                    </div>
                  </Stack>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6 className="mb-3">Détails du colis</h6>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <Stack direction="horizontal" className="justify-content-between">
                            <span className="text-muted">Destinataire:</span>
                            <span>{selectedPackage.destinataire_nom}</span>
                          </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Stack direction="horizontal" className="justify-content-between">
                            <span className="text-muted">Statut:</span>
                            <Badge bg={getStatusBadge(selectedPackage.statut)}>
                              {selectedPackage.statut}
                            </Badge>
                          </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Stack direction="horizontal" className="justify-content-between">
                            <span className="text-muted">Poids:</span>
                            <span>{selectedPackage.poids} kg</span>
                          </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Stack direction="horizontal" className="justify-content-between">
                            <span className="text-muted">Date d'envoi:</span>
                            <span>{new Date(selectedPackage.date_creation).toLocaleString()}</span>
                          </Stack>
                        </ListGroup.Item>
                        {selectedPackage.agence_depart && (
                          <ListGroup.Item>
                            <Stack direction="horizontal" className="justify-content-between">
                              <span className="text-muted">Agence départ:</span>
                              <span>{selectedPackage.agence_depart}</span>
                            </Stack>
                          </ListGroup.Item>
                        )}
                        {selectedPackage.agence_arrivee && (
                          <ListGroup.Item>
                            <Stack direction="horizontal" className="justify-content-between">
                              <span className="text-muted">Agence arrivée:</span>
                              <span>{selectedPackage.agence_arrivee}</span>
                            </Stack>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-3">Code QR</h6>
                      <div className="text-center">
                        <img 
                          src={selectedPackage.qr_code_url} 
                          alt="QR Code" 
                          style={{ maxWidth: '200px' }}
                          className="img-fluid border p-2"
                        />
                        <p className="text-muted mt-2">Scannez ce code pour suivre votre colis</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Row>
                <Col md={6}>
                  <Card className="mb-4" style={{ borderColor: '#fd7e14' }}>
                    <Card.Header style={{ backgroundColor: '#fff3e6' }}>
                      <h6 className="mb-0">Historique de suivi</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="timeline">
                        {trackingSteps.map((step, index) => (
                          <div key={index} className="timeline-item mb-3">
                            <div className="timeline-point" style={{ backgroundColor: '#fd7e14' }}></div>
                            <div className="timeline-content">
                              <Stack direction="horizontal" className="justify-content-between">
                                <h6 className="mb-1">{step.status}</h6>
                                <small className="text-muted">
                                  {new Date(step.date).toLocaleTimeString()}
                                </small>
                              </Stack>
                              <p className="mb-1">{step.location}</p>
                              <small className="text-muted">
                                {new Date(step.date).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card style={{ borderColor: '#fd7e14' }}>
                    <Card.Header style={{ backgroundColor: '#fff3e6' }}>
                      <h6 className="mb-0">Localisation</h6>
                    </Card.Header>
                    <Card.Body>
                      <div 
                        ref={mapContainerRef} 
                        style={{ height: '400px', width: '100%' }}
                      ></div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Tab>
      </Tabs>

      {/* QR Scanner Modal */}

 <Modal show={showScanner} onHide={() => setShowScanner(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <QrCodeIcon className="me-2" />
            Scanner un colis
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0" style={{ minHeight: '400px' }}>
          <QrScanner
            onDecode={handleScan}
            onError={(error: any) => console.error('QR Scanner error:', error)}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ width: '100%' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScanner(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClientDashboard;