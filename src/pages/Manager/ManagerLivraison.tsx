import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerHeader from './composants/header';
import ManagerSidebar from './composants/sidebar';

interface Colis {
  id: number;
  code_suivi: string;
  statut: string;
  livreur_nom?: string;
}

interface Livreur {
  id: number;
  nom: string;
}

const STATUTS = ['Assigné', 'En cours de livraison', 'Livré'];

const ManagerLivraison: React.FC = () => {
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [selectedColisId, setSelectedColisId] = useState<number | null>(null);
  const [selectedLivreurId, setSelectedLivreurId] = useState<number | null>(null);
  const [statutsChoisis, setStatutsChoisis] = useState<{ [colisId: number]: string }>({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchColisArrivants();
    fetchLivreurs();
  }, []);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchColisArrivants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/colis/arrivants', { headers });
      setColisList(res.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des colis arrivants', error);
    }
  };

  const fetchLivreurs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/livreurs', { headers });
      const data = Array.isArray(res.data) ? res.data : res.data.livreurs || [];
      setLivreurs(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livreurs', error);
    }
  };

  const assignerColis = async () => {
    if (!selectedColisId || !selectedLivreurId) {
      alert('Veuillez sélectionner un colis **et** un livreur.');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/colis/${selectedColisId}/assign`,
        { livreur_id: selectedLivreurId },
        { headers }
      );
      alert('Colis assigné avec succès !');
      setSelectedColisId(null);
      setSelectedLivreurId(null);
      fetchColisArrivants();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l’assignation du colis.';
      alert(`Erreur : ${message}`);
    }
  };

  const desassignerColis = async (colisId: number) => {
    try {
      await axios.patch(`http://localhost:5000/api/colis/${colisId}/desassign`, {}, { headers });
      alert('Colis désassigné avec succès.');
      fetchColisArrivants();
    } catch (error) {
      alert('Erreur lors du désassignement.');
    }
  };

  const changerStatutColis = async (colisId: number) => {
    const nouveauStatut = statutsChoisis[colisId];
    if (!nouveauStatut) {
      alert('Veuillez sélectionner un statut.');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/colis/${colisId}/statuts`,
        { statut: nouveauStatut },
        { headers }
      );
      alert('Statut modifié avec succès !');
      fetchColisArrivants();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors du changement de statut.';
      alert(`Erreur : ${message}`);
    }
  };

  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case 'Arrivé': return 'bg-secondary';
      case 'Assigné': return 'bg-warning text-dark';
      case 'En cours de livraison': return 'bg-info';
      case 'Livré': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <>
      <style>{`
        .btn-orange {
          background-color: #ff8c00;
          border-color: #ff8c00;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-orange:hover {
          background-color: #ff7f00;
          border-color: #ff7f00;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(255, 140, 0, 0.3);
        }
        .btn-orange:disabled {
          background-color: #ffb366;
          border-color: #ffb366;
        }
        .table-orange thead th {
          background: linear-gradient(135deg, #fff3e6 0%, #ffebcc 100%);
          color: #d2691e;
          border-color: #ffebcc;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
        }
        .table-hover tbody tr:hover {
          background-color: #f9f9f9;
        }
        .status-badge {
          font-size: 0.85rem;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: 600;
        }
        .card-orange {
          border-left: 4px solid #ff8c00;
        }
        .selected-row {
          background-color: #fff8e1;
        }
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: #666;
        }
        .empty-state i {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 1rem;
        }
      `}</style>
      
      <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
        <ManagerHeader />
        <div className="d-flex flex-grow-1">
          <ManagerSidebar />
          <main className="flex-grow-1 p-5">
            <div className="container-fluid">
              
              {/* Section Header */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm card-orange">
                    <div className="card-body py-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h1 className="section-title mb-2">📦 Gestion des Colis Arrivants</h1>
                          <p className="mb-0 text-muted fs-5">Gérez efficacement l'assignation et le suivi de vos colis</p>
                        </div>
                        <div className="text-end">
                          <div className="d-flex flex-column align-items-end">
                            <span className="badge bg-orange fs-5 px-4 py-2 mb-2">
                              {colisList.length} colis total
                            </span>
                            <small className="text-muted">Mis à jour maintenant</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignation Section */}
              {(selectedColisId || selectedLivreurId) && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card shadow-lg">
                      <div className="card-header bg-transparent border-0 py-3">
                        <div className="d-flex align-items-center">
                          <span className="fs-3 me-3">🎯</span>
                          <div>
                            <h4 className="mb-1 text-warning-emphasis fw-bold">Assignation en cours</h4>
                            <p className="mb-0 text-muted">Sélectionnez un colis et un livreur pour procéder à l'assignation</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-body py-4">
                        <div className="row align-items-end g-3">
                          <div className="col-lg-5">
                            <label className="form-label fw-bold text-dark">
                              <i className="me-2">🚚</i>Livreur à assigner
                            </label>
                            <select
                              className="form-select form-select-lg shadow-sm"
                              onChange={(e) => setSelectedLivreurId(Number(e.target.value))}
                              value={selectedLivreurId ?? ''}
                            >
                              <option value="">-- Choisissez un livreur --</option>
                              {livreurs.map((livreur) => (
                                <option key={livreur.id} value={livreur.id}>
                                  🚚 {livreur.nom}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-lg-4">
                            <label className="form-label fw-bold text-dark">Colis sélectionné</label>
                            <div className="p-3 bg-white rounded border">
                              {selectedColisId ? (
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-orange fs-6 px-3 py-2 me-2">
                                    Colis #{selectedColisId}
                                  </span>
                                  <small className="text-success">✅ Prêt pour assignation</small>
                                </div>
                              ) : (
                                <span className="text-muted fst-italic">Aucun colis sélectionné</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <button
                              className="btn btn-orange btn-lg w-100 shadow"
                              onClick={assignerColis}
                              disabled={!selectedColisId || !selectedLivreurId}
                            >
                              <i className="me-2">✅</i>Confirmer l'assignation
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Table of Colis */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                      <h3 className="mb-0 text-dark fw-bold">
                        <i className="me-2">📋</i>Liste des Colis
                      </h3>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0 table-orange">
                          <thead>
                            <tr>
                              <th className="py-4 px-4">Identifiant</th>
                              <th className="py-4">Code de Suivi</th>
                              <th className="py-4">Statut Actuel</th>
                              <th className="py-4">Livreur Assigné</th>
                              <th className="py-4 text-center">Gestion du Statut</th>
                              <th className="py-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {colisList.length > 0 ? (
                              colisList.map((colis) => (
                                <tr 
                                  key={colis.id} 
                                  className={selectedColisId === colis.id ? 'selected-row' : ''}
                                >
                                  <td className="py-4 px-4">
                                    <div className="fw-bold text-primary fs-5">#{colis.id}</div>
                                  </td>
                                  <td className="py-4">
                                    <code className="bg-light px-3 py-2 rounded fs-6 fw-bold">
                                      {colis.code_suivi}
                                    </code>
                                  </td>
                                  <td className="py-4">
                                    <span className={`badge status-badge ${getStatutBadgeClass(colis.statut)}`}>
                                      {colis.statut}
                                    </span>
                                  </td>
                                  <td className="py-4">
                                    {colis.livreur_nom ? (
                                      <div className="d-flex align-items-center">
                                        <div className="bg-success rounded-circle p-2 me-3">
                                          <i className="text-white">🚚</i>
                                        </div>
                                        <div>
                                          <div className="fw-bold">{colis.livreur_nom}</div>
                                          <small className="text-success">Assigné</small>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center">
                                        <div className="bg-secondary rounded-circle p-2 me-3">
                                          <i className="text-white">❓</i>
                                        </div>
                                        <span className="text-muted fst-italic">Non assigné</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-4">
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <select
                                        className="form-select form-select-sm shadow-sm"
                                        style={{ minWidth: '180px' }}
                                        value={statutsChoisis[colis.id] || ''}
                                        onChange={(e) =>
                                          setStatutsChoisis({ ...statutsChoisis, [colis.id]: e.target.value })
                                        }
                                      >
                                        <option value="">-- Nouveau statut --</option>
                                        {STATUTS.map((s) => (
                                          <option key={s} value={s}>
                                            {s}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        className="btn btn-outline-warning btn-sm px-3"
                                        onClick={() => changerStatutColis(colis.id)}
                                        disabled={!statutsChoisis[colis.id]}
                                      >
                                        <i className="me-1">📝</i>Appliquer
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-4 text-center">
                                    {colis.livreur_nom ? (
                                      <button
                                        className="btn btn-outline-danger btn-sm px-3"
                                        onClick={() => desassignerColis(colis.id)}
                                      >
                                        <i className="me-1">❌</i>Désassigner
                                      </button>
                                    ) : (
                                      <button
                                        className={`btn btn-sm px-3 ${
                                          selectedColisId === colis.id 
                                            ? 'btn-warning' 
                                            : 'btn-outline-success'
                                        }`}
                                        onClick={() => setSelectedColisId(
                                          selectedColisId === colis.id ? null : colis.id
                                        )}
                                      >
                                        {selectedColisId === colis.id ? (
                                          <>✅ Sélectionné</>
                                        ) : (
                                          <>🎯 Sélectionner</>
                                        )}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="empty-state">
                                  <div>
                                    <i>📭</i>
                                    <h4 className="mt-3 mb-2">Aucun colis disponible</h4>
                                    <p className="text-muted">Les nouveaux colis arrivants apparaîtront ici automatiquement</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card stats-card h-100 text-center">
                    <div className="card-body py-4">
                      <div className="text-primary mb-2">
                        <i style={{ fontSize: '2.5rem' }}>📦</i>
                      </div>
                      <h2 className="text-primary mb-1 fw-bold">{colisList.length}</h2>
                      <p className="text-muted mb-0 fw-semibold">Total Colis</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card stats-card h-100 text-center">
                    <div className="card-body py-4">
                      <div className="text-warning mb-2">
                        <i style={{ fontSize: '2.5rem' }}>🚚</i>
                      </div>
                      <h2 className="text-warning mb-1 fw-bold">
                        {colisList.filter(c => c.livreur_nom).length}
                      </h2>
                      <p className="text-muted mb-0 fw-semibold">Assignés</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card stats-card h-100 text-center">
                    <div className="card-body py-4">
                      <div className="text-success mb-2">
                        <i style={{ fontSize: '2.5rem' }}>✅</i>
                      </div>
                      <h2 className="text-success mb-1 fw-bold">
                        {colisList.filter(c => c.statut === 'Livré').length}
                      </h2>
                      <p className="text-muted mb-0 fw-semibold">Livrés</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card stats-card h-100 text-center">
                    <div className="card-body py-4">
                      <div className="text-info mb-2">
                        <i style={{ fontSize: '2.5rem' }}>👥</i>
                      </div>
                      <h2 className="text-info mb-1 fw-bold">{livreurs.length}</h2>
                      <p className="text-muted mb-0 fw-semibold">Livreurs Actifs</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ManagerLivraison;