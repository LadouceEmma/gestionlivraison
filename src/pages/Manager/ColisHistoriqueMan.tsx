import { useParams } from 'react-router-dom';
import { Button, Table, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ManagerHeader from './composants/header';
import ManagerSidebar from './composants/sidebar';

interface Suivi {
  id: number;
  date_heure: string;
  statut: string;
  location: string;
  commentaire: string;
  user: {
    nom: string;
    role: string;
  };
}

interface Colis {
  id: number;
  code_suivi: string;
  statut_actuel: string;
  destinataire_nom: string;
  destinataire_adresse: string;
  agence_depart: string;
  agence_arrivee: string;
}

const ColisHistorique: React.FC = () => {
  // Configuration des couleurs du thème
  const themeColors = {
    orange: '#FF7A45',
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    darkGray: '#343A40'
  };

  // États et hooks
  const { codeSuivi } = useParams<{ codeSuivi: string }>();
  const [colis, setColis] = useState<Colis | null>(null);
  const [historique, setHistorique] = useState<Suivi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Styles personnalisés
  const styles = {
    header: {
      backgroundColor: themeColors.orange,
      color: themeColors.white,
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    card: {
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '1.5rem'
    },
    tableHeader: {
      backgroundColor: themeColors.orange,
      color: themeColors.white
    },
    badge: {
      fontSize: '0.9rem',
      padding: '0.5rem 0.75rem'
    }
  };

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/colis/${codeSuivi}/historique`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setColis(response.data.colis);
        setHistorique(response.data.historique);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codeSuivi]);

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Enregistré': 'primary',
      'En transit': 'info',
      'En livraison': 'warning',
      'Livré': 'success',
      'Retourné': 'danger'
    };
    return variants[status] || 'secondary';
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <ManagerHeader />
        <div className="d-flex flex-grow-1">
          <ManagerSidebar />
          <main className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
            <span className="ms-3">Chargement en cours...</span>
          </main>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <ManagerHeader />
        <div className="d-flex flex-grow-1">
          <ManagerSidebar />
          <main className="flex-grow-1 p-4">
            <Alert variant="danger">
              <Alert.Heading>Erreur</Alert.Heading>
              <p>{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  // Affichage si aucun colis trouvé
  if (!colis) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <ManagerHeader />
        <div className="d-flex flex-grow-1">
          <ManagerSidebar />
          <main className="flex-grow-1 p-4">
            <Alert variant="warning">
              Aucun colis trouvé avec le code {codeSuivi}
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  // Affichage principal
  return (
    <div className="d-flex flex-column min-vh-100">
      <ManagerHeader />
      <div className="d-flex flex-grow-1">
        <ManagerSidebar />
        <main className="flex-grow-1 p-4" style={{ backgroundColor: themeColors.lightGray }}>
          <div className="container py-4">
            {/* En-tête */}
            <div className="d-flex justify-content-between align-items-center mb-3" style={styles.header}>
              <h1 className="mb-0">Historique du colis {colis.code_suivi}</h1>
              <Button 
                variant="light" 
                onClick={() => window.print()}
                style={{ color: themeColors.orange }}
              >
                Imprimer
              </Button>
            </div>

            {/* Carte d'information du colis */}
            <Card style={styles.card}>
              <Card.Body>
                <h2 className="h5 mb-3" style={{ color: themeColors.orange }}>Informations du colis</h2>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Statut :</strong>{' '}
                      <Badge bg={getStatusBadge(colis.statut_actuel)} style={styles.badge}>
                        {colis.statut_actuel}
                      </Badge>
                    </p>
                    <p><strong>Destinataire :</strong> {colis.destinataire_nom}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Adresse :</strong> {colis.destinataire_adresse}</p>
                    <p><strong>Agence :</strong> {colis.agence_depart} → {colis.agence_arrivee}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Historique des suivis */}
            <Card style={styles.card}>
              <Card.Body>
                <h2 className="h5 mb-3" style={{ color: themeColors.orange }}>Historique des suivis</h2>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={{ color: themeColors.white }}>Date/Heure</th>
                        <th style={{ color: themeColors.white }}>Statut</th>
                        <th style={{ color: themeColors.white }}>Localisation</th>
                        <th style={{ color: themeColors.white }}>Commentaire</th>
                        <th style={{ color: themeColors.white }}>Responsable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historique.map((suivi) => (
                        <tr key={suivi.id}>
                          <td>{new Date(suivi.date_heure).toLocaleString()}</td>
                          <td>
                            <Badge bg={getStatusBadge(suivi.statut)} style={styles.badge}>
                              {suivi.statut}
                            </Badge>
                          </td>
                          <td>{suivi.location || '-'}</td>
                          <td>{suivi.commentaire || '-'}</td>
                          <td>{suivi.user.nom} ({suivi.user.role})</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </main>
      </div>
       <style>
        
      </style>
    </div>
   
  );
};

export default ColisHistorique;