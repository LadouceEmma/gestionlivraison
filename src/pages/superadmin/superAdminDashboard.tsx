import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import SuperadminHeader from './composants/header';
import SuperadminSidebar from './composants/sidebar';
import '../../App.css';

// Couleurs plus harmonieuses et modernes
const COLORS = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];
const STATUS_COLORS = {
  'En attente': '#4361ee',
  'En transit': '#4cc9f0',
  'Livré': '#06d6a0',
  'Retourné': '#f72585',
  'Annulé': '#3a0ca3'
};

interface Agence {
  id: number;
  nom: string;
}

interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  agence?: Agence;
  parent?: { id: number; nom: string };
}

const SuperadminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [agences, setAgences] = useState<Agence[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAgence, setSelectedAgence] = useState('');
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState('bar'); // 'bar' ou 'pie'

  const roles = ['superadmin', 'admin', 'manager', 'receptionniste', 'livreur', 'client'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [statsRes, usersRes, agencesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/superadmin/dashboard-stats', { headers }),
          axios.get('http://localhost:5000/api/users', { headers }),
          axios.get('http://localhost:5000/api/agences', { headers })
        ]);
        
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setAgences(agencesRes.data);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    (selectedRole ? user.role === selectedRole : true) &&
    (selectedAgence ? user.agence?.id.toString() === selectedAgence : true)
  );

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedRole('');
    setSelectedAgence('');
  };

  // Format tooltip personnalisé pour les graphiques
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 shadow rounded">
          <p className="fw-bold mb-1">{`${label}`}</p>
          <p className="mb-0 text-primary">{`Nombre: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h5 className="text-secondary">Chargement du tableau de bord...</h5>
        </div>
      </div>
    );
  }

  // Formatage des données pour les graphiques
  const getChartData = () => {
    if (!stats?.colis_par_statut) return [];
    return stats.colis_par_statut.map((item: any) => ({
      ...item,
      fill: STATUS_COLORS[item.statut] || COLORS[0]
    }));
  };

  // Calculer des statistiques supplémentaires
  const calculateExtraStats = () => {
    if (!stats) return { usersPerRole: [] };
    
    const usersPerRole = roles.map((role) => ({
      role,
      count: users.filter(u => u.role === role).length
    }));
    
    return { usersPerRole };
  };

  const extraStats = calculateExtraStats();

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <SuperadminHeader />
      <div className="d-flex flex-grow-2">
        <SuperadminSidebar />
        <main className="flex-grow-1 p-4">
          <div className="container-fluid px-2">
            {/* En-tête du tableau de bord */}
            <div className="row mb-4 align-items-center">
              <div className="col-md-6">
                <h2 className="fw-bold text-primary mb-0">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Tableau de Bord Superadmin
                </h2>
                <p className="text-muted">Vue d'ensemble des opérations et des utilisateurs</p>
              </div>
              <div className="col-md-6 text-md-end">
                <button 
                  className="btn btn-outline-primary rounded-pill" 
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> Actualiser les données
                </button>
              </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="row mb-4">
              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className="card-body position-relative">
                    <div className="position-absolute top-0 end-0 p-3 opacity-25">
                      <i className="bi bi-box-seam fs-1 text-primary"></i>
                    </div>
                    <h6 className="text-uppercase text-muted mb-2">Total Colis</h6>
                    <h2 className="display-5 fw-bold text-primary">{stats.total_colis}</h2>
                    <p className="text-muted mb-0">Tous statuts confondus</p>
                  </div>
                  <div className="card-footer bg-primary py-1"></div>
                </div>
              </div>
              
              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className="card-body position-relative">
                    <div className="position-absolute top-0 end-0 p-3 opacity-25">
                      <i className="bi bi-people fs-1 text-success"></i>
                    </div>
                    <h6 className="text-uppercase text-muted mb-2">Total Utilisateurs</h6>
                    <h2 className="display-5 fw-bold text-success">{stats.total_users}</h2>
                    <p className="text-muted mb-0">Tous rôles confondus</p>
                  </div>
                  <div className="card-footer bg-success py-1"></div>
                </div>
              </div>
              
              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className="card-body position-relative">
                    <div className="position-absolute top-0 end-0 p-3 opacity-25">
                      <i className="bi bi-building fs-1 text-info"></i>
                    </div>
                    <h6 className="text-uppercase text-muted mb-2">Total Agences</h6>
                    <h2 className="display-5 fw-bold text-info">{agences.length}</h2>
                    <p className="text-muted mb-0">Toutes agences confondues</p>
                  </div>
                  <div className="card-footer bg-info py-1"></div>
                </div>
              </div>
              
              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className="card-body position-relative">
                    <div className="position-absolute top-0 end-0 p-3 opacity-25">
                      <i className="bi bi-truck fs-1 text-warning"></i>
                    </div>
                    <h6 className="text-uppercase text-muted mb-2">Livreurs Actifs</h6>
                    <h2 className="display-5 fw-bold text-warning">
                      {users.filter(u => u.role === 'livreur').length}
                    </h2>
                    <p className="text-muted mb-0">Disponibles pour livraison</p>
                  </div>
                  <div className="card-footer bg-warning py-1"></div>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="row mb-4">
              <div className="col-lg-8 mb-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Répartition des colis par statut</h5>
                    <div className="btn-group btn-group-sm" role="group">
                      <button 
                        type="button" 
                        className={`btn ${chartMode === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setChartMode('bar')}
                      >
                        <i className="bi bi-bar-chart-fill me-1"></i> Barres
                      </button>
                      <button 
                        type="button" 
                        className={`btn ${chartMode === 'pie' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setChartMode('pie')}
                      >
                        <i className="bi bi-pie-chart-fill me-1"></i> Cercle
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={350}>
                      {chartMode === 'bar' ? (
                        <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="statut" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar 
                            dataKey="count" 
                            name="Nombre de colis" 
                            radius={[8, 8, 0, 0]}
                            barSize={60}
                          >
                            {getChartData().map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={getChartData()}
                            dataKey="count"
                            nameKey="statut"
                            cx="50%"
                            cy="50%"
                            outerRadius={130}
                            innerRadius={60}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={true}
                          >
                            {getChartData().map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} colis`, 'Quantité']} />
                          <Legend />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 mb-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-white border-bottom-0">
                    <h5 className="card-title mb-0">Répartition des utilisateurs par rôle</h5>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={extraStats.usersPerRole}
                          dataKey="count"
                          nameKey="role"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percent }) => 
                            percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                        >
                          {extraStats.usersPerRole.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} utilisateurs`, 'Quantité']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-bottom-0">
                <h5 className="card-title mb-0">
                  <i className="bi bi-funnel me-2"></i>
                  Filtres
                </h5>
              </div>
              <div className="card-body pt-0">
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="form-label text-muted">Par rôle</label>
                    <select
                      className="form-select border-0 bg-light"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Tous les rôles</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label text-muted">Par agence</label>
                    <select
                      className="form-select border-0 bg-light"
                      value={selectedAgence}
                      onChange={(e) => setSelectedAgence(e.target.value)}
                    >
                      <option value="">Toutes les agences</option>
                      {agences.map((a) => (
                        <option key={a.id} value={a.id}>{a.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={resetFilters}
                    >
                      <i className="bi bi-x-circle me-1"></i> Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title d-flex align-items-center mb-0">
                  <i className="bi bi-people me-2"></i>
                  Liste des utilisateurs
                  <span className="badge bg-primary ms-2 rounded-pill">{filteredUsers.length}</span>
                </h5>
                <div className="input-group input-group-sm w-auto">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input type="text" className="form-control bg-light border-0" placeholder="Rechercher..." />
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0">Nom</th>
                        <th className="border-0">Email</th>
                        <th className="border-0">Rôle</th>
                        <th className="border-0">Agence</th>
                        <th className="border-0">Parent</th>
                        <th className="border-0 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <tr key={user.id}>
                            <td className="align-middle fw-medium">{user.nom}</td>
                            <td className="align-middle">
                              <span className="d-flex align-items-center">
                                <i className="bi bi-envelope-fill text-muted me-2"></i>
                                {user.email}
                              </span>
                            </td>
                            <td className="align-middle">
                              <span className={`badge ${
                                user.role === 'superadmin' ? 'bg-danger' :
                                user.role === 'admin' ? 'bg-primary' :
                                user.role === 'manager' ? 'bg-success' :
                                user.role === 'receptionniste' ? 'bg-info' :
                                user.role === 'livreur' ? 'bg-warning text-dark' :
                                'bg-secondary'
                              } rounded-pill px-3 py-2`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="align-middle">
                              {user.agence ? (
                                <span className="d-flex align-items-center">
                                  <i className="bi bi-building text-muted me-2"></i>
                                  {user.agence.nom}
                                </span>
                              ) : (
                                <span className="text-muted fst-italic">—</span>
                              )}
                            </td>
                            <td className="align-middle">
                              {user.parent ? (
                                <span className="d-flex align-items-center">
                                  <i className="bi bi-person text-muted me-2"></i>
                                  {user.parent.nom}
                                </span>
                              ) : (
                                <span className="text-muted fst-italic">—</span>
                              )}
                            </td>
                            <td className="align-middle text-end">
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-outline-secondary">
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-2 d-block mb-3"></i>
                            Aucun utilisateur ne correspond aux critères de filtrage
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center py-3">
                <div className="text-muted small">
                  Affichage de {filteredUsers.length} sur {users.length} utilisateurs
                </div>
                <nav aria-label="Pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Précédent</a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">1</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">2</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">3</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">Suivant</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-4 text-center text-muted p-3">
              <small>&copy; 2025 | Tableau de bord SuperAdmin</small>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;