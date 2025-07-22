import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from './composants/sidebar';
import ManagerHeader from './composants/header';

// Interface pour les données de l'utilisateur
interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
}

// Interface pour le formulaire de réinitialisation de mot de passe
interface ResetPasswordForm {
  identifiant: string;
  reset_code: string;
  new_password: string;
}

// Interface pour l'état de chargement
interface LoadingState {
  profile: boolean;
  resetCode: boolean;
  resetPassword: boolean;
}

const ManagerProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<LoadingState>({
    profile: false,
    resetCode: false,
    resetPassword: false,
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetForm, setResetForm] = useState<ResetPasswordForm>({
    identifiant: '',
    reset_code: '',
    new_password: '',
  });

  // Configuration d'axios avec le token JWT
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  // Récupérer les informations de l'utilisateur connecté
  const fetchUserProfile = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));
    setError('');
    setSuccess('');

    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      setResetForm((prev) => ({ ...prev, identifiant: response.data.email }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // Demander un code de réinitialisation
  const handleRequestResetCode = async () => {
    setLoading((prev) => ({ ...prev, resetCode: true }));
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/forgot-password', {
        identifiant: resetForm.identifiant,
      });
      setSuccess(response.data.message || 'Code de réinitialisation envoyé');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading((prev) => ({ ...prev, resetCode: false }));
    }
  };

  // Réinitialiser le mot de passe
  const handleResetPassword = async () => {
    setLoading((prev) => ({ ...prev, resetPassword: true }));
    setError('');
    setSuccess('');

    if (!resetForm.identifiant || !resetForm.reset_code || !resetForm.new_password) {
      setError('Tous les champs sont requis');
      setLoading((prev) => ({ ...prev, resetPassword: false }));
      return;
    }

    try {
      const response = await api.post('/reset-password', resetForm);
      setSuccess(response.data.message || 'Mot de passe réinitialisé avec succès');
      setShowResetModal(false);
      setResetForm((prev) => ({ ...prev, reset_code: '', new_password: '' }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
    }
  };

  // Charger le profil au montage du composant
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Gestion des changements dans le formulaire
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fff' }}>
      <ManagerHeader />
      
      <div className="d-flex flex-grow-1">
        <ManagerSidebar />
        
        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#fffaf0' }}>
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <h2 style={{ color: '#e67e22' }}>Profil Utilisateur</h2>
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

            {success && (
              <Row className="mb-3">
                <Col>
                  <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                    {success}
                  </Alert>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <Card className="mb-4 shadow-sm" style={{ borderColor: '#e67e22' }}>
                  <Card.Header style={{ backgroundColor: '#e67e22', color: 'white' }}>
                    <h5>Informations du Profil</h5>
                  </Card.Header>
                  <Card.Body style={{ backgroundColor: '#fff' }}>
                    {loading.profile ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" variant="warning" />
                      </div>
                    ) : user ? (
                      <ListGroup variant="flush">
                        <ListGroup.Item className="bg-transparent">
                          <strong>Nom :</strong> {user.nom}
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent">
                          <strong>Email :</strong> {user.email}
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent">
                          <strong>Rôle :</strong> {user.role}
                        </ListGroup.Item>
                      </ListGroup>
                    ) : (
                      <Alert variant="info">Aucune information de profil disponible</Alert>
                    )}
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        variant="warning"
                        onClick={() => setShowResetModal(true)}
                        style={{ backgroundColor: '#e67e22', borderColor: '#e67e22', color: 'white' }}
                      >
                        Réinitialiser le mot de passe
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>

      {/* Modal pour réinitialisation du mot de passe */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#e67e22', color: 'white' }}>
          <Modal.Title>Réinitialiser le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fff' }}>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="identifiant"
                    value={resetForm.identifiant}
                    onChange={handleFormChange}
                    placeholder="Entrez votre email"
                    disabled={loading.resetCode || loading.resetPassword}
                  />
                </Form.Group>
                <Button
                  variant="outline-warning"
                  onClick={handleRequestResetCode}
                  disabled={loading.resetCode || !resetForm.identifiant}
                  className="mb-3"
                >
                  {loading.resetCode ? <Spinner size="sm" /> : 'Envoyer le code de réinitialisation'}
                </Button>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code de réinitialisation</Form.Label>
                  <Form.Control
                    type="text"
                    name="reset_code"
                    value={resetForm.reset_code}
                    onChange={handleFormChange}
                    placeholder="Entrez le code reçu"
                    disabled={loading.resetPassword}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={resetForm.new_password}
                    onChange={handleFormChange}
                    placeholder="Entrez le nouveau mot de passe"
                    disabled={loading.resetPassword}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#fff' }}>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Annuler
          </Button>
          <Button
            variant="warning"
            onClick={handleResetPassword}
            disabled={loading.resetPassword || !resetForm.identifiant || !resetForm.reset_code || !resetForm.new_password}
            style={{ backgroundColor: '#e67e22', borderColor: '#e67e22', color: 'white' }}
          >
            {loading.resetPassword ? <Spinner size="sm" animation="border" /> : 'Réinitialiser'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerProfilePage;