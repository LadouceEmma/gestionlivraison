import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Alert, Spinner, Card, Row, Col, Image } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReceptionistSidebar from './composants/sidebar';
import ReceptionistHeader from './composants/header';
import monColis from '../../images/monColis.jpg';

interface User {
  id: number;
  nom: string;
  telephone: string;
  email?: string;
}

interface Colis {
  id: number;
  code_suivi: string;
  agence_depart: number | null;
  agence_arrivee: number | null;
  client_id: number;
  receptionniste_id: number;
  poids: number;
  valeur: number;
  contenu: string;
  livraison: boolean;
  destinataire_nom: string;
  destinataire_telephone: string;
  destinataire_adresse: string;
  statut: 'Enregistré' | 'En transit' | 'En cours de livraison' | 'Assigné' | 'Livré' | 'Expedié';
  date_envoi: string | null;
}

interface Agence {
  id: number;
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  email: string;
}

const useApi = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

const initialFormData = {
  client_id: '',
  agence_arrivee: '',
  poids: '',
  valeur: '',
  contenu: '',
  destinataire_nom: '',
  destinataire_telephone: '',
  livraison: false,
  destinataire_adresse: ''
};

const ColisPage: React.FC = () => {
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [agences, setAgences] = useState<Agence[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [currentUser] = useState<User | null>(null);
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [loading, setLoading] = useState({
    list: false,
    agences: false,
    clients: false,
    submit: false,
    newClient: false,
    user: false
  });
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    nom: '',
    telephone: '',
    email: ''
  });
  const [formData, setFormData] = useState(initialFormData);
  const factureRef = useRef<HTMLDivElement>(null);
  const api = useApi();

  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true, agences: true, clients: true, user: true }));
      
      const [colisRes, agencesRes, clientsRes] = await Promise.all([
        api.get('/colis/receptionniste'),
        api.get('/agences'),
        api.get('/users/clients'),
        
      ]);
      
      setColisList(colisRes.data);
      setAgences(agencesRes.data);
      setClients(clientsRes.data);
  
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors du chargement des données', 
        type: 'danger' 
      });
    } finally {
      setLoading(prev => ({ ...prev, list: false, agences: false, clients: false, user: false }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewClientSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newClientData.nom || !newClientData.telephone) {
      setMessage({ text: 'Nom et téléphone obligatoires', type: 'danger' });
      return;
    }

    setLoading(prev => ({ ...prev, newClient: true }));
    
    try {
      const res = await api.post('/create-clients', {
        nom: newClientData.nom,
        telephone: newClientData.telephone,
        email: newClientData.email || undefined
      });

      if (res.data.success) {
        setClients(prev => [...prev, res.data.client]);
        setFormData(prev => ({ ...prev, client_id: res.data.client.id.toString() }));
        setShowNewClientModal(false);
        setMessage({ text: res.data.message, type: 'success' });
      }
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors de la création du client', 
        type: 'danger'
      });
    } finally {
      setLoading(prev => ({ ...prev, newClient: false }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const payload = {
        client_id: parseInt(formData.client_id),
        agence_arrivee: parseInt(formData.agence_arrivee),
        poids: parseFloat(formData.poids),
        valeur: parseFloat(formData.valeur || '0'),
        contenu: formData.contenu,
        destinataire_nom: formData.destinataire_nom,
        destinataire_telephone: formData.destinataire_telephone,
        livraison: formData.livraison,
        destinataire_adresse: formData.livraison ? formData.destinataire_adresse : null,
        receptionniste_id: currentUser?.id
      };

      const res = await api.post('/colis', payload);

      if (res.data.success) {
        setColisList(prev => [res.data.colis, ...prev]);
        setMessage({ text: 'Colis créé avec succès', type: 'success' });
        setShowFormModal(false);
        setFormData(initialFormData);
      }
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors de la création', 
        type: 'danger'
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };
  // Ajouter ces fonctions dans votre composant
const handleAddTracking = async (colis: Colis) => {
  const newStatus = prompt("Entrez le nouveau statut:", colis.statut);
  if (newStatus && newStatus !== colis.statut) {
    try {
      await api.post('/suivi/colis/' + colis.code_suivi, {
        colis_id: colis.id,
        statut: newStatus,
        commentaire: `Mise à jour manuelle par ${currentUser?.nom}`
      });
      setMessage({ text: 'Statut mis à jour', type: 'success' });
      fetchData(); // Rafraîchir les données
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors de la mise à jour', 
        type: 'danger'
      });
    }
  }
};

