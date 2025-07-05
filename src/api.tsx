import axios from 'axios';
import { toast } from 'react-toastify';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes : ajoute le token si présent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses : gestion globale des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error('Session expirée. Veuillez vous reconnecter.', {
        position: 'top-center',
      });
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000); // attend 2 sec avant redirection
    } else if (status === 403) {
      toast.error('Accès refusé. Droits insuffisants.', {
        position: 'top-center',
      });
    } else if (status >= 500) {
      toast.error("Erreur du serveur. Veuillez réessayer plus tard.", {
        position: 'top-center',
      });
    }

    return Promise.reject(error);
  }
);

// CRUD Operations pour les utilisateurs

const API_URL = 'http://localhost:5000';

export const fetchUsers = async (token: string) =>
  axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createUser = async (data: any, token: string) =>
  axios.post(`${API_URL}/create-user-admin`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserRole = async (id: number, role: string, token: string) =>
  axios.put(`${API_URL}/users/${id}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const toggleUserActive = async (id: number, token: string) =>
  axios.put(`${API_URL}/users/${id}/active`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = async (id: number, token: string) =>
  axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// CRUD Operations pour les colis

export const createColis = async (colisData: { utilisateur_id: string; description: string; destinaire: string; addressdestinaire: string; date_envoi: string; }) => {
  try {
   const response = await api.post('http://127.0.0.1:5000/api/colis', colisData);
    return response.data;
  } catch (error) {
   throw error;
  }
};

export const getColis = async () => {
  try {
    const response = await api.get('http://127.0.0.1:5000/api/colis');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getColisById = async (id: any) => {
  try {
    const response = await api.get(`http://127.0.0.1:5000/api/colis/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateColis = async (id: any, colisData: any) => {
  try {
    const response = await api.put(`http://127.0.0.1:5000/api/colis/${id}`, colisData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteColis = async (id: any) => {
  try {
    const response = await api.delete(`http://127.0.0.1:5000/api/colis/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




export default api;