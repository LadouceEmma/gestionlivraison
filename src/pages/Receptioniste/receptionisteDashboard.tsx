import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'react-bootstrap';
import ReceptionistSidebar from './composants/sidebar';
import ReceptionistHeader from './composants/header';

const API_BASE_URL = 'http://localhost:5000/api'; // Modifier selon ton backend

const DashboardReceptionist: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ colis_enregistres_du_jour: 0, colis_en_attente_du_jour: 0 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/receptionniste/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <ReceptionistHeader />
      <div className="d-flex flex-grow-2">
        <ReceptionistSidebar />
        <main className="flex-grow-1 p-4">
          <h2 className="text-orange mb-4">Tableau de bord - Réceptionniste</h2>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Statistiques du Jour</Card.Title>
              <p>Colis enregistrés aujourd'hui: <strong>{stats.colis_enregistres_du_jour}</strong></p>
              <p>Colis en attente aujourd'hui: <strong>{stats.colis_en_attente_du_jour}</strong></p>
            </Card.Body>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardReceptionist;