import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerSidebar from './composants/sidebar';
import ManagerHeader from './composants/header';

interface Stats {
  total_colis_du_jour: number;
  colis_livres_du_jour: number;
  colis_en_transit_du_jour: number;
  taux_livraison: number;
}

const DashboardManager: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/manager/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Chargement des statistiques...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
          <ManagerHeader />
          <div className="d-flex flex-grow-2">
            <ManagerSidebar />
            <main className="flex-grow-1 p-4">
      <h2 className="mb-4 text-center">Dashboard Manager</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Colis du jour</h5>
              <p className="card-text fs-4">{stats?.total_colis_du_jour}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Colis livrés</h5>
              <p className="card-text fs-4">{stats?.colis_livres_du_jour}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">En transit</h5>
              <p className="card-text fs-4">{stats?.colis_en_transit_du_jour}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Taux de livraison</h5>
              <p className="card-text fs-4">{stats?.taux_livraison}%</p>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
    </div>

    
  );
};

export default DashboardManager;
