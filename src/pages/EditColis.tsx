import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getColisById, updateColis } from '../api';

const EditColis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [colis, setColis] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColis = async () => {
      const fetchedColis = await getColisById(id);
      setColis(fetchedColis);
    };
    fetchColis();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColis({ ...colis, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateColis(id, colis);
    alert('Colis mis à jour');
    navigate('/colis');  // Rediriger vers la liste des colis après la mise à jour
  };

  if (!colis) return <div>Chargement...</div>;

  // Formatage de la date pour le champ input[type="date"]
  const formatDate = (date: string) => {
    return new Date(date).toISOString().split('T')[0];  // "yyyy-MM-dd"
  };

  return (
    <div className="container mt-5">
      <h2>Modifier un colis</h2>
      <form onSubmit={handleSubmit}>
        {['description', 'destinataire', 'addressdestinataire', 'date_envoi'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input
              type={field === 'date_envoi' ? 'date' : 'text'}
              name={field}
              value={field === 'date_envoi' ? formatDate(colis[field]) : colis[field]}  // Appliquer formatDate pour la date
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-warning">Modifier</button>
      </form>
    </div>
  );
};

export default EditColis;
