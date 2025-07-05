import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Building, Package, Search, RefreshCw, AlertCircle, Map, Calendar, Weight, TrendingUp } from 'lucide-react';
import SuperadminSidebar from './composants/sidebar';
import SuperadminHeader from './composants/header';

const API_URL = 'http://localhost:5000/api';

interface Agence {
  id: number;
  nom: string;
  adresse?: string;
  ville?: string;
}

interface Colis {
  id: number;
  code_suivi: string;
  destinataire: string;
  statut: string;
  agence_arrivee: number | null;
  date_creation?: string;
  poids?: number;
  description?: string;
}

const SuperAdminHistorique: React.FC = () => {
  const [agences, setAgences] = useState<Agence[]>([]);
  const [colis, setColis] = useState<Colis[]>([]);
  const [selectedAgenceId, setSelectedAgenceId] = useState<number | null>(null);
  const [selectedAgenceNom, setSelectedAgenceNom] = useState<string>('');
  const [loading, setLoading] = useState<{ agences: boolean; colis: boolean }>({
    agences: false,
    colis: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getAxiosConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }, []);

  const extractUserRole = useCallback((): string => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return '';
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch (error) {
      console.error("Erreur lors du décodage du token JWT:", error);
      return '';
    }
  }, []);

  const fetchAgences = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, agences: true }));
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/agences`, getAxiosConfig());
      setAgences(response.data);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des agences:', err);
      setError(err.response?.data?.message || 'Impossible de récupérer les agences');
    } finally {
      setLoading(prev => ({ ...prev, agences: false }));
    }
  }, [getAxiosConfig]);

  const fetchColisByAgence = useCallback(async (agenceId: number): Promise<void> => {
    setLoading(prev => ({ ...prev, colis: true }));
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_URL}/colis/historique/${agenceId}`, 
        getAxiosConfig()
      );
      setColis(response.data);
      
      const agence = agences.find(a => a.id === agenceId);
      setSelectedAgenceId(agenceId);
      setSelectedAgenceNom(agence?.nom || `Agence ${agenceId}`);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des colis:', err);
      setError(err.response?.data?.message || 'Impossible de récupérer les colis');
      setColis([]);
    } finally {
      setLoading(prev => ({ ...prev, colis: false }));
    }
  }, [agences, getAxiosConfig]);

  useEffect(() => {
    const userRole = extractUserRole();
    setRole(userRole);
    
    if (userRole === 'superadmin') {
      fetchAgences();
    }
  }, [extractUserRole, fetchAgences]);

  const filteredColis = colis.filter(colis => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      colis.code_suivi.toLowerCase().includes(search) ||
      colis.destinataire.toLowerCase().includes(search) ||
      colis.statut.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'Livré':
        return 'success';
      case 'En transit':
        return 'warning';
        case 'Expedié':
        return 'warning';
        case 'Enregistré':
        return 'warning';
        case 'Assigné':
        return 'warning';
      case 'En attente':
        return 'info';
      case 'Annulé':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Calcul des statistiques
  const getColisStats = () => {
    if (!colis.length) return { total: 0, transit: 0, livré: 0, annulé: 0, assigné: 0, expedié: 0, enregistré: 0 };
    
    return {
      total: colis.length,
      transit: colis.filter(c => c.statut.toLowerCase() === 'En transit').length,
      livré: colis.filter(c => c.statut.toLowerCase() === 'Livré').length,
      assigné: colis.filter(c => c.statut.toLowerCase() === 'Assigné').length,
      expedié: colis.filter(c => c.statut.toLowerCase() === 'Expedié').length,
      enregistré: colis.filter(c => c.statut.toLowerCase() === 'Enregistré').length,
      annulé: colis.filter(c => c.statut.toLowerCase() === 'Annulé').length
    };
  };
  
  const stats = getColisStats();

  if (role && role !== 'superadmin') {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow">
          <div className="card-body text-center p-5">
            <AlertCircle size={64} className="text-danger mb-4" />
            <h2 className="mb-3">Accès restreint</h2>
            <p className="lead mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            </p>
            <a href="/" className="btn" style={{ backgroundColor: '#FF8C00', color: 'white' }}>
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
   <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <SuperadminHeader />
      <div className="d-flex flex-grow-1">
        <SuperadminSidebar />
        <div className="flex-grow-1 p-4">
        
        <div className="col-md-14 p-5">
          <div className="card shadow-sm border-0 mb-4 "  >
            <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ borderBottom: '3px solid #FF8C00' }}>
              <h4 className="mb-0 d-flex align-items-center">
                <Calendar className="me-2" style={{ color: '#FF8C00' }} />
                Historique des Colis par Agence
              </h4>
              <button 
                className="btn d-flex align-items-center gap-2" 
                onClick={fetchAgences}
                disabled={loading.agences}
                style={{ backgroundColor: '#FFF3E0', color: '#FF8C00' }}
              >
                <RefreshCw size={16} className={loading.agences ? "spinner" : ""} /> 
                Actualiser
              </button>
            </div>
            
            {error && (
              <div className="alert alert-danger d-flex align-items-center m-3" role="alert">
                <AlertCircle size={18} className="me-2" />
                <div>{error}</div>
              </div>
            )}

            <div className="card-body">
              <h5 className="mb-3 d-flex align-items-center">
                <Building size={18} className="me-2" style={{ color: '#FF8C00' }} /> 
                Sélectionnez une agence
              </h5>
              
              {loading.agences ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border" style={{ color: '#FF8C00' }} role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                  {agences.length > 0 ? (
                    agences.map(agence => (
                      <div className="col" key={agence.id}>
                        <div 
                          className={`card h-100 border-0 shadow-sm hover-card ${
                            selectedAgenceId === agence.id ? 'selected-card' : ''
                          }`}
                          onClick={() => fetchColisByAgence(agence.id)}
                          style={{ 
                            cursor: 'pointer',
                            borderLeft: selectedAgenceId === agence.id ? '4px solid #FF8C00' : '',
                            backgroundColor: selectedAgenceId === agence.id ? '#FFF3E0' : 'white'
                          }}
                        >
                          <div className="card-body d-flex flex-column align-items-center p-4">
                            <div className="icon-circle mb-3">
                              <Building size={24} />
                            </div>
                            <h5 className="card-title text-center mb-2">{agence.nom}</h5>
                            {agence.ville && (
                              <p className="card-text text-muted text-center mb-0">
                                {agence.ville}
                              </p>
                            )}
                            {agence.adresse && (
                              <p className="card-text small text-center text-muted mt-2 mb-0">
                                <Map size={14} className="me-1" /> {agence.adresse}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-4">
                      <p className="text-muted mb-0">Aucune agence disponible</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedAgenceId && (
            <>
              {/* Statistiques */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <Package size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Total des colis</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.total}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                 <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <TrendingUp size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Enregistré</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.enregistré}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <TrendingUp size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">En transit</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.transit}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <TrendingUp size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Assigné</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.assigné}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <TrendingUp size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Expedié</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.expedié}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <Weight size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Livré</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.livré}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#FFF3E0' }}>
                        <AlertCircle size={24} style={{ color: '#FF8C00' }} />
                      </div>
                      <div>
                        <h6 className="mb-0">Annulé</h6>
                        <h3 className="mb-0" style={{ color: '#FF8C00' }}>{stats.annulé}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Liste des colis */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3" style={{ borderBottom: '2px solid #FFF3E0' }}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h5 className="mb-0 d-flex align-items-center">
                      <Package size={18} className="me-2" style={{ color: '#FF8C00' }} /> 
                      <span style={{ color: '#FF8C00' }}>{selectedAgenceNom}</span> - Historique des colis
                    </h5>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#FF8C00', color: 'white', border: 'none' }}>
                          <Search size={16} />
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Rechercher par code, destinataire..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderColor: '#FFD8A8' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  {loading.colis ? (
                    <div className="d-flex justify-content-center py-5">
                      <div className="spinner-border" style={{ color: '#FF8C00' }} role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead style={{ backgroundColor: '#FFF3E0' }}>
                          <tr>
                            <th>Code de suivi</th>
                            <th>Destinataire</th>
                            <th>Date de création</th>
                            <th>Statut</th>
                            <th>Agence d'arrivée</th>
                            <th>Poids</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredColis.length > 0 ? (
                            filteredColis.map(colis => (
                              <tr key={colis.id}>
                                <td className="fw-medium" style={{ color: '#FF8C00' }}>{colis.code_suivi}</td>
                                <td>{colis.destinataire}</td>
                                <td>{formatDate(colis.date_creation)}</td>
                                <td>
                                  <span className={`badge bg-${getStatusColor(colis.statut)}`}>
                                    {colis.statut}
                                  </span>
                                </td>
                                <td>
                                  {colis.agence_arrivee ? 
                                    agences.find(a => a.id === colis.agence_arrivee)?.nom || colis.agence_arrivee : 
                                    <span className="text-muted">Non définie</span>}
                                </td>
                                <td>
                                  {colis.poids ? 
                                    <span className="d-flex align-items-center">
                                      <Weight size={14} className="me-1" /> {colis.poids} kg
                                    </span> : 
                                    <span className="text-muted">N/A</span>}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-5 text-muted">
                                {searchTerm ? 
                                  <div>
                                    <Search size={32} className="mb-2" style={{ color: '#FF8C00' }} />
                                    <p>Aucun résultat trouvé pour cette recherche</p>
                                  </div> : 
                                  <div>
                                    <Package size={32} className="mb-2" style={{ color: '#FF8C00' }} />
                                    <p>Aucun colis disponible pour cette agence</p>
                                  </div>
                                }
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

// Styles CSS
const styles = `
.icon-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 140, 0, 0.1);
  color: #FF8C00;
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 140, 0, 0.1) !important;
}

.selected-card {
  box-shadow: 0 5px 15px rgba(255, 140, 0, 0.2) !important;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default SuperAdminHistorique;