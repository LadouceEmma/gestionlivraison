import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './auth/ProtectedRoute';

import AdminDashboard from './pages/Admin/AdminDashboard';
import SuperAdminDashboard from './pages/superadmin/superAdminDashboard';
import AppContent from './AppContent';
import Agences from './pages/superadmin/Agences';
import Users from './pages/superadmin/Users';
import SuperAdminHistorique from './pages/superadmin/superadminHistorique';
import SuperAdminColis from './pages/superadmin/SuperAdminColis';
import SuperAdminSuiviColis from './pages/superadmin/SuperAdminSuivi';

import AdminUserManagement from './pages/Admin/AdminUser';
import ColisList from './pages/Admin/AdminColis';
import HistoriqueColis from './pages/Admin/AdminHistorique';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import AssignColisPage from './pages/Admin/AssignColis';
import ManagerColis from './pages/Manager/ManagerColis';
import ManagerLivraison from './pages/Manager/ManagerLivraison';
import ManagerUsers from './pages/Manager/ManagerUsers';
import ReceptionistDashboard from './pages/Receptioniste/receptionisteDashboard';
import ClientDashboard from './pages/patient/ClientDashboard';
//import LivreurDashboard from './pages/LivreurDashboard';
import AddColis from './pages/AddColis';
import DashboardReceptionist from './pages/Receptioniste/receptionisteDashboard';
import CreateColis from './pages/Receptioniste/receptionnisteColis';
import ReceptionnistLivraison from './pages/Receptioniste/receptionnistLivraison';
import ProfilePage from './pages/superadmin/Profil';
import SuiviColisReceptionnistPage from './pages/Receptioniste/receptionisttrackcolis';
import ColisHistorique from './pages/Receptioniste/ColisHistorique';
import SuiviColisManagerPage from './pages/Manager/ManagerSuivi';
import AdminSuivi from './pages/Admin/AdminSuivi';
import ColisHistoriqueAd from './pages/Admin/ColisHistoriqueAd';
import ColisHistoriqueMan from './pages/Manager/ColisHistoriqueMan';
import LivreurDashboard from './pages/Livreur/LivreurDashboard';

const AppRoutes: React.FC = () => {
  return (
    
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appcontent"element={<AppContent/>} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
          {/* <Route path="/ClientDashboard" element={<ClientDashboard />} /> */}
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/receptionnistedashboard" element={<ReceptionistDashboard />} />
        {/* Routes protégées */}
        
        <Route
          path="/addcolis"
          element={<ProtectedRoute element={<AddColis />} allowedRoles={['admin', 'client']} />}
        />
        
        <Route
          path="/ClientDashboard"
         element={<ProtectedRoute element={<ClientDashboard />} allowedRoles={['client']} />}
        />
         <Route
          path="/AdminDashboard"
         element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />}
        />
        <Route
          path="/Admincolis"
         element={<ProtectedRoute element={<ColisList />} allowedRoles={['admin', 'manager']} />}
        />
        <Route
          path="/Adminhistorique"
         element={<ProtectedRoute element={<HistoriqueColis colisId={undefined} />} allowedRoles={['admin']} />}
        />
        <Route
          path="/AdminUsers"
         element={<ProtectedRoute element={<AdminUserManagement />} allowedRoles={['admin']} />}
        />
          <Route
          path="/assigncolis"
         element={<ProtectedRoute element={<AssignColisPage />} allowedRoles={['admin']} />}
        />
        <Route
          path="/Adminsuivi"
         element={<ProtectedRoute element={<AdminSuivi />} allowedRoles={['admin']} />}
        />
          <Route
          path="/LivreurDashboard"
         element={<ProtectedRoute element={<LivreurDashboard />} allowedRoles={['livreur']} />}
        /> 
          <Route
          path="/SuperAdminDashboard"
         element={<ProtectedRoute element={<SuperAdminDashboard />} allowedRoles={['superadmin']} />}
        /> 
         <Route
          path="/ManagerDashboard"
         element={<ProtectedRoute element={<ManagerDashboard />} allowedRoles={['manager']} />}
        />
        <Route
          path="/Managercolis"
         element={<ProtectedRoute element={<ManagerColis />} allowedRoles={['manager']} />}
        />
        <Route
          path="/managerlivraison"
         element={<ProtectedRoute element={<ManagerLivraison />} allowedRoles={['manager']} />}
        />
        <Route
          path="/ManagerUsers"
         element={<ProtectedRoute element={<ManagerUsers/>} allowedRoles={['manager']} />}
        />
        <Route
          path="/ManagerSuivi"
         element={<ProtectedRoute element={<SuiviColisManagerPage/>} allowedRoles={['manager']} />}
        />

           <Route
          path="/agences"
         element={<ProtectedRoute element={<Agences />} allowedRoles={['superadmin']} />}
        /> 
         <Route
          path="/users"
         element={<ProtectedRoute element={<Users />} allowedRoles={['superadmin']} />}
        /> 
         <Route
          path="/superadminhistorique"
         element={<ProtectedRoute element={<SuperAdminHistorique />} allowedRoles={['superadmin']} />}
        /> 
         <Route
          path="/superadmincolis"
         element={<ProtectedRoute element={<SuperAdminColis />} allowedRoles={['superadmin']} />}
        />
        <Route
          path="/superadminsuivi"
         element={<ProtectedRoute element={<SuperAdminSuiviColis />} allowedRoles={['superadmin']} />}
        />
        <Route
          path="/userprofil"
         element={<ProtectedRoute element={<ProfilePage />} allowedRoles={['superadmin']} />}
        />
         <Route
          path="/DashboardReceptionist"
         element={<ProtectedRoute element={<DashboardReceptionist />} allowedRoles={['receptionniste']} />}
        />
          <Route
          path="/createcolis"
         element={<ProtectedRoute element={<CreateColis />} allowedRoles={['receptionniste']} />}
        />
          <Route
          path="/SuiviColisReceptionnistPage"
         element={<ProtectedRoute element={<SuiviColisReceptionnistPage />} allowedRoles={['receptionniste']} />}
        />
           <Route
          path="/receptionnistLivraison"
         element={<ProtectedRoute element={< ReceptionnistLivraison/>} allowedRoles={['receptionniste']} />}
        />
          <Route
          path="/colis/:codeSuivi/historique"
         element={<ProtectedRoute element={< ColisHistorique/>} allowedRoles={['receptionniste']} />}
        />
        <Route
          path="/colis/:codeSuivi/historique"
         element={<ProtectedRoute element={< ColisHistoriqueAd/>} allowedRoles={[ 'admin']} />}
        />
        <Route
          path="/colis/:codeSuivi/historique"
         element={<ProtectedRoute element={< ColisHistoriqueMan/>} allowedRoles={['manager']} />}
        />
        {/* Route 404  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    
  );
};

export default AppRoutes;
