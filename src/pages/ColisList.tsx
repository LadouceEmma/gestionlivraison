import React, { useEffect, useState } from 'react';
import { getColis, deleteColis } from '../api';
import { Link } from 'react-router-dom';

const ColisList: React.FC = () => {
  const [colisList, setColisList] = useState<any[]>([]);

  const fetchColis = async () => {
    const data = await getColis();
    setColisList(data);
  };

  useEffect(() => {
    fetchColis();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirmer la suppression ?')) {
      await deleteColis(id);
      fetchColis();
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Liste des colis</h2>
        <Link to="/colis/ajouter" className="btn btn-success">Ajouter un colis</Link>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Destinataire</th>
            <th>Adresse</th>
            <th>Date envoi</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colisList.map((colis) => (
            <tr key={colis.id}>
              <td>{colis.id}</td>
              <td>{colis.description}</td>
              <td>{colis.destinaire}</td>
              <td>{colis.addressdestinataire}</td>
              <td>{colis.date_envoi}</td>
              <td>
                <Link to={`/colis/${colis.id}`} className="btn btn-info btn-sm me-2">Détails</Link>
                <Link to={`/colis/${colis.id}/modifier`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                <Link to={`/colis/${colis.id}/suivi`} className="btn btn-primary btn-sm me-2">Suivi</Link>
                <button onClick={() => handleDelete(colis.id)} className="btn btn-danger btn-sm">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColisList;
