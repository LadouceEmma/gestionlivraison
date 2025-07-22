import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Card, Badge, Row, Col } from 'react-bootstrap';
import { ArrowLeft, GeoAlt, ClockHistory } from 'react-bootstrap-icons';
import api from '../../services/api';
import MapView from './composants/MapView';
import Sidebar from './composants/sidebar';

interface TrackingStep {
  date: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

interface PackageDetails {
  id: number;
  code_suivi: string;
  statut: string;
  destinataire_nom: string;
  destinataire_adresse: string;
}

const ClientSuivi: React.FC = () => {
  const { code_suivi } = useParams<{ code_suivi: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [trackingData, setTrackingData] = useState<{
    package: PackageDetails;
    tracking_steps: TrackingStep[];
    map_center?: { lat: number; lng: number };
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!code_suivi) {
          throw new Error('Code de suivi invalide.');
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Session expirée, veuillez vous reconnecter.');
        }

        const response = await api.get(
          `/client/track/${encodeURIComponent(code_suivi)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.data.package) {
          throw new Error('Aucun colis trouvé pour ce code de suivi.');
        }

        setTrackingData(response.data);
      } catch (err: any) {
        console.error(err);

        let errorMessage = 'Erreur lors du chargement des données.';
        if (err.response?.status === 401) {
          errorMessage = 'Session expirée, veuillez vous reconnecter.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Colis introuvable.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login', {
            state: { from: location.pathname, error: errorMessage },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [code_suivi, navigate, location]);

  if (loading) {
    return (
      <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
        {/* <ReceptionistHeader /> */}
        <div className="d-flex flex-grow-2">
          <Sidebar />
          <main
            className="flex-grow-1 p-3 p-md-4 d-flex justify-content-center align-items-center"
            style={{ minHeight: '80vh' }}
          >
            <Spinner animation="border" variant="primary" />
            <span className="ms-3">Chargement du suivi...</span>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <div className="d-flex gap-3">
          <Button variant="primary" onClick={() => navigate('/login')}>
            Se connecter
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </Container>
    );
  }

  if (!trackingData) {
    return null;
  }

  return (
   <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <div className="d-flex flex-grow-2">
        <Sidebar />
        <main className="flex-grow-1 p-3 p-md-4">
      <Button variant="outline-primary" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="me-2" /> Retour
      </Button>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Suivi du colis : {trackingData.package.code_suivi}</h4>
          <Badge
            bg={
              trackingData.package.statut === 'Livré'
                ? 'success'
                : trackingData.package.statut === 'En livraison'
                ? 'warning'
                : 'primary'
            }
          >
            {trackingData.package.statut}
          </Badge>
        </Card.Header>
      </Card>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>
                <GeoAlt className="me-2" />
                Localisation
              </h5>
            </Card.Header>
            <Card.Body style={{ height: '400px' }}>
              <MapView
                steps={trackingData.tracking_steps.filter(
                  (step) => step.latitude && step.longitude
                )}
                defaultCenter={trackingData.map_center}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5>
                <ClockHistory className="me-2" />
                Historique
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                {trackingData.tracking_steps.map((step, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <strong>{step.status}</strong>
                      <p className="mb-1 small">{step.location}</p>
                      <small className="text-muted">
                        {new Date(step.date).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5>Détails du colis</h5>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Destinataire:</strong> {trackingData.package.destinataire_nom}
          </p>
          <p>
            <strong>Adresse:</strong> {trackingData.package.destinataire_adresse}
          </p>
        </Card.Body>
      </Card>
    </main>
    </div>
    </div>
  );
};

export default ClientSuivi;
