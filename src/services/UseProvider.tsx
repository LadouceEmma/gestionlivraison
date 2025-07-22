import React, { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ Empêche les updates après un démontage

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("⚠️ Aucun token trouvé dans le localStorage");
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Données utilisateur reçues:", response.data);
        if (isMounted) setUser(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur:", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // ✅ Annule tout si le composant est démonté
    };
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
