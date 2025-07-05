import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LivreurList() {
    const [livreurs, setLivreurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newLivreur, setNewLivreur] = useState({ id: '', nom: '', prenom: '', telephone: '' });
    const [editingLivreur, setEditingLivreur] = useState(null);
    const [showModal, setShowModal] = useState(false); // État pour afficher le modal

    const loadLivreurs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/livreur');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLivreurs(data);
        } catch (error) {
            console.error('Erreur lors du chargement des livreurs:', error);
        }
    };

    useEffect(() => {
        loadLivreurs();
    }, []);

    const handleAddOrUpdate = async (event) => {
        event.preventDefault();
        const method = editingLivreur ? 'PUT' : 'POST';
        const url = editingLivreur ? `http://localhost:5000/api/livreur/${editingLivreur.id}` : 'http://localhost:5000/api/livreur';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLivreur),
            });
            if (response.ok) {
                setNewLivreur({ id: '', nom: '', prenom: '', telephone: '' });
                setEditingLivreur(null);
                setShowModal(false); // Fermer le modal après l'ajout/modification
                loadLivreurs();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout ou de la mise à jour:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/livreur/${id}`, { method: 'DELETE' });
            loadLivreurs();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleEdit = (livreur) => {
        setNewLivreur(livreur);
        setEditingLivreur(livreur);
        setShowModal(true); // Afficher le modal lors de l'édition
    };

    const handleShow = () => {
        setNewLivreur({ id: '', nom: '', prenom: '', telephone: '' });
        setEditingLivreur(null);
        setShowModal(true); // Afficher le modal pour ajouter un livreur
    };

    const handleCheckAvailability = (livreur) => {
        alert(`Vérification de la disponibilité de ${livreur.nomlivreur} ${livreur.prenomlivreur}`);
    };

    const filteredLivreurs = livreurs.filter(livreur =>
        livreur.nomlivreur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livreur.prenomlivreur.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2>Gestion des Livreurs</h2>

            <div className="mb-3 text-end">
                <input
                    type="text"
                    className="form-control d-inline-block w-50"
                    placeholder="Rechercher un livreur"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary ms-2" onClick={handleShow}>
                    Ajouter
                </button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLivreurs.map((livreur) => (
                        <tr key={livreur.id}>
                            <td>{livreur.id}</td>
                            <td>{livreur.nomlivreur}</td>
                            <td>{livreur.prenomlivreur}</td>
                            <td>{livreur.telephonelivreur}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(livreur)}>
                                    Modifier
                                </button>
                                <button className="btn btn-info me-2" onClick={() => handleCheckAvailability(livreur)}>
                                    Vérifier Disponibilité
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(livreur.id)}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal pour Ajouter/Modifier un Livre */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingLivreur ? 'Modifier le Livre' : 'Ajouter un Livre'}</h5>
                            <button 
                                type="button" 
                                className="close text-danger" 
                                onClick={() => setShowModal(false)}
                                style={{ marginLeft: 'auto' }} // Positionner à droite
                            >
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddOrUpdate}>
                                <div className="mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="ID"
                                        value={newLivreur.id}
                                        onChange={(e) => setNewLivreur({ ...newLivreur, id: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nom"
                                        value={newLivreur.nom}
                                        onChange={(e) => setNewLivreur({ ...newLivreur, nom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Prénom"
                                        value={newLivreur.prenom}
                                        onChange={(e) => setNewLivreur({ ...newLivreur, prenom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Téléphone"
                                        value={newLivreur.telephone}
                                        onChange={(e) => setNewLivreur({ ...newLivreur, telephone: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {editingLivreur ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>} {/* Arrière-plan du modal */}
        </div>
    );
}

export default LivreurList;