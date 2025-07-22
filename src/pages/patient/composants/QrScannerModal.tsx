import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { QrCode as QrCodeIcon } from 'react-bootstrap-icons';
import { QrReader } from 'react-qr-reader';

interface Props {
  show: boolean;
  onClose: () => void;
  onScan?: (result: string | null) => void;
}

const QrScannerModal: React.FC<Props> = ({ show, onClose, onScan }) => {
  const [scanDelay, setScanDelay] = useState<number>(500); // Délai entre les scans en ms

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <QrCodeIcon className="me-2" /> Scanner un colis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0" style={{ minHeight: '400px' }}>
        <QrReader
          constraints={{
            facingMode: 'environment' // Utilise la caméra arrière par défaut
          }}
          scanDelay={scanDelay}
          onResult={(result) => {
            if (result) {
              onScan?.(result.getText());
            }
          }}
          onError={(error) => {
            console.error('QR Scanner error:', error);
            // Optionnel : Afficher un message à l'utilisateur
          }}
          containerStyle={{
            width: '100%',
            height: '100%',
            padding: 0,
            margin: 0
          }}
          videoStyle={{
            width: '100%',
            objectFit: 'cover'
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QrScannerModal;