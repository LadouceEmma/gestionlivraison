import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import AdminHeader from './composants/header';
import AdminSidebar from './composants/sidebar';

dayjs.locale('fr');
const API_URL = 'http://localhost:5000/api';

interface Colis {
  id: number;
  code_suivi: string;
  destinataire_nom: string;
  statut: string;
  date_creation: string;
  livreur_id?: number;
}

const ManagerColis: React.FC = () => {
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [filteredColis, setFilteredColis] = useState<Colis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const colisPerPage = 5;

  useEffect(() => {
    fetchColis();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [colisList, searchTerm, selectedStatus]);

  const fetchColis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/colis/send`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColisList(response.data);
    } catch {
      setError("Erreur lors du chargement des colis");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = colisList.filter((colis) => {
      const matchesSearch =
        colis.code_suivi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colis.destinataire_nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || colis.statut === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredColis(filtered);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(
        `${API_URL}/colis/${id}/statuts`,
        { statut: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchColis();
      setSnackbarMessage("Statut mis à jour !");
      setOpenSnackbar(true);
    } catch {
      setSnackbarMessage("Erreur lors du changement de statut");
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/colis/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchColis();
      setSnackbarMessage("Colis supprimé !");
      setOpenSnackbar(true);
    } catch {
      setSnackbarMessage("Erreur lors de la suppression");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (colis: Colis) => {
    setSelectedColis(colis);
    setOpenEdit(true);
  };

  const handleDetail = (colis: Colis) => {
    setSelectedColis(colis);
    setOpenDetail(true);
  };

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const paginatedColis = filteredColis.slice((currentPage - 1) * colisPerPage, currentPage * colisPerPage);

  if (loading) {
    return (
      <>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
          rel="stylesheet"
        />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border" style={{ color: '#ff6b35' }} role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
        <div className="alert alert-danger m-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet"
      />
      <script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
      ></script>
      
      <div className="dashboard-container min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
        <AdminHeader />
        <div className="d-flex flex-grow-1">
          <AdminSidebar />
          <main className="flex-grow-1 p-4">
            <div className="container-fluid">
              {/* En-tête */}
              <div className="row mb-4">
                <div className="col">
                  <h2 className="mb-0" style={{ color: '#ff6b35' }}>
                    <i className="fas fa-box me-2"></i>
                    Gérer les Colis
                  </h2>
                  <p className="text-muted">Gérez tous vos colis depuis cette interface</p>
                </div>
              </div>

              {/* Filtres et recherche */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#ff6b35', color: 'white', border: 'none' }}>
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par code ou destinataire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ borderColor: '#ff6b35' }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ borderColor: '#ff6b35' }}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="Enregistré">Enregistré</option>
                    <option value="En transit">En transit</option>
                    <option value="Expedié">Expédié</option>
                    <option value="Retourné">Annulé</option>
                  </select>
                </div>
              </div>

              {/* Bouton Export */}
              <div className="row mb-3">
                <div className="col d-flex justify-content-end">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-file-pdf me-2"></i>
                    Exporter PDF
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-header" style={{ backgroundColor: '#ff6b35', color: 'white' }}>
                  <h5 className="mb-0">
                    <i className="fas fa-list me-2"></i>
                    Liste des Colis
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#ffe4dc' }}>
                        <tr>
                          <th style={{ color: '#ff6b35' }}>Code Suivi</th>
                          <th style={{ color: '#ff6b35' }}>Destinataire</th>
                          <th style={{ color: '#ff6b35' }}>Statut</th>
                          <th style={{ color: '#ff6b35' }}>Date Création</th>
                          <th style={{ color: '#ff6b35' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedColis.map((colis) => (
                          <tr key={colis.id}>
                            <td>
                              <strong style={{ color: '#ff6b35' }}>{colis.code_suivi}</strong>
                            </td>
                            <td>{colis.destinataire_nom}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={colis.statut}
                                onChange={(e) => handleStatusChange(colis.id, e.target.value)}
                                style={{ borderColor: '#ff6b35', width: 'auto' }}
                              >
                                <option value="Enregistré">Enregistré</option>
                                <option value="En transit">En transit</option>
                                <option value="Expedié">Expédié</option>
                                <option value="Retourné">Annulé</option>
                              </select>
                            </td>
                            <td>{dayjs(colis.date_creation).format('DD/MM/YYYY')}</td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button
                                  className="btn btn-outline-info"
                                  onClick={() => handleDetail(colis)}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleEdit(colis)}
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(colis.id)}
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {Math.ceil(filteredColis.length / colisPerPage) > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </button>
                      </li>
                      {[...Array(Math.ceil(filteredColis.length / colisPerPage))].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                            style={currentPage === index + 1 ? {
                              backgroundColor: '#ff6b35',
                              borderColor: '#ff6b35',
                              color: 'white'
                            } : {}}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(filteredColis.length / colisPerPage) ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === Math.ceil(filteredColis.length / colisPerPage)}
                        >
                          Suivant
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>

            {/* Modal Détail */}
            {openDetail && (
              <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header" style={{ backgroundColor: '#ff6b35', color: 'white' }}>
                      <h5 className="modal-title">
                        <i className="fas fa-info-circle me-2"></i>
                        Détails du Colis
                      </h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => setOpenDetail(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {selectedColis && (
                        <div className="row">
                          <div className="col-md-6">
                            <div className="card border-0" style={{ backgroundColor: '#ffe4dc' }}>
                              <div className="card-body">
                                <h6 className="card-title" style={{ color: '#ff6b35' }}>
                                  <i className="fas fa-barcode me-2"></i>
                                  Code Suivi
                                </h6>
                                <p className="card-text fs-5 fw-bold">{selectedColis.code_suivi}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card border-0" style={{ backgroundColor: '#f8f9fa' }}>
                              <div className="card-body">
                                <h6 className="card-title" style={{ color: '#ff6b35' }}>
                                  <i className="fas fa-user me-2"></i>
                                  Destinataire
                                </h6>
                                <p className="card-text fs-5">{selectedColis.destinataire_nom}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="card border-0" style={{ backgroundColor: '#f8f9fa' }}>
                              <div className="card-body">
                                <h6 className="card-title" style={{ color: '#ff6b35' }}>
                                  <i className="fas fa-flag me-2"></i>
                                  Statut
                                </h6>
                                <p className="card-text">
                                  <span className={`badge ${
                                    selectedColis.statut === 'Enregistré' ? 'bg-secondary' :
                                    selectedColis.statut === 'En transit' ? 'bg-warning' :
                                    selectedColis.statut === 'Expedié' ? 'bg-success' :
                                    'bg-danger'
                                  }`}>
                                    {selectedColis.statut}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="card border-0" style={{ backgroundColor: '#f8f9fa' }}>
                              <div className="card-body">
                                <h6 className="card-title" style={{ color: '#ff6b35' }}>
                                  <i className="fas fa-calendar me-2"></i>
                                  Date de Création
                                </h6>
                                <p className="card-text fs-6">{dayjs(selectedColis.date_creation).format('DD/MM/YYYY')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setOpenDetail(false)}
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Modification */}
            {openEdit && (
              <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header" style={{ backgroundColor: '#ff6b35', color: 'white' }}>
                      <h5 className="modal-title">
                        <i className="fas fa-edit me-2"></i>
                        Modifier le Colis
                      </h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => setOpenEdit(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#ff6b35' }}>
                          <i className="fas fa-user me-2"></i>
                          Nom du Destinataire
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedColis?.destinataire_nom || ''}
                          onChange={(e) =>
                            setSelectedColis({ ...(selectedColis as Colis), destinataire_nom: e.target.value })
                          }
                          style={{ borderColor: '#ff6b35' }}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setOpenEdit(false)}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: '#ff6b35', color: 'white' }}
                        onClick={async () => {
                          try {
                            await axios.put(`${API_URL}/colis/${selectedColis?.id}`, {
                              destinataire_nom: selectedColis?.destinataire_nom,
                            }, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            });
                            fetchColis();
                            setSnackbarMessage("Colis modifié !");
                            setOpenSnackbar(true);
                          } catch {
                            setSnackbarMessage("Erreur lors de la modification");
                            setOpenSnackbar(true);
                          } finally {
                            setOpenEdit(false);
                          }
                        }}
                      >
                        <i className="fas fa-save me-2"></i>
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toast Notification */}
            {openSnackbar && (
              <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                <div className="toast show" role="alert">
                  <div className="toast-header" style={{ backgroundColor: '#ff6b35', color: 'white' }}>
                    <i className="fas fa-bell me-2"></i>
                    <strong className="me-auto">Notification</strong>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={handleSnackbarClose}
                    ></button>
                  </div>
                  <div className="toast-body">
                    {snackbarMessage}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ManagerColis;