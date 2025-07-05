// // import { useState } from "react";
// import axios from "axios";

// // Types
// type UserType = {
//   id: number;
//   nom: string;
//   email: string;
//   telephone: string;
//   role: string;
//   agence_id: number;
//   is_active: boolean;
//   created_at: string;
// };

// const UserProfile = ({ currentUser }: { currentUser: UserType | null }) => {
//   const [profileData, setProfileData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });
//   const [error, setError] = useState<string | null>(null);

//   const updatePassword = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (profileData.newPassword !== profileData.confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       return;
//     }

//     try {
//       setError(null);
//       await axios.put(`http://localhost:5000/api/profile`, {
//         old_password: profileData.oldPassword,
//         new_password: profileData.newPassword
//       });

//       setProfileData({
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//       });

//       alert("Mot de passe mis à jour avec succès");
//     } catch (err: any) {
//       console.error("Erreur lors de la mise à jour du mot de passe:", err);
//       setError(err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe");
//     }
//   };

//   if (!currentUser) return <p>Chargement des informations...</p>; // Ajouter un état de chargement

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h3 className="text-lg font-semibold mb-4">Mon Profil</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Nom complet
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md bg-gray-50"
//               value={currentUser.nom || ''}
//               readOnly
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded-md bg-gray-50"
//               value={currentUser.email || ''}
//               readOnly
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Téléphone
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md bg-gray-50"
//               value={currentUser.telephone || ''}
//               readOnly
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Rôle
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md bg-gray-50"
//               value={currentUser.role || ''}
//               readOnly
//             />
//           </div>
//         </div>

//         <div>
//           <h4 className="text-md font-medium mb-4">Changer le mot de passe</h4>
//           <form onSubmit={updatePassword}>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Ancien mot de passe
//               </label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded-md"
//                 value={profileData.oldPassword}
//                 onChange={(e) => setProfileData({ ...profileData, oldPassword: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Nouveau mot de passe
//               </label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded-md"
//                 value={profileData.newPassword}
//                 onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirmer le mot de passe
//               </label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded-md"
//                 value={profileData.confirmPassword}
//                 onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
//             >
//               Mettre à jour le mot de passe
//             </button>
//             {error && <div className="mt-2 text-red-500">{error}</div>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Card, Spinner } from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setFormData((prev) => ({ ...prev, nom: response.data.name, email: response.data.email }));
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement du profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profil mis à jour avec succès.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <Card className="shadow border-0">
        <Card.Header className="bg-orange text-white">
          <h4 className="mb-0">Mon Profil</h4>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe actuel</Form.Label>
                <Form.Control
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirmation du nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="orange">
                Mettre à jour le profil
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;
