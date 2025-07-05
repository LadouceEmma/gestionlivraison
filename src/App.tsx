// src/App.j
import { UserProvider } from './services/UseProvider'; // Importez le nouveau composant
import Routes from './routes';


const App = () => {
  return (
    <UserProvider>
  
      <Routes />
    </UserProvider>
  
  );
};

export default App;