import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerHeader from './composants/header';
import ManagerSidebar from './composants/sidebar';
import { Search, Plus, Users, UserCheck, UserX } from 'lucide-react';

interface User {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  is_active: boolean;
}

const ManagerUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [newUser, setNewUser] = useState({
    nom: '',
    email: '',
    telephone: '',
    role: 'receptionniste',
    password: '000000'
  });
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/by-agence-manager', { headers });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, { headers });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Erreur de recherche', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/create-user-other', newUser, { headers });
      alert(res.data.message);
      fetchUsers();
      setNewUser({ nom: '', email: '', telephone: '', role: 'receptionniste', password: '000000' });
      setShowModal(false); // Close modal after creation
    } catch (error) {
      alert('Erreur lors de la création de l’utilisateur');
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <ManagerHeader />
      <div className="d-flex">
        <ManagerSidebar />
        <main className="flex-grow-1 p-5">
          <div className="container">
            {/* Header Section */}
            <div className="bg-white rounded shadow p-4 mb-4 border-start border-3 border-orange">
              <div className="d-flex align-items-center mb-2">
                <div className="p-2 bg-warning rounded">
                  <Users className="w-6 h-6" />
                </div>
                <h1 className="ms-3 fs-4 text-dark">Gestion des utilisateurs</h1>
              </div>
              <p className="text-muted">Gérez les utilisateurs de votre agence</p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded shadow p-4 mb-4">
              <h3 className="mb-4 d-flex align-items-center">
                <Search className="w-5 h-5 text-warning me-2" />
                Rechercher un utilisateur
              </h3>
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  placeholder="Rechercher par nom ou email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  className="btn btn-warning"
                  onClick={handleSearch}
                >
                  Rechercher
                </button>
              </div>
            </div>

            {/* Create User Button */}
            <button 
              className="btn btn-warning mb-4" 
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4 me-2" />
              Créer un nouvel utilisateur
            </button>

            {/* Users List Section */}
            <div className="bg-white rounded shadow">
              <div className="p-4 bg-warning text-white rounded-top">
                <h3 className="d-flex align-items-center">
                  <Users className="w-5 h-5 me-2" />
                  Liste des utilisateurs ({users.length})
                </h3>
              </div>
              
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.nom}</td>
                          <td>{u.email}</td>
                          <td>{u.telephone}</td>
                          <td>
                            <span className={`badge ${
                              u.role === 'receptionniste' ? 'bg-info' : 'bg-success'
                            }`}>
                              {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                            </span>
                          </td>
                          <td>
                            {u.is_active ? (
                              <span className="badge bg-success">
                                <UserCheck className="w-4 h-4" /> Actif
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                <UserX className="w-4 h-4" /> Inactif
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          <p>Aucun utilisateur trouvé</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Create User Modal */}
          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Créer un nouvel utilisateur</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input 
                      className="form-control" 
                      placeholder="Nom complet"
                      value={newUser.nom} 
                      onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      className="form-control" 
                      placeholder="email@example.com"
                      value={newUser.email} 
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Téléphone</label>
                    <input 
                      className="form-control" 
                      placeholder="+237 XXX XXX XXX"
                      value={newUser.telephone} 
                      onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rôle</label>
                    <select 
                      className="form-select" 
                      value={newUser.role} 
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="receptionniste">Réceptionniste</option>
                      <option value="livreur">Livreur</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="button" className="btn btn-warning" onClick={handleCreateUser}>Créer</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerUsers;