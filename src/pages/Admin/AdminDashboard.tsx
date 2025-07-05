import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import AdminHeader from './composants/header';
import AdminSidebar from './composants/sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token'); // récupère le JWT
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data); // Utilisez res.data directement
      } catch (error) {
        console.error('Erreur récupération stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center mt-5 text-danger">
        Échec de chargement des statistiques.
      </div>
    );
  }

  const barData = {
    labels: ['Clients', 'Livreurs', 'Colis'],
    datasets: [
      {
        label: 'Nombre',
        data: [stats.total_clients, stats.total_livreurs, stats.total_colis],
        backgroundColor: ['#fd7e14', '#ffc107', '#ff9800'],
      },
    ],
  };

  const pieData = {
    labels: ['Livrés', 'En transit', 'En attente'],
    datasets: [
      {
        label: 'Colis',
        data: [
          stats.total_colis_livres,
          stats.total_colis_en_transit,
          stats.total_colis_en_attente,
        ],
        backgroundColor: ['#28a745', '#17a2b8', '#ffc107'],
      },
    ],
  };

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <AdminHeader />
      <div className="d-flex flex-grow-2">
        <AdminSidebar />
        <main className="flex-grow-1 p-4">
      <h2 className="text-center text-orange mb-4">Tableau de bord - Admin</h2>
      
      <Row>
        <Col md={4}>
          <Card className="shadow-sm text-white bg-warning mb-4">
            <Card.Body>
              <Card.Title>Total Clients</Card.Title>
              <h3>{stats.total_clients}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-white bg-orange mb-4">
            <Card.Body>
              <Card.Title>Total Livreurs</Card.Title>
              <h3>{stats.total_livreurs}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-white bg-danger mb-4">
            <Card.Body>
              <Card.Title>Total Colis</Card.Title>
              <h3>{stats.total_colis}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Répartition des colis</Card.Title>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Utilisateurs & Colis</Card.Title>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
    </div>
    </div>
  );
};

export default AdminDashboard;