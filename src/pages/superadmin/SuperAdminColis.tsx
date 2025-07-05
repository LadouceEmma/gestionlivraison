import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Package, Search, RefreshCw, AlertCircle, Trash2, Info } from 'lucide-react';
import SuperadminSidebar from './composants/sidebar';
import SuperadminHeader from './composants/header';

const API_URL = 'http://localhost:5000/api';

const SuperAdminColis: React.FC = () => {
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColis, setSelectedColis] = useState<any | null>(null);

  const getAxiosConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }, []);

  const fetchColis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/colis/get_receptioniste`, getAxiosConfig());
      setColis(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des colis:', err);
      setError('Impossible de récupérer les colis');
    } finally {
      setLoading(false);
    }
  };

  const filteredColis = colis.filter(c => 
    c.code_suivi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.destinataire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) {
      try {
        await axios.delete(`${API_URL}/colis/${id}`, getAxiosConfig());
        fetchColis(); // Recharger la liste
      } catch (err) {
        console.error('Erreur lors de la suppression du colis:', err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'livré':
        return 'bg-success';
      case 'en transit':
        return 'bg-warning text-dark';
      case 'en attente':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  useEffect(() => {
    fetchColis();
  }, []);

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <SuperadminHeader />
      <div className="d-flex flex-grow-1">
        <SuperadminSidebar />
        <div className="flex-grow-1 p-2">
        
        <div className="col-md-14 p-4">
        {/* Main container with orange accent */}
        <div className="container py-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom border-orange d-flex justify-content-between align-items-center" style={{ borderBottom: '3px solid #FF8C00' }}>
              <h4 className="mb-0 text-dark d-flex align-items-center">
                <Package className="me-2" style={{ color: '#FF8C00' }} />
                Gestion des Colis
              </h4>
              <button 
                className="btn text-white" 
                onClick={fetchColis} 
                disabled={loading}
                style={{ backgroundColor: '#FF8C00' }}
              >
                <RefreshCw size={18} className="me-2" />
                Actualiser
              </button>
            </div>
            
            <div className="card-body">
              {/* Search bar with orange accent */}
              <div className="input-group mb-4">
                <span className="input-group-text" style={{ backgroundColor: '#FF8C00', color: 'white' }}>
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Rechercher par code de suivi ou destinataire"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                  <AlertCircle className="me-2" />
                  {error}
                </div>
              )}

              {/* Loading spinner */}
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border" style={{ color: '#FF8C00' }} role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle border-0">
                    <thead style={{ backgroundColor: '#FFF3E0' }}>
                      <tr>
                        <th className="border-0">Code de Suivi</th>
                        <th className="border-0">Destinataire</th>
                        <th className="border-0">Receptioniste</th>
                        <th className="border-0">Statut</th>
                        <th className="border-0 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredColis.length > 0 ? (
                        filteredColis.map(colis => (
                          <tr key={colis.id} className="border-bottom">
                            <td className="fw-bold" style={{ color: '#FF8C00' }}>{colis.code_suivi}</td>
                            <td>{colis.destinataire}</td>
                            <td>{colis.receptionniste ? colis.receptionniste.nom : 'Inconnu'}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(colis.statut)}`}>
                                {colis.statut}
                              </span>
                            </td>
                            <td className="text-end">
                              <button className="btn btn-sm me-2" style={{ backgroundColor: '#FFF3E0', color: '#FF8C00' }}>
                                <Info size={16} />
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleDelete(colis.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            Aucun colis trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Summary stats */}
              <div className="row mt-4 g-3">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <Package size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Total des colis</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{colis.length}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <RefreshCw size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">En transit</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>
                          {colis.filter(c => c.statut.toLowerCase() === 'en transit').length}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <AlertCircle size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">En attente</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>
                          {colis.filter(c => c.statut.toLowerCase() === 'en attente').length}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>

  );
};

export default SuperAdminColis;