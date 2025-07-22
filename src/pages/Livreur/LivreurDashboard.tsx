
import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner,
  Alert,
  ListGroup 
} from 'react-bootstrap';
import { 
  CheckCircleFill, 
  ClockFill, 
  BoxSeam, 
  CalendarCheck 
} from 'react-bootstrap-icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import LivreurHeader from './composants/header';
import LivreurSidebar from './composants/sidebar';

moment.locale('fr');

const LivreurDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/livreur/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Erreur de chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <LivreurHeader />
      <div className="d-flex flex-grow-1">
        <LivreurSidebar />
        <main className="flex-grow-1 p-4 main-content">
          <h2 className="mb-4 fw-bold text-orange">Tableau de Bord Livreur</h2>

          <Row className="g-4 mb-4">
            <Col md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0 orange-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <BoxSeam className="text-white fs-2 me-3" />
                    <div>
                      <Card.Title className="text-white small mb-1">
                        Colis Assignés Aujourd'hui
                      </Card.Title>
                      <h2 className="mb-0 text-white">{stats?.colis_assignes_du_jour || 0}</h2>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0 green-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <CheckCircleFill className="text-white fs-2 me-3" />
                    <div>
                      <Card.Title className="text-white small mb-1">
                        Colis Livrés Aujourd'hui
                      </Card.Title>
                      <h2 className="mb-0 text-white">{stats?.colis_livres_du_jour || 0}</h2>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0 purple-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <BoxSeam className="text-white fs-2 me-3" />
                    <div>
                      <Card.Title className="text-white small mb-1">
                        Total Colis Livrés
                      </Card.Title>
                      <h2 className="mb-0 text-white">{stats?.total_colis_livres || 0}</h2>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0 yellow-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <ClockFill className="text-white fs-2 me-3" />
                    <div>
                      <Card.Title className="text-white small mb-1">
                        Colis en Cours
                      </Card.Title>
                      <h2 className="mb-0 text-white">{stats?.colis_en_cours || 0}</h2>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-semibold text-orange">
                    <CalendarCheck className="me-2" />
                    Dernière Livraison
                  </Card.Title>
                  {stats?.derniere_livraison ? (
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Code Colis:</strong> {stats.derniere_livraison.code_suivi}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Date Livraison:</strong> {moment(stats.derniere_livraison.date_livraison).format('LLL')}
                      </ListGroup.Item>
                    </ListGroup>
                  ) : (
                    <p className="text-muted">Aucune livraison effectuée</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-semibold text-orange">
                    Performance de Livraison
                  </Card.Title>
                  <div className="d-flex align-items-center">
                    <ClockFill className="text-orange fs-2 me-3" />
                    <div>
                      <h3 className="mb-0">
                        {stats?.temps_moyen_livraison_minutes || 'N/A'}
                        <small className="text-muted fs-6 ms-1">minutes</small>
                      </h3>
                      <p className="text-muted mb-0">Temps moyen de livraison</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </main>
      </div>
    </div>
  );
};

export default LivreurDashboard;
