import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";


const API_URL = "http://localhost:127.0.0.1:5000/api/colis"; // Vérifie bien cette URL

const Colis = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const [colis, setColis] = useState({
    utilisateur_id: "",
    description: "",
    destinataire: "",
    addressdestinaire: "",
    date_envoi: "",
  });

  const [editColis, setEditColis] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Récupérer tous les colis
  const { data: colisList, error, isLoading } = useQuery({
    queryKey: ["colis"],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });

  // 🔹 Ajouter un colis
  const addMutation = useMutation({
    mutationFn: async (newColis) => {
      await axios.post(API_URL, newColis);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colis"] });
      setColis({ utilisateur_id: "", description: "", destinataire: "", addressdestinaire: "", date_envoi: "" });
      setFormVisible(false);
    },
  });

  // 🔹 Modifier un colis
  const updateMutation = useMutation({
    mutationFn: async (updatedColis) => {
      await axios.put(`${API_URL}/${updatedColis.id}`, updatedColis);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colis"] });
      setEditColis(null);
      setFormVisible(false);
    },
  });

  // 🔹 Supprimer un colis
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colis"] });
    },
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setColis({ ...colis, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editColis) {
      updateMutation.mutate({ ...colis, id: editColis.id });
    } else {
      addMutation.mutate(colis);
    }
  };

  const handleEdit = (colisToEdit) => {
    setEditColis(colisToEdit);
    setColis(colisToEdit);
    setFormVisible(true);
  };

  const handlePrint = (colis) => {
    const printContent = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h2>Colis - Récapitulatif</h2>
        <p><strong>Utilisateur ID:</strong> ${colis.utilisateur_id}</p>
        <p><strong>Description:</strong> ${colis.description}</p>
        <p><strong>Destinataire:</strong> ${colis.destinataire}</p>
        <p><strong>Adresse Destinataire:</strong> ${colis.addressdestinaire}</p>
        <p><strong>Date d'Envoi:</strong> ${colis.date_envoi}</p>
      </div>
    `;

    const printWindow = window.open("", "", "width=600,height=400");
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const filteredColis = colisList?.filter((res) =>
    res.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Menu</h2>
        <ul className="sidebar-menu">
          <li><Link to="/AdminDashboard" className="sidebar-link">Tableau de Bord</Link></li>
          <li><Link to="/colis" className="sidebar-link">Gérer les Colis</Link></li>
          <li><button onClick={handleLogout} className="button">Déconnexion</button></li>
        </ul>
      </aside>

      <div className="main">
        <h1 className="text-2xl font-bold text-center mt-4">Gestion des Colis</h1>

        <input
          type="text"
          placeholder="Rechercher par description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block border p-3 w-full mb-4"
        />

        <button 
          onClick={() => setFormVisible(!isFormVisible)} 
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mt-4"
        >
          <FaPlus className="mr-2" />
          {isFormVisible ? "Masquer le formulaire" : "Ajouter un Colis"}
        </button>

        {isFormVisible && (
          <form onSubmit={handleSubmit} className="mt-4 p-6 border rounded-lg shadow-lg bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">{editColis ? "Modifier le Colis" : "Ajouter un Colis"}</h2>
            <input
              type="text"
              name="utilisateur_id"
              placeholder="Utilisateur ID"
              value={colis.utilisateur_id}
              onChange={handleChange}
              className="block border p-3 w-full mb-4"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={colis.description}
              onChange={handleChange}
              className="block border p-3 w-full mb-4"
              required
            />
            <input
              type="text"
              name="destinataire"
              placeholder="Destinataire"
              value={colis.destinataire}
              onChange={handleChange}
              className="block border p-3 w-full mb-4"
              required
            />
            <input
              type="text"
              name="addressdestinaire"
              placeholder="Adresse Destinataire"
              value={colis.addressdestinaire}
              onChange={handleChange}
              className="block border p-3 w-full mb-4"
              required
            />
            <input
              type="date"
              name="date_envoi"
              value={colis.date_envoi}
              onChange={handleChange}
              className="block border p-3 w-full mb-4"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-full transition transform hover:bg-blue-700 hover:scale-105">
              {editColis ? "Mettre à jour" : "Ajouter Colis"}
            </button>
          </form>
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4">Liste des Colis</h2>
        {isLoading && <p className="text-center">Chargement...</p>}
        {error && <p className="text-center text-red-600">Erreur lors de la récupération des données.</p>}

        <table className="table-auto w-full mt-6 border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-4 text-left">Utilisateur ID</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Destinataire</th>
              <th className="p-4 text-left">Adresse Destinataire</th>
              <th className="p-4 text-left">Date d'Envoi</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredColis?.map((res) => (
              <tr key={res.id} className="border-b hover:bg-gray-100">
                <td className="p-4">{res.utilisateur_id}</td>
                <td className="p-4">{res.description}</td>
                <td className="p-4">{res.destinataire}</td>
                <td className="p-4">{res.addressdestinaire}</td>
                <td className="p-4">{res.date_envoi}</td>
                <td className="p-4">
                  <button onClick={() => handleEdit(res)} className="btn-edit">
                    <FaEdit className="mr-2" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(res.id)} className="btn-delete">
                    <FaTrash className="mr-2" />
                  </button>
                  <button onClick={() => handlePrint(res)} className="btn-print">
                    <FaPrint className="mr-2" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Colis;