import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoriqueColis = ({ colisId }) => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké
        const response = await axios.get(`http://localhost:5000/api/suivi/colis/${colisId}/historique`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistorique(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération de l\'historique.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [colisId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Historique du Colis {colisId}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Statut</th>
            <th>Date</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {historique.length > 0 ? (
            historique.map((h) => (
              <tr key={h.date}>
                <td>{h.statut}</td>
                <td>{new Date(h.date).toLocaleString()}</td>
                <td>{h.commentaire}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">Aucun historique disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoriqueColis;