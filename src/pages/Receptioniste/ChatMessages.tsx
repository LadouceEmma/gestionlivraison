import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './composants/sidebar';
import Header from './composants/header';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  is_read: boolean;
  colis_id?: number;
}

interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
}

interface Colis {
  id: number;
  nom: string;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<User | null>(null);
  const [colisSelectionne, setColisSelectionne] = useState<Colis | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [utilisateurCourant, setUtilisateurCourant] = useState<number | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [messageASupprimer, setMessageASupprimer] = useState<number | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token) as { sub: string };
        const userId = parseInt(decoded.sub, 10);
        setUtilisateurCourant(userId);
        fetchCurrentUser(userId);
      } catch (error) {
        setErreur('Erreur de décodage du token');
      }
    }
  }, []);

  const fetchCurrentUser = async (userId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurrentUserInfo(response.data);
    } catch (err) {
      console.error('Erreur de récupération de l\'utilisateur courant', err);
    }
  };

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        setChargement(true);
        const response = await axios.get<{ users: User[] }>('http://localhost:5000/api/users/chat', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUtilisateurs(response.data.users || []);
      } catch (err) {
        setErreur(err.response?.data?.error || 'Échec de la récupération des utilisateurs');
        setUtilisateurs([]);
      } finally {
        setChargement(false);
      }
    };

    fetchUtilisateurs();
  }, []);

  useEffect(() => {
    if (utilisateurSelectionne && utilisateurCourant) {
      fetchConversation(utilisateurSelectionne.id);
    }
  }, [utilisateurSelectionne, utilisateurCourant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async (userId: number) => {
    try {
      setChargement(true);
      const response = await axios.get<Message[]>(`http://localhost:5000/api/messages/conversation/${utilisateurCourant}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessages(response.data);
      setErreur(null);
    } catch (err) {
      setErreur(err.response?.data?.error || 'Échec de la récupération des messages');
      setMessages([]);
    } finally {
      setChargement(false);
    }
  };

  const envoyerMessage = async () => {
    if (!nouveauMessage.trim() || !utilisateurSelectionne || !utilisateurCourant) return;

    try {
      const messageData = {
        sender_id: utilisateurCourant,
        receiver_id: utilisateurSelectionne.id,
        content: nouveauMessage,
        colis_id: colisSelectionne?.id || null
      };

      await axios.post('http://localhost:5000/api/messages', messageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setNouveauMessage('');
      fetchConversation(utilisateurSelectionne.id);
    } catch (err) {
      setErreur(err.response?.data?.error || 'Échec de l\'envoi du message');
    }
  };

  const confirmerSuppression = (messageId: number) => {
    setMessageASupprimer(messageId);
    setShowConfirmationModal(true);
  };

  const supprimerMessage = async () => {
    if (!utilisateurCourant || !utilisateurSelectionne || !messageASupprimer) return;

    try {
      setSuppressionEnCours(true);
      await axios.delete(`http://localhost:5000/api/messages/${messageASupprimer}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      fetchConversation(utilisateurSelectionne.id);
    } catch (err) {
      setErreur(err.response?.data?.error || 'Échec de la suppression du message');
    } finally {
      setSuppressionEnCours(false);
      setShowConfirmationModal(false);
      setMessageASupprimer(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  const selectionnerUtilisateur = (utilisateur: User) => {
    setUtilisateurSelectionne(utilisateur);
    setColisSelectionne(null);
  };

  const formaterDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-3">
          <Container fluid className="h-100">
            <Row className="h-100 g-3">
              {/* Sidebar des utilisateurs */}
              <Col lg={4} xl={3} className="d-flex flex-column">
                <Card className="h-100 shadow-sm" style={{ border: 'none' }}>
                  <Card.Header 
                    className="bg-white border-bottom py-3" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      borderBottom: '1px solid #e9ecef'
                    }}
                  >
                    <div className="bg-primary #ff5722 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-users text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Conversations</h6>
                      <small className="text-muted">{utilisateurs.length} utilisateurs</small>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {chargement ? (
                      <div className="text-center p-4">
                        <Spinner animation="border" size="sm" variant="primary" />
                        <p className="mt-2 text-muted small">Chargement...</p>
                      </div>
                    ) : utilisateurs && utilisateurs.length > 0 ? (
                      <ListGroup variant="flush">
                        {utilisateurs.map(utilisateur => (
                          <ListGroup.Item
                            key={utilisateur.id}
                            action
                            active={utilisateurSelectionne?.id === utilisateur.id}
                            onClick={() => selectionnerUtilisateur(utilisateur)}
                            className="border-0 py-3 px-4"
                            style={{
                              backgroundColor: utilisateurSelectionne?.id === utilisateur.id ? '#e3f2fd' : 'transparent',
                              borderLeft: utilisateurSelectionne?.id === utilisateur.id ? '4px solid #ee8f12ff' : 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 
                              utilisateurSelectionne?.id === utilisateur.id ? '#e3f2fd' : 'transparent'}
                          >
                            <div className="d-flex align-items-center">
                              <div className="bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3"
                                   style={{ 
                                     width: '45px', 
                                     height: '45px', 
                                     background: 'linear-gradient(45deg, #ff9800, #ff5722)'
                                   }}>
                                <span className="text-white fw-bold">
                                  {utilisateur.nom.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-grow-1">
                                <div className="fw-semibold text-dark">{utilisateur.nom}</div>
                                <div className="text-muted small">
                                  <Badge bg="light" text="dark" className="me-1">
                                    {utilisateur.role}
                                  </Badge>
                                  <span className="text-success">● </span>
                                </div>
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center p-4 text-muted">
                        <i className="fas fa-user-slash fa-2x mb-3"></i>
                        <p className="mb-0">{erreur || 'Aucun utilisateur disponible'}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Zone de chat */}
              <Col lg={8} xl={9} className="d-flex flex-column">
                {utilisateurSelectionne ? (
                  <Card className="h-100 shadow-sm" style={{ border: 'none' }}>
                    {/* Header du chat */}
                    <Card.Header 
                      className="bg-white border-bottom py-3"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        borderBottom: '1px solid #e9ecef',
                        background: 'linear-gradient(45deg, #ff9800, #ff5722)',
                        color: 'white'
                      }}
                    >
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ 
                             width: '45px', 
                             height: '45px', 
                           }}>
                        <span className="text-dark fw-bold">
                          {utilisateurSelectionne.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold text-white">{utilisateurSelectionne.nom}</h6>
                        <small>
                          <Badge bg="light" text="dark" className="me-1">
                            {utilisateurSelectionne.role}
                          </Badge>
                          
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <Button variant="outline-light" size="sm" className="me-2">
                          <i className="fas fa-phone"></i>
                        </Button>
                        <Button variant="outline-light" size="sm">
                          <i className="fas fa-video"></i>
                        </Button>
                      </div>
                    </Card.Header>

                    {/* Messages */}
                    <Card.Body 
                      className="p-4"
                      style={{ 
                        height: '60vh', 
                        overflowY: 'auto',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      {chargement ? (
                        <div className="text-center">
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-2 text-muted">Chargement des messages...</p>
                        </div>
                      ) : erreur ? (
                        <div className="alert alert-danger border-0 shadow-sm">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {erreur}
                        </div>
                      ) : messages && messages.length > 0 ? (
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          {messages.map(message => {
                            const isSentByCurrentUser = message.sender_id === utilisateurCourant;
                            
                            return (
                              <div
                                key={message.id}
                                style={{
                                  display: 'flex',
                                  marginBottom: '12px',
                                  justifyContent: isSentByCurrentUser ? 'flex-end' : 'flex-start',
                                  animation: 'fadeIn 0.3s ease-out'
                                }}
                              >
                                <div
                                  style={{
                                    padding: '12px',
                                    maxWidth: '70%',
                                    borderRadius: isSentByCurrentUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                    background: isSentByCurrentUser 
                                      ? 'linear-gradient(45deg, #ff9800, #ff5722)' 
                                      : '#f1f0f0',
                                    color: isSentByCurrentUser ? 'white' : '#333',
                                    boxShadow: isSentByCurrentUser 
                                      ? '0 2px 5px rgba(255, 152, 0, 0.3)'
                                      : '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    position: 'relative'
                                  }}
                                >
                                  {isSentByCurrentUser && (
                                    <button 
                                      style={{ 
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        opacity: '0.7',
                                        color: 'rgba(255,255,255,0.7)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => confirmerSuppression(message.id)}
                                    >
                                      <i className="fas fa-trash-alt small"></i>
                                    </button>
                                  )}
                                  
                                  <div style={{ 
                                    lineHeight: '1.4',
                                    marginBottom: '8px',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    paddingRight: isSentByCurrentUser ? '20px' : '0'
                                  }}>
                                    {message.content}
                                  </div>
                                  
                                  {isSentByCurrentUser && (
                                    <div style={{ 
                                      position: 'absolute',
                                      bottom: '5px',
                                      right: '10px'
                                    }}>
                                      <i className={`fas ${message.is_read ? 'fa-check-double' : 'fa-check'} small`} 
                                         style={{ color: 'rgba(255,255,255,0.7)' }}></i>
                                    </div>
                                  )}
                                  
                                  <div style={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.75rem',
                                    color: isSentByCurrentUser ? 'rgba(255,255,255,0.7)' : '#6c757d'
                                  }}>
                                    <span style={{ fontWeight: '500' }}>
                                      {isSentByCurrentUser ? 'Vous' : message.sender.nom}
                                    </span>
                                    <span style={{ marginLeft: '8px' }}>{formaterDate(message.timestamp)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      ) : (
                        <div style={{ 
                          textAlign: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          color: '#6c757d'
                        }}>
                          <div>
                            <i className="fas fa-comments fa-3x mb-3"></i>
                            <p className="mb-0">Aucun message dans cette conversation</p>
                            <small>Commencez la conversation en envoyant un message</small>
                          </div>
                        </div>
                      )}
                    </Card.Body>

                    {/* Input pour nouveau message */}
                    <Card.Footer 
                      className="bg-white border-top p-4"
                      style={{ borderTop: '1px solid #e9ecef' }}
                    >
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1 me-3">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={nouveauMessage}
                            onChange={(e) => setNouveauMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Tapez votre message ici..."
                            style={{
                              resize: 'none',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '20px',
                              padding: '12px 16px',
                              border: 'none',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                          />
                        </div>
                        <div className="d-flex flex-column">
                          <Button
                            variant="primary"
                            onClick={envoyerMessage}
                            disabled={!nouveauMessage.trim() || !utilisateurSelectionne}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '45px',
                              height: '45px',
                              background: 'linear-gradient(45deg, #ff9800, #ff5722)',
                              border: 'none',
                              boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
                            }}
                          >
                            <i className="fas fa-paper-plane"></i>
                          </Button>
                        </div>
                      </div>
                    </Card.Footer>
                  </Card>
                ) : (
                  <Card className="h-100 d-flex justify-content-center align-items-center shadow-sm" 
                        style={{ border: 'none' }}>
                    <Card.Body className="text-center text-muted py-5">
                      <div className="mb-4">
                        <i className="fas fa-comment-alt fa-4x text-muted mb-3"></i>
                        <h5 className="text-dark mb-2">Bienvenue dans votre messagerie</h5>
                        <p className="text-muted">Sélectionnez un utilisateur pour commencer une conversation</p>
                      </div>
                      <div className="d-flex justify-content-center">
                        <div className="bg-light rounded-pill px-4 py-2">
                          <i className="fas fa-arrow-left me-2"></i>
                          <span>Choisissez un contact</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </Container>
        </main>
      </div>

      {/* Modal de confirmation de suppression */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={supprimerMessage}
            disabled={suppressionEnCours}
          >
            {suppressionEnCours ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Suppression...</span>
              </>
            ) : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Ajout du CSS d'animation directement dans le DOM */}
      <style>
        {`
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(10px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .sent-message {
            background: linear-gradient(45deg, #ff9800, #ff5722);
            color: white;
          }
          
          .received-message {
            background: #f1f0f0;
            color: #333;
          }
        `}
      </style>
    </div>
  );
};

export default ChatApp;