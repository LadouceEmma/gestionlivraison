import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './composants/header';
import AdminSidebar from './composants/sidebar';

interface Colis {
  id: number;
  code_suivi: string;
  statut: string;
  livreur_nom?: string; // Nom du livreur
}

interface Livreur {
  id: number;
  nom: string;
}

const STATUTS = ['Assigné', 'En cours de livraison', 'Livré'];

const AssignColisPage: React.FC = () => {
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [selectedColisId, setSelectedColisId] = useState<number | null>(null);
  const [selectedLivreurId, setSelectedLivreurId] = useState<number | null>(null);
  const [statutsChoisis, setStatutsChoisis] = useState<{ [colisId: number]: string }>({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchColisArrivants();
    fetchLivreurs();
  }, []);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchColisArrivants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/colis/arrivants', { headers });
      setColisList(res.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des colis arrivants', error);
    }
  };

  const fetchLivreurs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/livreurs', { headers });
      const data = Array.isArray(res.data) ? res.data : res.data.livreurs || [];
      setLivreurs(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livreurs', error);
    }
  };

  const assignerColis = async () => {
    if (!selectedColisId || !selectedLivreurId) {
      alert('Veuillez sélectionner un colis **et** un livreur.');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/colis/${selectedColisId}/assign`,
        { livreur_id: selectedLivreurId },
        { headers }
      );
      alert('Colis assigné avec succès !');
      setSelectedColisId(null);
      setSelectedLivreurId(null);
      fetchColisArrivants();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l’assignation du colis.';
      alert(`Erreur : ${message}`);
    }
  };

  const desassignerColis = async (colisId: number) => {
    try {
      await axios.patch(`http://localhost:5000/api/colis/${colisId}/desassign`, {}, { headers });
      alert('Colis désassigné avec succès.');
      fetchColisArrivants(); // Refresh
    } catch (error) {
      alert('Erreur lors du désassignement.');
    }
  };

  const changerStatutColis = async (colisId: number) => {
    const nouveauStatut = statutsChoisis[colisId];
    if (!nouveauStatut) {
      alert('Veuillez sélectionner un statut.');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/colis/${colisId}/statuts`,
        { statut: nouveauStatut },
        { headers }
      );
      alert('Statut modifié avec succès !');
      fetchColisArrivants();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors du changement de statut.';
      alert(`Erreur : ${message}`);
    }
  };

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <AdminHeader />
      <div className="d-flex flex-grow-2">
        <AdminSidebar />
        <main className="flex-grow-1 p-4">
          <h2>Colis Arrivants</h2>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code Suivi</th>
                <th>Statut</th>
                <th>Livreur</th>
                <th>Changer Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colisList.length > 0 ? (
                colisList.map((colis) => (
                  <tr key={colis.id}>
                    <td>{colis.id}</td>
                    <td>{colis.code_suivi}</td>
                    <td>{colis.statut}</td>
                    <td>{colis.livreur_nom || 'Non assigné'}</td>
                    <td>
                      <select
                        className="form-select"
                        value={statutsChoisis[colis.id] || ''}
                        onChange={(e) =>
                          setStatutsChoisis({ ...statutsChoisis, [colis.id]: e.target.value })
                        }
                      >
                        <option value="">-- Choisir --</option>
                        {STATUTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-warning btn-sm mt-1"
                        onClick={() => changerStatutColis(colis.id)}
                      >
                        Mettre à jour
                      </button>
                    </td>
                    <td>
                      {colis.livreur_nom ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => desassignerColis(colis.id)}
                        >
                          Désassigner
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => setSelectedColisId(colis.id)}
                        >
                          Sélectionner
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">Aucun colis disponible</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mb-3">
            <label className="form-label">Livreur</label>
            <select
              className="form-select"
              onChange={(e) => setSelectedLivreurId(Number(e.target.value))}
              value={selectedLivreurId ?? ''}
            >
              <option value="">-- Sélectionnez un livreur --</option>
              {livreurs.map((livreur) => (
                <option key={livreur.id} value={livreur.id}>
                  {livreur.nom}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={assignerColis}
            disabled={!selectedColisId || !selectedLivreurId}
          >
            Assigner le colis sélectionné
          </button>
        </main>
      </div>
    </div>
  );
};

export default AssignColisPage;