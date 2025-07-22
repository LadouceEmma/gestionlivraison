import React from 'react';
import { Card, Table, Badge, Button, Stack, Spinner } from 'react-bootstrap';
import { Eye, QrCode } from 'react-bootstrap-icons';

interface Package {
  id: number;
  code_suivi: string;
  destinataire_nom: string;
  poids: number;
  statut: string;
  date_creation: string;
  qr_code_url?: string;
}

interface Props {
  title: string;
  packages: Package[];
  onTrack: (pkg: Package) => void;
  loading?: boolean;
}

const PackageList: React.FC<Props> = ({ title, packages, onTrack, loading = false }) => {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'livré': 'success',
      'en transit': 'primary',
      'en livraison': 'info',
      'enregistré': 'warning'
    };
    return statusMap[status.toLowerCase()] || 'secondary';
  };

  const handleTrack = (pkg: Package) => {
    if (!pkg.code_suivi) {
      console.error('Aucun code de suivi disponible');
      return;
    }
    onTrack(pkg);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-4">
          <p className="text-muted">Aucun colis trouvé</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-orange">
      <Card.Header className="bg-light-orange">
        <h5 className="mb-0 text-dark">{title}</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
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
                <td>
                  <Stack direction="horizontal" gap={2} className="align-items-center">
                    {pkg.qr_code_url ? (
                      <img 
                        src={pkg.qr_code_url} 
                        alt="QR Code" 
                        className="qr-code-img"
                      />
                    ) : (
                      <QrCode className="text-muted" />
                    )}
                    <span className="font-monospace">{pkg.code_suivi}</span>
                  </Stack>
                </td>
                <td>{pkg.destinataire_nom}</td>
                <td>{pkg.poids} kg</td>
                <td>
                  <Badge bg={getStatusBadge(pkg.statut)} className="text-capitalize">
                    {pkg.statut.toLowerCase()}
                  </Badge>
                </td>
                <td>{new Date(pkg.date_creation).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="outline-orange" 
                    size="sm"
                    onClick={() => handleTrack(pkg)}
                    disabled={!pkg.code_suivi}
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
  );
};

// Ajoutez dans votre fichier CSS :
// .border-orange { border-color: #fd7e14; }
// .bg-light-orange { background-color: #fff3e6; }
// .btn-outline-orange { 
//   color: #fd7e14; 
//   border-color: #fd7e14;
// }
// .qr-code-img { width: 24px; height: 24px; }

export default PackageList;