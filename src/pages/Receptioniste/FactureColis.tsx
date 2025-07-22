import React, { useRef } from 'react';
import { Modal, Button, Table, Image } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import monColis from '../../images/monColis.jpg';

interface FactureColisProps {
  colis: any; // Typage plus tard
  agences: any[];
  clients: any[];
  currentUser: any;
  show: boolean;
  onClose: () => void;
}

const FactureColis: React.FC<FactureColisProps> = ({
  colis,
  agences,
  clients,
  
  show,
  onClose
}) => {
  const factureRef = useRef<HTMLDivElement>(null);

  const calculateTotal = () => {
    const transportCost = colis.poids * 500;
    const assuranceCost = colis.valeur * 0.01;
    const livraisonCost = colis.livraison ? 5000 : 0;
    return transportCost + assuranceCost + livraisonCost;
  };

  const agenceDepart = agences.find(a => a.id === colis.agence_depart);
  const agenceArrivee = agences.find(a => a.id === colis.agence_arrivee);
  const client = clients.find(c => c.id === colis.client_id);

  const printFacture = () => {
  if (factureRef.current) {
    // Récupère le contenu HTML
    const content = factureRef.current.innerHTML;

    // Ouvre une fenêtre propre
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Facture ${colis.code_suivi}</title>
            <style>
              body { font-family: Arial, sans-serif; color: #333; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #fd7e14; margin-bottom: 15px; }
              .logo { max-height: 60px; margin-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th { background-color: #fd7e14; color: white; padding: 8px; }
              td { padding: 8px; border: 1px solid #ddd; }
              .total { font-weight: bold; background-color: #fff5f0; }
              .qr { text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();

      // On attend un peu que tout soit chargé
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  }
};

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#fd7e14', color: 'white' }}>
        <Modal.Title>Facture du colis</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div ref={factureRef}>
          <div className="header">
            <Image src={monColis} alt="Logo" className="logo" />
            <h4 style={{ color: '#fd7e14' }}>COLIS EXPRESS</h4>
            <p>{agenceDepart?.adresse}, {agenceDepart?.ville}</p>
            <p>Tél: {agenceDepart?.telephone}</p>
            <p>Email: {agenceDepart?.email}</p>
          </div>

          <div className="details">
            <p><strong>Facture N°:</strong> {colis.code_suivi}</p>
            <p><strong>Client:</strong> {client?.nom}</p>
            <p><strong>Téléphone:</strong> {client?.telephone}</p>
            <p><strong>Agence destination:</strong> {agenceArrivee?.nom}</p>
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
                <td>Transport ({colis.poids}kg)</td>
                <td>{(colis.poids * 500).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Assurance ({colis.valeur.toLocaleString()} FCFA)</td>
                <td>{(colis.valeur * 0.01).toLocaleString()}</td>
              </tr>
              {colis.livraison && (
                <tr>
                  <td>Livraison à domicile</td>
                  <td>{(5000).toLocaleString()}</td>
                </tr>
              )}
              <tr className="total">
                <td>Total</td>
                <td>{calculateTotal().toLocaleString()} FCFA</td>
              </tr>
            </tbody>
          </Table>

          <div className="qr">
            <QRCodeSVG
              value={colis.code_suivi}
              size={128}
              fgColor="#fd7e14"
            />
            <p>Scannez pour suivre votre colis</p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Fermer</Button>
        <Button
          variant="primary"
          onClick={printFacture}
          style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
        >
          Imprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FactureColis;
