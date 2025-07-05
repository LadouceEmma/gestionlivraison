import { useContext } from 'react';
import SuperadminSidebar from './pages/superadmin/composants/sidebar';
import Routes from './routes';
import { UserContext } from './services/UseProvider';

const AppContent = () => {
  const user = useContext(UserContext);

  // Affiche un message de chargement ou d'erreur
  if (user === null) return <div>Chargement ou utilisateur non trouvé...</div>;

  return (
    <div className="app-container">
      <SuperadminSidebar />
      <div>Utilisateur chargé : {user.nom}
        {user.nom}
      </div>
      <Routes />
    </div>
  );
};

export default AppContent;