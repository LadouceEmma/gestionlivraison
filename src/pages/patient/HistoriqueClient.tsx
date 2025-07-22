import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';
import PackageList from '../../pages/patient/composants/listeInterface';
import Filters from '../../pages/patient/composants/Filters';
import Sidebar from './composants/sidebar';

const ClientHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({ days: 30, status: '' });
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentification requise');
      }

      const res = await api.get(`/client/history`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPackages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPackage = (pkg: any) => {
    if (!pkg?.code_suivi) {
      setError('Code de suivi manquant pour ce colis');
      return;
    }
    navigate(`/ClientSuivi/${encodeURIComponent(pkg.code_suivi)}`);
  };

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      {/* <ReceptionistHeader /> */}
      <div className="d-flex flex-grow-2">
        <Sidebar />
        <main className="flex-grow-1 p-3 p-md-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      <Filters filters={filters} onChange={setFilters} />
      <PackageList
        title="Historique des colis"
        packages={packages}
        onTrack={handleTrackPackage}
      />
    </main>
    </div>
    </div>
  );
};

export default ClientHistory;