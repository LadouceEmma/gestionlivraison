import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

const AdminNotifications: React.FC = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminHeader />
        <div className="p-4">
          <h2>Notifications</h2>
          <ul className="list-group mt-3">
            <li className="list-group-item">📢 Nouveau colis enregistré</li>
            <li className="list-group-item">🚚 Livreur 1 a récupéré un colis</li>
            {/* Liste des notifications */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
