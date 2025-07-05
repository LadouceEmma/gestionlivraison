import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface EditUserForm {
  nom: string;
  email: string;
  telephone: string;
  role: string;
}

const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<EditUserForm>({
    nom: '',
    email: '',
    telephone: '',
    role: 'client',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setForm(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur', err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${userId}`, form);
      alert('Utilisateur mis à jour');
      navigate('/users');
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Modifier l'utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            className="form-control"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Téléphone</label>
          <input
            type="text"
            name="telephone"
            className="form-control"
            value={form.telephone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rôle</label>
          <select
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
            <option value="livreur">Livreur</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default EditUser;
