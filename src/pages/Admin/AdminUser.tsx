import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './composants/sidebar';
import AdminHeader from './composants/header';
//import './AdminUserManagement.css';

interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  is_active: boolean;
}

const API_BASE_URL = 'http://localhost:5000/api'; // Modifier selon ton backend

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [managerData, setManagerData] = useState({ nom: '', email: '', password: '', telephone: '', role:'' });

  const token = localStorage.getItem('token');

  // Charger les utilisateurs et les clients
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/by-agence`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs', error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/clients/agence`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(res.data);
    } catch (error) {
      console.error('Erreur chargement clients', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchClients();
  }, []);

  // Créer manager
  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/create-user-other`, managerData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Manager créé avec succès');
      setManagerData({ nom: '', email: '', password: '', telephone: '', role:'' });
      fetchUsers();
    } catch (error) {
      alert("Erreur lors de la création du manager");
    }
  };

  // Bloquer / débloquer
  const toggleBlock = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${id}/active`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      alert("Erreur lors du changement de statut de l'utilisateur");
    }
  };

  return (
   <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <AdminHeader />
      <div className="d-flex flex-grow-2">
        <AdminSidebar />
        <main className="flex-grow-1 p-4">
      <h2 className="text-orange mb-4">Gestion des utilisateurs de l'agence</h2>

      {/* CREATE MANAGER */}
      <div className="card mb-4">
        <div className="card-header bg-orange text-white">Créer un Manager</div>
        <div className="card-body">
          <form onSubmit={handleCreateManager}>
            <div className="row">
              <div className="col-md-3">
                <input type="text" className="form-control mb-2" placeholder="Nom"
                  value={managerData.nom} onChange={e => setManagerData({ ...managerData, nom: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <input type="email" className="form-control mb-2" placeholder="Email"
                  value={managerData.email} onChange={e => setManagerData({ ...managerData, email: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <input type="password" className="form-control mb-2" placeholder="Mot de passe"
                  value={managerData.password} onChange={e => setManagerData({ ...managerData, password: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control mb-2" placeholder="Téléphone"
                  value={managerData.telephone} onChange={e => setManagerData({ ...managerData, telephone: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control mb-2" placeholder="Role"
                  value={managerData.role} onChange={e => setManagerData({ ...managerData, role: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-warning text-white">Créer</button>
          </form>
        </div>
      </div>

      {/* UTILISATEURS */}
      <div className="card mb-4">
        <div className="card-header bg-orange text-white">Utilisateurs de l'agence</div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? 'Actif' : 'Bloqué'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-warning"
                      onClick={() => toggleBlock(user.id)}>
                      {user.is_active ? 'Bloquer' : 'Débloquer'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5}>Aucun utilisateur trouvé</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLIENTS */}
      <div className="card">
        <div className="card-header bg-orange text-white">Clients de l'agence</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Colis envoyés</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.nom}</td>
                  <td>{client.email}</td>
                  <td>{/* Ajouter le total colis si backend retourne */}</td>
                </tr>
              ))}
              {clients.length === 0 && <tr><td colSpan={3}>Aucun client trouvé</td></tr>}
            </tbody>
          </table>
        </div>
      
    </div>
    </main>
    </div>
    </div>
  );
};

export default AdminUserManagement;
