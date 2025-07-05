import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getColisById } from '../api';

const ColisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [colis, setColis] = useState<any>(null);

  useEffect(() => {
    getColisById(id).then(setColis);
  }, [id]);

  if (!colis) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-5">
      <h2>Détails du colis</h2>
      <ul className="list-group">
        {Object.entries(colis).map(([key, value]) => (
          <li className="list-group-item d-flex justify-content-between" key={key}>
            <strong>{key}</strong> <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColisDetail;
