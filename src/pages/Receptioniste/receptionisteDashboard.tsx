import React, { useEffect, useState } from 'react';
import ReceptionistSidebar from './composants/sidebar';
import ReceptionistHeader from './composants/header';
import ValidationColisPage from './ValidationColisPage';
import axios from 'axios';

interface DashboardStats {
  total_colis: number;
  colis_enregistres_du_jour: number;
  colis_en_attente_du_jour: number;
  colis_en_attente_total: number;
  colis_enregistres_attente_du_jour: number;
  colis_en_livraison_du_jour: number;
  colis_livres_du_jour: number;
  colis_annules_du_jour: number;
  colis_en_retard: number;
  derniers_colis: {
    code: string;
    statut: string;
    date_creation: string;
  }[];
}

const DashboardReceptionist: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'validation'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ Récupérer le token JWT

    axios.get('http://localhost:5000/api/receptionniste/dashboard-stats', {
      headers: {
        Authorization: `Bearer ${token}` // ✅ Envoyer le token dans l'en-tête
      }
    })
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des statistiques :", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <ReceptionistHeader />
      <div className="d-flex flex-grow-2">
        <ReceptionistSidebar setPage={setCurrentPage} />
        <main className="flex-grow-1 p-4">
          {currentPage === 'dashboard' && (
            <div>
              <h1>Tableau de bord Réceptionniste 📦</h1>

              {stats && (
                <>
                  <div className="row g-3 mt-3">
                    <div className="col-md-4">
                      <div className="card text-white bg-primary">
                        <div className="card-body">
                          <h5 className="card-title">Total colis</h5>
                          <p className="card-text fs-3">{stats.total_colis}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-white bg-warning">
                        <div className="card-body">
                          <h5 className="card-title">Colis en attente (aujourd'hui)</h5>
                          <p className="card-text fs-3">{stats.colis_en_attente_du_jour}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-white bg-success">
                        <div className="card-body">
                          <h5 className="card-title">Colis livrés (aujourd'hui)</h5>
                          <p className="card-text fs-3">{stats.colis_livres_du_jour}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-warning mt-4"
                    onClick={() => setCurrentPage('validation')}
                  >
                    ✅ Valider les colis
                  </button>

                  <div className="mt-5">
                    <h3>📦 Derniers colis enregistrés</h3>
                    {stats.derniers_colis && stats.derniers_colis.length > 0 ? (
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Code suivi</th>
                            <th>Statut</th>
                            <th>Date de création</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.derniers_colis.map((colis, index) => (
                            <tr key={index}>
                              <td>{colis.code}</td>
                              <td>{colis.statut}</td>
                              <td>{new Date(colis.date_creation).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-muted">Aucun colis enregistré récemment.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {currentPage === 'validation' && (
            <>
              <button
                className="btn btn-secondary mb-3"
                onClick={() => setCurrentPage('dashboard')}
              >
                ⬅ Retour au tableau de bord
              </button>
              <ValidationColisPage />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardReceptionist;
