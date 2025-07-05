//import React, { useEffect, useState, ReactNode } from 'react';

//export const UserContext = React.createContext<any>(null);

//export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 // const [user, setUser] = useState<any>(null); // Initialisé à null
  //const [loading, setLoading] = useState(true); // État de chargement

  //useEffect(() => {
    //const fetchUser = async () => {
      // Simulez un utilisateur pour le test
      //setUser({ nom: 'Test User', email: 'test@example.com' });
     //// setLoading(false);
   // };

    //fetchUser();
    import React, { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Initialisé à null
  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Données utilisateur reçues:", response.data);
        setUser(response.data); // Assurez-vous que response.data a la structure attendue
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {loading ? <div>Chargement...</div> : children}
    </UserContext.Provider>
  );
};
 