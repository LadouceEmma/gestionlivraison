import { useState, useEffect } from "react";
import axios from "axios";
import SuperadminHeader from "./composants/header";
import SuperadminSidebar from "./composants/sidebar";

// Types
type UserType = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  agence_id: number;
  is_active: boolean;
  created_at: string;
};

type AgenceType = {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
};

// Composant principal
const Users = () => {
  const API_URL = "http://localhost:5000/api";
  const [users, setUsers] = useState<UserType[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [agencies, setAgencies] = useState<AgenceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    email: "",
    telephone: "",
    role: "admin",
    agence_id: "",
    password: "000000",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAdmins(),
          fetchAllUsers(),
          fetchAgencies(),
        ]);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/by-role?role=admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch {
      setError("Impossible de récupérer la liste des administrateurs");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllUsers(response.data);
    } catch {
      setError("Impossible de récupérer la liste des utilisateurs");
    }
  };

  const fetchAgencies = async () => {
    try {
      const response = await axios.get(`${API_URL}/agences`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAgencies(response.data);
    } catch {
      setError("Impossible de récupérer la liste des agences");
    }
  };

  const toggleUserActiveStatus = async (userId: number) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/active`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) =>
        prev.map(user => user.id === userId ? { ...user, is_active: !user.is_active } : user)
      );
    } catch {
      setError("Erreur lors de la modification du statut");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create-admin`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) => [...prev, { ...newUser, id: Date.now(), is_active: true }]);
      resetNewUserForm();
    } catch {
      setError("Erreur lors de la création de l'utilisateur");
    }
  };

  const resetNewUserForm = () => {
    setShowCreateUserModal(false);
    setNewUser({
      nom: "",
      email: "",
      telephone: "",
      role: "admin",
      agence_id: "",
      password: "000000",
    });
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) =>
        prev.map(user => user.id === userId ? { ...user, role: newRole } : user)
      );
    } catch {
      setError("Erreur lors de la mise à jour du rôle");
    }
  };

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <SuperadminHeader />
      <div className="d-flex flex-grow-1">
        <SuperadminSidebar />
        <div className="flex-grow-1 p-4">
          <div className="col-md-12 p-5">
            <div className="card rounded-4 border-0 shadow">
              <div className="card-header bg-gradient bg-orange text-white rounded-top-4 border-0 py-3">
                <div className="d-flex justify-content-between align-items-center px-3">
                  <h3 className="card-title fw-bold mb-0">
                    <i className="bi bi-people-fill me-2"></i>Gestion des Administrateurs
                  </h3>
                  <div>
                    <button 
                      onClick={() => setShowCreateUserModal(true)} 
                      className="btn btn-light text-orange fw-bold me-2">
                      <i className="bi bi-plus-circle-fill me-1"></i> Créer un utilisateur
                    </button>
                    <button 
                      onClick={() => setUsers(allUsers)} 
                      className="btn btn-outline-light">
                      <i className="bi bi-people-fill me-1"></i> Voir tous les utilisateurs
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light border-orange">
                      <tr>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Nom</th>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Email</th>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Téléphone</th>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Rôle</th>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Agence</th>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Statut</th>
                        <th className="text-uppercase small fw-bold text-orange px-3 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-5">
                            <div className="spinner-border text-orange" role="status">
                              <span className="visually-hidden">Chargement...</span>
                            </div>
                            <p className="mt-3 mb-0 text-orange">Chargement des données...</p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={7} className="text-center py-5">
                            <div className="alert alert-danger d-inline-block">
                              <i className="bi bi-exclamation-triangle-fill me-2"></i>
                              {error}
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-5">
                            <div className="alert alert-info d-inline-block">
                              <i className="bi bi-info-circle-fill me-2"></i>
                              Aucun utilisateur trouvé
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-bottom">
                            <td className="px-3 py-3">
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle bg-orange text-white me-2">
                                  {user.nom.charAt(0).toUpperCase()}
                                </div>
                                <span className="fw-medium">{user.nom}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3">{user.email}</td>
                            <td className="px-3 py-3">{user.telephone}</td>
                            <td className="px-3 py-3">
                              <span className={`badge rounded-pill ${user.role === 'admin' ? 'bg-orange' : 'bg-cyan'} py-2 px-3`}>
                                {user.role === 'admin' ? 'Administrateur' : 'Manager'}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              {user.agence_id ? 
                                agencies.find(a => a.id === user.agence_id)?.nom || user.agence_id : 
                                <span className="text-muted fst-italic">Non définie</span>}
                            </td>
                            <td className="px-3 py-3">
                              <span className={`badge rounded-pill ${user.is_active ? 'bg-success' : 'bg-danger'} py-2 px-3`}>
                                {user.is_active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="btn-group">
                                <button 
                                  onClick={() => toggleUserActiveStatus(user.id)} 
                                  className={`btn ${user.is_active ? 'btn-soft-danger' : 'btn-soft-success'} rounded me-2`}>
                                  {user.is_active ? 
                                    <><i className="bi bi-slash-circle-fill me-1"></i> Désactiver</> : 
                                    <><i className="bi bi-check-circle-fill me-1"></i> Activer</>}
                                </button>
                                <button 
                                  onClick={() => updateUserRole(user.id, user.role === "admin" ? "manager" : "admin")} 
                                  className="btn btn-soft-orange rounded">
                                  {user.role === "admin" ? 
                                    <><i className="bi bi-arrow-down-circle-fill me-1"></i> Retrograder</> : 
                                    <><i className="bi bi-arrow-up-circle-fill me-1"></i> Promouvoir</>}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Create User Modal */}
          {showCreateUserModal && (
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
                  <div className="modal-header bg-orange text-white border-0">
                    <h5 className="modal-title fw-bold">
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Créer un Administrateur
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close btn-close-white" 
                      onClick={() => setShowCreateUserModal(false)}
                      aria-label="Close">
                    </button>
                  </div>
                  <form onSubmit={handleCreateUser}>
                    <div className="modal-body p-4">
                      {renderInputFields()}
                    </div>
                    <div className="modal-footer bg-light border-0">
                      <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        aria-label="Close"
                        onClick={() => setShowCreateUserModal(false)}
                      ></button>
                      <button type="submit" className="btn btn-orange fw-bold">
                        <i className="bi bi-check-circle me-1"></i> Créer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderInputFields() {
    return (
      <>
        <InputField 
          label="Nom complet" 
          type="text" 
          value={newUser.nom} 
          onChange={(value) => setNewUser({ ...newUser, nom: value })} 
          placeholder="Entrez le nom complet" 
          icon="bi-person-fill" 
          required 
        />
        <InputField 
          label="Email" 
          type="email" 
          value={newUser.email} 
          onChange={(value) => setNewUser({ ...newUser, email: value })} 
          placeholder="exemple@domaine.com" 
          icon="bi-envelope-fill" 
          required 
        />
        <InputField 
          label="Téléphone" 
          type="text" 
          value={newUser.telephone} 
          onChange={(value) => setNewUser({ ...newUser, telephone: value })} 
          placeholder="Ex: +33 6 12 34 56 78" 
          icon="bi-telephone-fill" 
          required 
        />
        <SelectField 
          label="Rôle" 
          value={newUser.role} 
          onChange={(value) => setNewUser({ ...newUser, role: value })} 
          options={[{ value: "admin", label: "Administrateur" }, { value: "manager", label: "Manager" }]} 
          icon="bi-shield-lock-fill" 
          required 
        />
        <SelectField 
          label="Agence"
          value={newUser.agence_id}
          onChange={(value) => setNewUser({ ...newUser, agence_id: value })}
          options={agencies.map(agency => ({ value: agency.id, label: agency.nom }))}
          icon="bi-building-fill"
          required
        />
        <InputField 
          label="Mot de passe par défaut" 
          type="text" 
          value={newUser.password} 
          onChange={(value) => setNewUser({ ...newUser, password: value })} 
          icon="bi-key-fill" 
          required 
        />
      </>
    );
  }
};

const InputField = ({ label, type, value, onChange, placeholder, icon, required }) => (
  <div className="mb-3">
    <label className="form-label fw-medium text-orange">{label}</label>
    <div className="input-group">
      <span className="input-group-text bg-light border-orange">
        <i className={`bi ${icon} text-orange`}></i>
      </span>
      <input 
        type={type} 
        className="form-control border-orange" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        required={required} 
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, icon, required }) => (
  <div className="mb-3">
    <label className="form-label fw-medium text-orange">{label}</label>
    <div className="input-group">
      <span className="input-group-text bg-light border-orange">
        <i className={`bi ${icon} text-orange`}></i>
      </span>
      <select 
        className="form-select border-orange" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        required={required}
      >
        <option value="">Sélectionner</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  </div>
);

// CSS styles omitted for brevity

export default Users;