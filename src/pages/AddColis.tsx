import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColis } from '../api';

const AddColis: React.FC = () => {
  const [form, setForm] = useState({
    utilisateur_id: '',
    description: '',
    destinaire: '',
    addressdestinataire: '',
    date_envoi: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createColis(form);
      alert('Colis ajouté avec succès');
      navigate('/colis');
    } catch (error) {
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Ajouter un colis</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key}</label>
            <input
              type={key === 'date_envoi' ? 'date' : 'text'}
              name={key}
              value={value}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
};

export default AddColis;
