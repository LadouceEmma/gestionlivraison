import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuperadminHeader from './composants/header';
import SuperadminSidebar from './composants/sidebar';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaPowerOff, FaSearch, FaMapMarkerAlt, FaBuilding, FaPhone, FaEnvelope, FaCity } from 'react-icons/fa';

interface Agence {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
}

const Agences: React.FC = () => {
  const [agences, setAgences] = useState<Agence[]>([]);
  const [filteredAgences, setFilteredAgences] = useState<Agence[]>([]);
  const [newAgence, setNewAgence] = useState<Omit<Agence, 'id'>>({
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);
  const [editAgence, setEditAgence] = useState<Omit<Agence, 'id'>>({ nom: '', adresse: '', ville: '', telephone: '', email: '' });

  // Fetch des agences depuis l'API
  const fetchAgences = async () => {
    setTableLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/agences', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgences(response.data);
      setFilteredAgences(response.data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Erreur lors de la récupération des agences.' });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAgences();
  }, []);

  // Filtrage des agences en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAgences(agences);
    } else {
      const filtered = agences.filter(
        agence =>
          agence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agence.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agence.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgences(filtered);
    }
  }, [searchTerm, agences]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditAgence({ ...editAgence, [name]: value });
    } else {
      setNewAgence({ ...newAgence, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/agences', newAgence, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Agence créée avec succès !' });
      setNewAgence({ nom: '', adresse: '', ville: '', telephone: '', email: '' });
      setShowAddModal(false);
      fetchAgences();
    } catch (err: any) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Erreur lors de la création.' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (agence: Agence) => {
    setSelectedAgence(agence);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAgence) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/agences/${selectedAgence.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'warning', text: 'Agence désactivée avec succès.' });
      fetchAgences();
    } catch {
      setMessage({ type: 'danger', text: 'Erreur lors de la désactivation.' });
    } finally {
      setShowDeleteModal(false);
      setLoading(false);
    }
  };

  const openEditModal = (agence: Agence) => {
    setSelectedAgence(agence);
    setEditAgence({
      nom: agence.nom,
      adresse: agence.adresse,
      ville: agence.ville,
      telephone: agence.telephone,
      email: agence.email,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedAgence) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/agences/${selectedAgence.id}`, editAgence, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Agence mise à jour avec succès.' });
      fetchAgences();
    } catch {
      setMessage({ type: 'danger', text: 'Erreur lors de la mise à jour.' });
    } finally {
      setShowEditModal(false);
      setLoading(false);
    }
  };

  // Types de messages et leurs couleurs/icônes
  const alertStyles = {
    success: { icon: '✓', bg: 'rgba(25, 135, 84, 0.1)', color: '#198754', border: '1px solid #198754' },
    danger: { icon: '✕', bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid #dc3545' },
    warning: { icon: '⚠', bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', border: '1px solid #ffc107' },
  };

  return (
     <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <SuperadminHeader />
      <div className="d-flex flex-grow-1">
        <SuperadminSidebar />
        <div className="flex-grow-1 p-4">
        
        <div className="col-md-14 p-5">
          {/* Alert Message */}
          {message && (
            <div
              className="alert alert-custom fade show"
              role="alert"
              style={{
                backgroundColor: alertStyles[message.type].bg,
                color: alertStyles[message.type].color,
                border: alertStyles[message.type].border,
                borderRadius: '8px',
                padding: '15px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '20px', marginRight: '10px' }}>{alertStyles[message.type].icon}</span>
                <strong>{message.text}</strong>
              </div>
              <button
                type="button"
                className="btn-close"
                style={{ backgroundColor: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                onClick={() => setMessage(null)}
              >
                &times;
              </button>
            </div>
          )}

          {/* Header Card */}
          <div className="page-header-card mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Gestion des Agences</h4>
                <p className="text-muted mb-0">Gérez les différentes agences du réseau TrackColis</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="search-container me-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Rechercher une agence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ boxShadow: 'none' }}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-orange d-flex align-items-center"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus className="me-2" /> Ajouter une agence
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="content-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Liste des agences</h5>
              <span className="badge bg-orange text-white">{filteredAgences.length} agences</span>
            </div>

            <div className="card-body p-0">
              {tableLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2 text-muted">Chargement des agences...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table custom-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Ville</th>
                        <th>Adresse</th>
                        <th>Contact</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgences.length > 0 ? (
                        filteredAgences.map((agence) => (
                          <tr key={agence.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="agency-icon me-3">
                                  <FaBuilding className="icon-orange" />
                                </div>
                                <div>
                                  <h6 className="mb-0">{agence.nom}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaCity className="text-muted me-2" size={14} />
                                {agence.ville}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaMapMarkerAlt className="text-muted me-2" size={14} />
                                {agence.adresse}
                              </div>
                            </td>
                            <td>
                              <div className="contact-info">
                                <div className="d-flex align-items-center mb-1">
                                  <FaPhone className="text-muted me-2" size={14} />
                                  <span>{agence.telephone}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaEnvelope className="text-muted me-2" size={14} />
                                  <span className="text-muted small">{agence.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="text-end">
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => openEditModal(agence)}
                                >
                                  <FaEdit /> <span className="d-none d-md-inline">Modifier</span>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(agence)}
                                >
                                  <FaPowerOff /> <span className="d-none d-md-inline">Désactiver</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-5">
                            <div className="empty-state">
                              <FaBuilding size={40} className="text-muted mb-3" />
                              <h5>Aucune agence trouvée</h5>
                              <p className="text-muted">
                                {searchTerm
                                  ? "Aucune agence ne correspond à votre recherche"
                                  : "Vous n'avez pas encore créé d'agence"}
                              </p>
                              {searchTerm && (
                                <button
                                  className="btn btn-sm btn-outline-secondary mt-2"
                                  onClick={() => setSearchTerm('')}
                                >
                                  Effacer la recherche
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'agence */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2 text-orange" /> Ajouter une nouvelle agence
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="addAgenceForm" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="nom"
                    name="nom"
                    value={newAgence.nom}
                    onChange={(e) => handleChange(e)}
                    placeholder="Nom de l'agence"
                    required
                  />
                  <label htmlFor="nom">
                    <FaBuilding className="me-1" /> Nom de l'agence
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="ville"
                    name="ville"
                    value={newAgence.ville}
                    onChange={(e) => handleChange(e)}
                    placeholder="Ville"
                    required
                  />
                  <label htmlFor="ville">
                    <FaCity className="me-1" /> Ville
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="adresse"
                    name="adresse"
                    value={newAgence.adresse}
                    onChange={(e) => handleChange(e)}
                    placeholder="Adresse complète"
                    required
                  />
                  <label htmlFor="adresse">
                    <FaMapMarkerAlt className="me-1" /> Adresse complète
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="tel"
                    className="form-control"
                    id="telephone"
                    name="telephone"
                    value={newAgence.telephone}
                    onChange={(e) => handleChange(e)}
                    placeholder="Téléphone"
                    required
                  />
                  <label htmlFor="telephone">
                    <FaPhone className="me-1" /> Téléphone
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newAgence.email}
                    onChange={(e) => handleChange(e)}
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="email">
                    <FaEnvelope className="me-1" /> Email
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="orange" 
            type="submit" 
            form="addAgenceForm" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Enregistrement...
              </>
            ) : (
              'Ajouter l\'agence'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de modification d'agence */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2 text-primary" /> Modifier l'agence
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="editAgenceForm">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="edit-nom"
                    name="nom"
                    value={editAgence.nom}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                  <label htmlFor="edit-nom">
                    <FaBuilding className="me-1" /> Nom de l'agence
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="edit-ville"
                    name="ville"
                    value={editAgence.ville}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                  <label htmlFor="edit-ville">
                    <FaCity className="me-1" /> Ville
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="edit-adresse"
                    name="adresse"
                    value={editAgence.adresse}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                  <label htmlFor="edit-adresse">
                    <FaMapMarkerAlt className="me-1" /> Adresse complète
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="tel"
                    className="form-control"
                    id="edit-telephone"
                    name="telephone"
                    value={editAgence.telephone}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                  <label htmlFor="edit-telephone">
                    <FaPhone className="me-1" /> Téléphone
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="edit-email"
                    name="email"
                    value={editAgence.email}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                  <label htmlFor="edit-email">
                    <FaEnvelope className="me-1" /> Email
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Mise à jour...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaPowerOff className="me-2" /> Confirmation de désactivation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            <div className="d-flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ms-2">
                Cette action désactivera l'agence et pourrait affecter les colis associés.
              </div>
            </div>
          </div>
          <p>
            Êtes-vous sûr de vouloir désactiver l'agence <strong>{selectedAgence?.nom}</strong> située à{' '}
            <strong>{selectedAgence?.ville}</strong> ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Désactivation...
              </>
            ) : (
              'Confirmer la désactivation'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS personnalisé */}
      <style>{`
        .app-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .content-wrapper {
          flex: -1;
          padding: 80px 25px 25px 50px;
          transition: padding 0.3s ease;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 80px 15px 15px 15px;
          }
        }

        .page-header-card {
          background-color: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }

        .content-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          overflow: hidden;
        }

        .card-header {
          background-color: white;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .agency-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 152, 0, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-orange {
          color: #FF9800;
        }

        .btn-orange {
          background-color: #FF9800;
          border-color: #FF9800;
          color: white;
        }

        .btn-orange:hover {
          background-color: #e68a00;
          border-color: #e68a00;
          color: white;
        }

        .bg-orange {
          background-color: #FF9800 !important;
        }

        .text-orange {
          color: #FF9800 !important;
        }

        .custom-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          border-top: none;
          padding: 12px 20px;
        }

        .custom-table td {
          padding: 15px 20px;
          border-color: rgba(0, 0, 0, 0.05);
        }

        .custom-table tr:hover {
          background-color: rgba(0, 0, 0, 0.01);
        }

        .empty-state {
          padding: 40px 0;
          text-align: center;
        }

        .custom-modal .modal-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .custom-modal .modal-footer {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .alert-custom {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Pour les boutons variant="orange" de Bootstrap */
        .btn-orange {
          background-color: #FF9800;
          border-color: #FF9800;
          color: white;
        }
        .btn-orange:hover, .btn-orange:focus, .btn-orange:active {
          background-color: #e68a00 !important;
          border-color: #e68a00 !important;
          color: white !important;
        }
        
        /* Style pour les inputs focus */
        .form-control:focus, .form-floating > .form-control:focus ~ label {
          border-color: #FF9800;
          box-shadow: 0 0 0 0.25rem rgba(255, 152, 0, 0.25);
        }
      `}</style>
    </div>
    </div>
  );
};

export default Agences;