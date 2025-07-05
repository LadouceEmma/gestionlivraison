import { useState, useEffect } from "react";
import { Bell, LogOut, Menu, User,  Settings, List, Home } from "lucide-react";
import axios from "axios";

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

// Composant Header
const Header = ({ 
  currentView, 
  currentUser 
}: { 
  currentView: string; 
  currentUser: UserType | null
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {currentView === "dashboard" && "Tableau de Bord"}
          {currentView === "admins" && "Gestion des Administrateurs"}
          {currentView === "profile" && "Mon Profil"}
        </h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              {currentUser?.nom?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium">{currentUser?.nom}</div>
              <div className="text-xs text-gray-500">{currentUser?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Composant Sidebar
const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentView, 
  setCurrentView 
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void; 
  currentView: string; 
  setCurrentView: (view: string) => void;
}) => {
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-orange-500 text-white transition-all duration-300 ease-in-out flex flex-col p-4`}
    >
      <div className="flex items-center justify-between mb-10 mt-2">
        <h1 className={`${sidebarOpen ? "block" : "hidden"} font-bold text-xl`}>
          Super Admin
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`w-full flex items-center p-3 rounded-md hover:bg-orange-600 transition-colors ${
                currentView === "dashboard" ? "bg-orange-600" : ""
              }`}
            >
              <Home size={20} />
              <span className={`${sidebarOpen ? "ml-3 block" : "hidden"}`}>
                Tableau de bord
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView("admins")}
              className={`w-full flex items-center p-3 rounded-md hover:bg-orange-600 transition-colors ${
                currentView === "admins" ? "bg-orange-600" : ""
              }`}
            >
              <Users size={20} />
              <span className={`${sidebarOpen ? "ml-3 block" : "hidden"}`}>
                Administrateurs
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView("profile")}
              className={`w-full flex items-center p-3 rounded-md hover:bg-orange-600 transition-colors ${
                currentView === "profile" ? "bg-orange-600" : ""
              }`}
            >
              <User size={20} />
              <span className={`${sidebarOpen ? "ml-3 block" : "hidden"}`}>
                Mon Profil
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button className="w-full flex items-center p-3 rounded-md hover:bg-orange-600 transition-colors">
          <LogOut size={20} />
          <span className={`${sidebarOpen ? "ml-3 block" : "hidden"}`}>
            Déconnexion
          </span>
        </button>
      </div>
    </div>
  );
};

const Users = () => {
  // API Configuration
  const API_URL = "http://localhost:5000/api"; // À remplacer par l'URL de votre API
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  
  // States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [users, setUsers] = useState<UserType[]>([]);
  const [agencies, setAgencies] = useState<AgenceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
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
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Axios configuration avec intercepteur pour le token
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, [token]);

  // Récupérer l'utilisateur courant
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/courant`);
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur courant:", err);
      setError("Impossible de récupérer les informations de l'utilisateur");
    }
  };

  // Récupérer tous les administrateurs
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users/by-role?role=admin`);
      const managerResponse = await axios.get(`${API_URL}/users/by-role?role=manager`);
      setUsers([...response.data, ...managerResponse.data]);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des administrateurs:", err);
      setError("Impossible de récupérer la liste des administrateurs");
      setLoading(false);
    }
  };

  // Récupérer toutes les agences
  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/agences`);
      setAgencies(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des agences:", err);
      setError("Impossible de récupérer la liste des agences");
      setLoading(false);
    }
  };

  // Créer un admin ou manager
  const createUserAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/create-user-admin`, {
        nom: newUser.nom,
        email: newUser.email,
        telephone: newUser.telephone,
        role: newUser.role,
        agence_id: parseInt(newUser.agence_id),
        password: newUser.password
      });
      
      // Mettre à jour la liste des utilisateurs
      fetchAdmins();
      setShowCreateUserModal(false);
      setNewUser({
        nom: "",
        email: "",
        telephone: "",
        role: "admin",
        agence_id: "",
        password: "000000",
      });
    } catch (err: any) {
      console.error("Erreur lors de la création de l'utilisateur:", err);
      setError(err.response?.data?.message || "Erreur lors de la création de l'utilisateur");
    }
  };

  // Activer/désactiver un utilisateur
  const toggleUserActiveStatus = async (userId: number) => {
    try {
      setError(null);
      await axios.put(`${API_URL}/users/${userId}/active`);
      
      // Mettre à jour la liste des utilisateurs après le changement
      fetchAdmins();
    } catch (err: any) {
      console.error("Erreur lors de la modification du statut:", err);
      setError(err.response?.data?.message || "Erreur lors de la modification du statut");
    }
  };

  // Mettre à jour le mot de passe
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setError(null);
      await axios.put(`${API_URL}/profile`, {
        old_password: profileData.oldPassword,
        new_password: profileData.newPassword
      });
      
      setProfileData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      alert("Mot de passe mis à jour avec succès");
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe");
    }
  };

  // Récupérer les données au chargement
  useEffect(() => {
    fetchCurrentUser();
    fetchAgencies();
    
    if (currentView === "admins") {
      fetchAdmins();
    }
  }, [currentView]);

  // Filtrer les utilisateurs selon le rôle sélectionné
  const filteredUsers = roleFilter 
    ? users.filter(user => user.role === roleFilter)
    : users;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Component */}
        <Header currentView={currentView} currentUser={currentUser} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <>
              {/* Dashboard View */}
              {currentView === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Administrateurs et Managers</h3>
                    <div className="text-3xl font-bold text-orange-500">
                      {users.length}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Total des utilisateurs admin/manager</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Agences</h3>
                    <div className="text-3xl font-bold text-orange-500">
                      {agencies.length}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Total des agences</div>
                  </div>
                </div>
              )}

              {/* Admins Management View */}
              {currentView === "admins" && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="text-lg font-semibold">Gestion des Administrateurs et Managers</h3>
                    <div className="flex space-x-2">
                      <select 
                        className="px-3 py-2 border rounded-md text-sm"
                        value={roleFilter || ''}
                        onChange={(e) => setRoleFilter(e.target.value || null)}
                      >
                        <option value="">Tous les rôles</option>
                        <option value="admin">Administrateurs</option>
                        <option value="manager">Managers</option>
                      </select>
                      <button 
                        onClick={() => setShowCreateUserModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Créer un utilisateur
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Téléphone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rôle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Agence
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{user.nom}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-500">{user.telephone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {agencies.find(a => a.id === user.agence_id)?.nom || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {user.is_active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => toggleUserActiveStatus(user.id)}
                                className="text-orange-500 hover:text-orange-700 mr-3"
                              >
                                {user.is_active ? "Désactiver" : "Activer"}
                              </button>
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => {
                                  // Implémenter la réinitialisation de mot de passe ici
                                  alert(`Réinitialiser le mot de passe pour ${user.nom}`);
                                }}
                              >
                                Réinitialiser MDP
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Profile View */}
              {currentView === "profile" && currentUser && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Mon Profil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value={currentUser.nom}
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value={currentUser.email}
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value={currentUser.telephone}
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rôle
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value={currentUser.role}
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <form onSubmit={updatePassword}>
                        <h4 className="text-md font-medium mb-4">Changer le mot de passe</h4>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ancien mot de passe
                          </label>
                          <input
                            type="password"
                            className="w-full p-2 border rounded-md"
                            value={profileData.oldPassword}
                            onChange={(e) => setProfileData({...profileData, oldPassword: e.target.value})}
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            className="w-full p-2 border rounded-md"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le mot de passe
                          </label>
                          <input
                            type="password"
                            className="w-full p-2 border rounded-md"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                            required
                          />
                        </div>
                        <button 
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Mettre à jour le mot de passe
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Créer un Administrateur</h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={createUserAdmin}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newUser.nom}
                    onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newUser.telephone}
                    onChange={(e) => setNewUser({...newUser, telephone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agence
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newUser.agence_id}
                    onChange={(e) => setNewUser({...newUser, agence_id: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner une agence</option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe par défaut
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'utilisateur pourra changer son mot de passe après la première connexion.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;