const handleDeleteColis = async (colisId: number) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce colis ?")) {
    try {
      await api.delete(`/colis/${colisId}`);
      setMessage({ text: 'Colis supprimé', type: 'success' });
      setColisList(prev => prev.filter(c => c.id !== colisId));
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors de la suppression', 
        type: 'danger'
      });
    }
  }
};

  const calculateTotal = (colis: Colis) => {
    const transportCost = colis.poids * 500;
    const assuranceCost = colis.valeur * 0.01;
    const livraisonCost = colis.livraison ? 5000 : 0;
    return transportCost + assuranceCost + livraisonCost;
  };

  const printFacture = () => {
    if (factureRef.current && selectedColis) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <title>Facture ${selectedColis.code_suivi}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 15px; 
                  color: #333;
                  font-size: 14px;
                }
                .header { 
                  text-align: center; 
                  margin-bottom: 15px; 
                  padding-bottom: 10px;
                  border-bottom: 2px solid #fd7e14;
                }
                .logo { 
                  max-height: 60px; 
                  margin-bottom: 5px; 
                }
                .invoice-info { 
                  display: flex; 
                  justify-content: space-between; 
                  margin-bottom: 15px;
                  flex-wrap: wrap;
                }
                .invoice-info > div {
                  flex: 1;
                  min-width: 200px;
                }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin-bottom: 15px;
                  font-size: 13px;
                }
                th { 
                  background-color: #fd7e14; 
                  color: white; 
                  padding: 8px; 
                  text-align: left; 
                }
                td { 
                  padding: 8px; 
                  border-bottom: 1px solid #ddd; 
                }
                .total-row { 
                  font-weight: bold; 
                  background-color: #fff5f0; 
                }
                .details-container {
                  border: 1px solid #fd7e14;
                  background-color: #fff5f0;
                  padding: 10px;
                  margin-bottom: 15px;
                  border-radius: 5px;
                }
                .qr-container { 
                  text-align: center; 
                  margin: 15px 0; 
                }
                .footer { 
                  text-align: center; 
                  margin-top: 15px; 
                  font-size: 12px; 
                  color: #6c757d; 
                }
                @media print {
                  body { 
                    padding: 10px !important;
                    font-size: 12px !important;
                  }
                  .logo { 
                    max-height: 50px !important;
                  }
                  table {
                    font-size: 11px !important;
                  }
                  @page {
                    size: auto;
                    margin: 5mm;
                  }
                }
              </style>
            </head>
            <body>
              ${factureRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 200);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date non disponible';
    try {
      return format(parseISO(dateString), 'PPPP', { locale: fr });
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return 'Date non disponible';
    }
  };

  const getStatusBadgeColor = (statut: Colis['statut']) => {
    switch (statut) {
      case 'Livré': return 'success';
      case 'Expedié': return 'primary';
      case 'En transit': return 'info';
      case 'En cours de livraison': return 'warning';
      case 'Assigné': return 'secondary';
      case 'Enregistré': return 'light';
      default: return 'dark';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <ReceptionistHeader />
      <div className="d-flex flex-grow-2">
        <ReceptionistSidebar />
        <main className="flex-grow-1 p-3 p-md-4">
          <Card className="shadow-sm mb-4" style={{ border: '2px solid #fd7e14' }}>
            <Card.Header style={{ backgroundColor: '#fd7e14', color: 'white' }} className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">📦 Gestion des colis</h2>
              <Button 
                variant="outline-light" 
                onClick={() => setShowFormModal(true)}
                disabled={loading.agences || loading.clients}
              >
                {loading.agences || loading.clients ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  'Nouveau colis'
                )}
              </Button>
            </Card.Header>
            
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} onClose={() => setMessage({ text: '', type: 'info' })} dismissible>
                  {message.text}
                </Alert>
              )}

              {loading.list ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: '#fd7e14' }} />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover responsive>
                    <thead style={{ backgroundColor: '#fd7e14', color: 'white' }}>
                      <tr>
                        <th>Code</th>
                        <th>Agence arrivée</th>
                        <th className="d-none d-sm-table-cell">Client</th>
                        <th>Poids</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colisList.map(colis => {

                        const agenceArrivee = agences.find(a => a.id === colis.agence_arrivee);
                        return (
                          <tr key={colis.id}>
                            <td>{colis.code_suivi}</td>
                            <td>{agenceArrivee?.nom || 'N/A'}</td>
                            <td className="d-none d-sm-table-cell">{clients.find(c => c.id === colis.client_id)?.nom || 'N/A'}</td>
                            <td>{colis.poids} kg</td>
                            <td>
                              <span className={`badge bg-${getStatusBadgeColor(colis.statut)} text-dark`}>
                                {colis.statut}
                              </span>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedColis(colis);
                                  setShowFactureModal(true);
                                }}
                              >
                                Facture
                              </Button>
                                {/* Bouton Ajouter suivi */}
                              <Button 
                               variant="outline-success" 
                                       size="sm"
                                 onClick={() => handleAddTracking(colis)}
                                  >
                                     Suivi
                               </Button>
    
                            {/* Bouton Supprimer */}
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteColis(colis.id)}
                            >
                              Suppr
                            </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </main>
      </div>

      {/* Modal de création de colis */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton style={{ backgroundColor: '#fd7e14', color: 'white', borderBottom: '2px solid white' }}>
          <Modal.Title className="fw-bold">Nouveau colis</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={10}>
                <Form.Group>
                  <Form.Label>Client</Form.Label>
                  <Form.Select 
                    name="client_id" 
                    value={formData.client_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nom} - {client.telephone}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowNewClientModal(true)}
                  className="w-100"
                >
                  + Ajouter
                </Button>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Agence de destination</Form.Label>
                  <Form.Select 
                    name="agence_arrivee" 
                    value={formData.agence_arrivee}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner une agence</option>
                    {agences.map(agence => (
                      <option key={agence.id} value={agence.id}>
                        {agence.nom} - {agence.ville}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Poids (kg)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    name="poids" 
                    value={formData.poids}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Valeur (FCFA)</Form.Label>
                  <Form.Control 
                    type="number"
                    name="valeur" 
                    value={formData.valeur}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Livraison</Form.Label>
                  <Form.Check 
                    type="checkbox"
                    label="À domicile"
                    name="livraison"
                    checked={formData.livraison}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Contenu</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    name="contenu" 
                    value={formData.contenu}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Destinataire</Form.Label>
                  <Form.Control 
                    name="destinataire_nom" 
                    value={formData.destinataire_nom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Téléphone destinataire</Form.Label>
                  <Form.Control 
                    name="destinataire_telephone" 
                    value={formData.destinataire_telephone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {formData.livraison && (
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Adresse de livraison</Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      name="destinataire_adresse" 
                      value={formData.destinataire_adresse}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '2px solid #fd7e14' }}>
          <Button variant="secondary" onClick={() => setShowFormModal(false)} style={{ minWidth: '100px' }}>
            Annuler
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            disabled={loading.submit}
            style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14', minWidth: '100px' }}
          >
            {loading.submit ? <Spinner size="sm" animation="border" /> : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal nouveau client */}
      <Modal 
        show={showNewClientModal} 
        onHide={() => setShowNewClientModal(false)}
        centered
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: '#fd7e14', 
            color: 'white',
            borderBottom: '2px solid white'
          }}
        >
          <Modal.Title className="fw-bold">Nouveau client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewClientSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nom complet</Form.Label>
              <Form.Control 
                name="nom" 
                value={newClientData.nom}
                onChange={handleNewClientChange}
                required
                placeholder="Ex: Jean Dupont"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Téléphone</Form.Label>
              <Form.Control 
                name="telephone" 
                value={newClientData.telephone}
                onChange={handleNewClientChange}
                required
                placeholder="Ex: +225 01 23 45 67 89"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email (optionnel)</Form.Label>
              <Form.Control 
                type="email"
                name="email" 
                value={newClientData.email}
                onChange={handleNewClientChange}
                placeholder="Ex: client@example.com"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '2px solid #fd7e14' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowNewClientModal(false)}
            style={{ minWidth: '100px' }}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNewClientSubmit}
            disabled={loading.newClient}
            style={{ 
              backgroundColor: '#fd7e14', 
              borderColor: '#fd7e14',
              minWidth: '100px'
            }}
          >
            {loading.newClient ? (
              <Spinner size="sm" animation="border" />
            ) : (
              'Enregistrer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de facture */}
      <Modal 
        show={showFactureModal} 
        onHide={() => setShowFactureModal(false)} 
        size="lg"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: '#fd7e14', 
            color: 'white',
            borderBottom: '2px solid white'
          }}
        >
          <Modal.Title className="fw-bold">Facture de colis</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0' }}>
          {selectedColis && (
            <div 
              ref={factureRef}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                color: '#333'
              }}
            >
              <div className="header">
                <Image 
                  src={monColis} 
                  alt="Logo" 
                  style={{ 
                    maxHeight: '70px',
                    marginBottom: '10px'
                  }}
                />
                <h4 style={{ 
                  color: '#fd7e14',
                  marginBottom: '5px'
                }}>
                  COLIS EXPRESS
                </h4>
                {(() => {
                  const agenceDepart = agences.find(a => a.id === selectedColis.agence_depart);
                  return agenceDepart ? (
                    <div style={{ lineHeight: '1.4' }}>
                      <p className="mb-1">{agenceDepart.adresse}</p>
                      <p className="mb-1">{agenceDepart.ville}</p>
                      <p className="mb-1">Tél: {agenceDepart.telephone}</p>
                      <p className="mb-0">Email: {agenceDepart.email}</p>
                    </div>
                  ) : (
                    <div style={{ lineHeight: '1.4' }}>
                      <p className="mb-1">123 Avenue des Colis, Abidjan</p>
                      <p className="mb-1">Tél: +225 01 23 45 67 89</p>
                      <p className="mb-0">Email: contact@colisexpress.com</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="invoice-info">
                <div>
                  <p className="mb-1"><strong>Facture N°:</strong> {selectedColis.code_suivi}</p>
                  <p className="mb-1"><strong>Date:</strong> {formatDate(selectedColis.date_envoi)}</p>
                  <p className="mb-1"><strong>Statut:</strong> {selectedColis.statut}</p>
                </div>
                <div className="text-end">
                  <p className="mb-1"><strong>Client:</strong> {clients.find(c => c.id === selectedColis.client_id)?.nom || 'N/A'}</p>
                  <p className="mb-1"><strong>Tél:</strong> {clients.find(c => c.id === selectedColis.client_id)?.telephone || 'N/A'}</p>
                  <p className="mb-1"><strong>Enregistré par:</strong> {currentUser?.nom || 'Réceptionniste'}</p>
                </div>
              </div>
              
              <Table bordered>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Montant (FCFA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Transport colis ({selectedColis.poids}kg)</td>
                    <td>{(selectedColis.poids * 500).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Assurance ({selectedColis.valeur.toLocaleString()} FCFA)</td>
                    <td>{(selectedColis.valeur * 0.01).toLocaleString()}</td>
                  </tr>
                  {selectedColis.livraison && (
                    <tr>
                      <td>Livraison à domicile</td>
                      <td>5 000</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td><strong>{calculateTotal(selectedColis).toLocaleString()} FCFA</strong></td>
                  </tr>
                </tbody>
              </Table>
              
              <div className="border p-3 mb-3" style={{ borderColor: '#fd7e14', backgroundColor: '#fff5f0' }}>
                <h6 style={{ color: '#fd7e14' }}>Détails du colis</h6>
                <p className="mb-1"><strong>Destinataire:</strong> {selectedColis.destinataire_nom}</p>
                <p className="mb-1"><strong>Contenu:</strong> {selectedColis.contenu}</p>
                <p className="mb-1"><strong>Agence destination:</strong> {
                  (() => {
                    const agenceArrivee = agences.find(a => a.id === selectedColis.agence_arrivee);
                    return agenceArrivee ? `${agenceArrivee.nom} ` : 'N/A';
                  })()
                }</p>
                <p className="mb-0"><strong>Mode:</strong> {selectedColis.livraison ? 'Livraison à domicile' : 'Retrait en agence'}</p>
                {selectedColis.livraison && (
                  <p className="mb-0"><strong>Adresse:</strong> {selectedColis.destinataire_adresse}</p>
                )}
              </div>

              <div className="text-center">
                <h6 style={{ color: '#fd7e14' }}>Code QR du Colis</h6>
                <div className="d-inline-block p-3 bg-white" style={{ border: '2px solid #fd7e14', borderRadius: '8px' }}>
                  <QRCodeSVG
                    value={JSON.stringify({
                      code: selectedColis.code_suivi,
                      client: clients.find(c => c.id === selectedColis.client_id)?.nom || 'N/A',
                      destinataire: selectedColis.destinataire_nom,
                      agence: agences.find(a => a.id === selectedColis.agence_arrivee)?.nom || 'N/A'
                    })}
                    size={128}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#fd7e14"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-muted small">
                    Scannez ce code pour suivre votre colis
                  </p>
                </div>
              </div>

              <div className="footer">
                <p style={{ color: '#fd7e14' }}>Merci pour votre confiance</p>
                <p className="small text-muted">
                  Pour toute réclamation, contactez-nous au {agences.find(a => a.id === selectedColis.agence_depart)?.telephone || '+225 01 23 45 67 89'}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '2px solid #fd7e14' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowFactureModal(false)}
            style={{ minWidth: '100px' }}
          >
            Fermer
          </Button>
          <Button 
            variant="primary" 
            onClick={printFacture}
            style={{ 
              backgroundColor: '#fd7e14', 
              borderColor: '#fd7e14',
              minWidth: '100px'
            }}
          >
            <i className="bi bi-printer-fill me-2"></i>Imprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ColisPage;