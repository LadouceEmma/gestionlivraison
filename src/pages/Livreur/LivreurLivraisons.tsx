import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
  Modal,
} from 'react-bootstrap';
import LivreurHeader from './composants/header';
import LivreurSidebar from './composants/sidebar';

const LivreurHistorique = () => {
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentColis, setCurrentColis] = useState(null);
  const [currentAction, setCurrentAction] = useState('');

  const fetchHistorique = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/historique', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColis(res.data.historique_colis);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (colis, action) => {
    setCurrentColis(colis);
    setCurrentAction(action);
    setShowModal(true);
  };

  const changerStatut = async () => {
    if (!currentColis || !currentAction) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/colis/${currentColis.code_suivi}/changer-statut`,
        { statut: currentAction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHistorique(); // Rafraîchir la liste
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du changement de statut');
    }
  };

  useEffect(() => {
    fetchHistorique();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <LivreurSidebar />
      <Container fluid className="py-4">
        <LivreurHeader />
        <h3 className="mb-4 text-orange">📦 Historique des Livraisons</h3>
        <Row>
          {colis.map((item) => (
            <Col md={6} lg={4} key={item.id} className="mb-3">
              <Card className="shadow border-0">
                <Card.Body>
                  <Card.Title className="text-orange fw-bold">{item.code_suivi}</Card.Title>
                  <p className="mb-1"><strong>📍 Agence Départ:</strong> {item.agence_depart || 'N/A'}</p>
                  <p className="mb-1"><strong>🏁 Agence Arrivée:</strong> {item.agence_arrivee || 'N/A'}</p>
                  <Badge bg={
                    item.statut === 'Livré' ? 'success' :
                    item.statut === 'En livraison' ? 'warning' : 'secondary'
                  } className="mb-2">
                    {item.statut}
                  </Badge>
                  <div className="mt-3 d-flex gap-2">
                    {item.statut === 'En transit' && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleActionClick(item, 'En livraison')}
                      >
                        🚚 Démarrer Livraison
                      </Button>
                    )}
                    {item.statut === 'En livraison' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleActionClick(item, 'Livré')}
                      >
                        ✅ Marquer comme Livré
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* MODAL de confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l’action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Voulez-vous vraiment changer le statut de <strong>{currentColis?.code_suivi}</strong> en <strong>{currentAction}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="warning" onClick={changerStatut}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LivreurHistorique;
