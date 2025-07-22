import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Modal, Table, Spinner, Alert } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import monColis from '../../images/monColis.jpg';

interface Colis {
  id: number;
  code_suivi: string;
  client_id: number;
  agence_depart: number | null;
  agence_arrivee: number | null;
  poids: number;
  valeur: number;
  contenu: string;
  livraison: boolean;
  destinataire_nom: string;
  destinataire_telephone: string;
  destinataire_adresse: string;
  statut: string;
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

interface Client {
  id: number;
  nom: string;
  telephone: string;
}

const ValidationColisPage: React.FC = () => {
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [agences, setAgences] = useState<Agence[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: 'info' });
  const [showFactureModal, setShowFactureModal] = useState(false);
  const factureContentRef = useRef<HTMLDivElement>(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const fetchColis = async () => {
    try {
      setLoading(true);
      const [colisRes, agencesRes, clientsRes] = await Promise.all([
        api.get('/colis/attente-validation'),
        api.get('/agences'),
        api.get('/users/clients'),
      ]);

      const validatedColis = colisRes.data.map((colis: Colis) => ({
        ...colis,
        valeur: colis.valeur ?? 0,
        poids: colis.poids ?? 0,
        statut: colis.statut || 'En attente',
      }));

      setColisList(validatedColis);
      setAgences(agencesRes.data);
      setClients(clientsRes.data);
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Erreur lors du chargement', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColis();
  }, []);

  const handleValidation = async (colisId: number) => {
    if (!window.confirm('Voulez-vous vraiment valider ce colis ?')) return;
    try {
      await api.patch(`/colis/${colisId}/validate`);
      setMessage({ text: 'Colis validé avec succès', type: 'success' });
      fetchColis();
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Erreur lors de la validation', type: 'danger' });
    }
  };

  const calculateTotal = (colis: Colis) => {
    const transportCost = (colis.poids || 0) * 500;
    const assuranceCost = (colis.valeur || 0) * 0.01;
    const livraisonCost = colis.livraison ? 5000 : 0;
    return transportCost + assuranceCost + livraisonCost;
  };

  const printFacture = () => {
    if (!factureContentRef.current || !selectedColis) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Facture ${selectedColis.code_suivi}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #fd7e14; margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { background-color: #fd7e14; color: white; padding: 8px; }
              td { padding: 8px; border-bottom: 1px solid #ddd; }
              .total { font-weight: bold; background-color: #fff5f0; }
              .qr { text-align: center; margin-top: 15px; }
            </style>
          </head>
          <body>
            ${factureContentRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
  };

  const handleCloseFactureModal = () => {
    // Petit délai pour éviter conflits React
    setTimeout(() => setShowFactureModal(false), 200);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">✅ Validation des colis</h2>

      {message.text && (
        <Alert
          variant={message.type}
          onClose={() => setMessage({ text: '', type: 'info' })}
          dismissible
        >
          {message.text}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: '#fd7e14', color: 'white' }}>
            <tr>
              <th>Code</th>
              <th>Client</th>
              <th>Poids</th>
              <th>Valeur</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colisList.map((colis) => {
              const client = clients.find((c) => c.id === colis.client_id);
              return (
                <tr key={colis.id}>
                  <td>{colis.code_suivi}</td>
                  <td>{client?.nom || 'N/A'}</td>
                  <td>{colis.poids} kg</td>
                  <td>{(colis.valeur ?? 0).toLocaleString()} FCFA</td>
                  <td>{colis.statut}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleValidation(colis.id)}
                      className="me-2"
                    >
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedColis(colis);
                        setShowFactureModal(true);
                      }}
                    >
                      Facture
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Modal Facture */}
      <Modal show={showFactureModal} onHide={handleCloseFactureModal} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#fd7e14', color: 'white' }}>
          <Modal.Title>Facture du colis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={factureContentRef}>
            {selectedColis && (
              <div>
                <div className="header">
                  <img src={monColis} alt="Logo" style={{ maxHeight: '60px' }} />
                  <h4 style={{ color: '#fd7e14' }}>COLIS EXPRESS</h4>
                </div>
                <p><strong>Facture N°:</strong> {selectedColis.code_suivi}</p>
                <p><strong>Client:</strong> {clients.find(c => c.id === selectedColis.client_id)?.nom || 'N/A'}</p>
                <p><strong>Poids:</strong> {selectedColis.poids} kg</p>
                <p><strong>Valeur:</strong> {(selectedColis.valeur ?? 0).toLocaleString()} FCFA</p>

                <Table bordered>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Montant (FCFA)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Transport</td>
                      <td>{((selectedColis.poids || 0) * 500).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Assurance</td>
                      <td>{((selectedColis.valeur || 0) * 0.01).toLocaleString()}</td>
                    </tr>
                    {selectedColis.livraison && (
                      <tr>
                        <td>Livraison</td>
                        <td>5 000</td>
                      </tr>
                    )}
                    <tr className="total">
                      <td>Total</td>
                      <td>{calculateTotal(selectedColis).toLocaleString()} FCFA</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="qr">
                  <QRCodeSVG
                    value={selectedColis.code_suivi}
                    size={128}
                    fgColor="#fd7e14"
                  />
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFactureModal}>Fermer</Button>
          <Button
            variant="primary"
            style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
            onClick={printFacture}
          >
            Imprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ValidationColisPage;
