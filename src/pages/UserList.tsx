import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserList() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUtilisateur, setNewUtilisateur] = useState({
        nom: '',
        email: '',
        password: '0000', // Mot de passe par défaut
        telephone: '',
        role: 'client', // Rôle par défaut
        date_creation: new Date().toISOString().split('T')[0] // Date actuelle
    });
    const [editingUtilisateur, setEditingUtilisateur] = useState(null);
    const [showModal, setShowModal] = useState(false); // État pour afficher le modal

    const loadUtilisateurs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUtilisateurs(data);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
        }
    };

    useEffect(() => {
        loadUtilisateurs();
    }, []);

    const handleAddOrUpdate = async (event) => {
        event.preventDefault();
        const method = editingUtilisateur ? 'PUT' : 'POST';
        const url = editingUtilisateur ? `http://localhost:5000/api/users/${editingUtilisateur.id}` : 'http://localhost:5000/api/users';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newUtilisateur, date_creation: new Date().toISOString().split('T')[0] }), // Mettre à jour la date de création
            });
            if (response.ok) {
                setNewUtilisateur({
                    nom: '',
                    email: '',
                    password: '0000', // Remise à zéro du mot de passe par défaut
                    telephone: '',
                    role: 'client', // Rôle par défaut
                    date_creation: new Date().toISOString().split('T')[0] // Réinitialisation de la date
                });
                setEditingUtilisateur(null);
                setShowModal(false); // Fermer le modal après l'ajout/modification
                loadUtilisateurs();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout ou de la mise à jour:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
            loadUtilisateurs();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleEdit = (utilisateur) => {
        setNewUtilisateur(utilisateur);
        setEditingUtilisateur(utilisateur);
        setShowModal(true); // Afficher le modal lors de l'édition
    };

    const handleShow = () => {
        setNewUtilisateur({
            nom: '',
            email: '',
            password: '0000', // Mot de passe par défaut
            telephone: '',
            role: 'client', // Rôle par défaut
            date_creation: new Date().toISOString().split('T')[0] // Date actuelle
        });
        setEditingUtilisateur(null);
        setShowModal(true); // Afficher le modal pour ajouter un utilisateur
    };

    const filteredUtilisateurs = utilisateurs.filter(utilisateur =>
        utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utilisateur.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2>Gestion des Utilisateurs</h2>

            <div className="mb-3 text-end">
                <input
                    type="text"
                    className="form-control d-inline-block w-50"
                    placeholder="Rechercher un utilisateur"
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
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Rôle</th>
                        <th>Date de Création</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUtilisateurs.map((utilisateur) => (
                        <tr key={utilisateur.id}>
                            <td>{utilisateur.id}</td>
                            <td>{utilisateur.nom}</td>
                            <td>{utilisateur.email}</td>
                            <td>{utilisateur.telephone}</td>
                            <td>{utilisateur.role}</td>
                            <td>{new Date(utilisateur.date_creation).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(utilisateur)}>
                                    Modifier
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(utilisateur.id)}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal pour Ajouter/Modifier un Utilisateur */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingUtilisateur ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}</h5>
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
                                    <div className="form-group">
                                        <label htmlFor="nom">Nom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nom"
                                            placeholder="Nom"
                                            value={newUtilisateur.nom}
                                            onChange={(e) => setNewUtilisateur({ ...newUtilisateur, nom: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Email"
                                            value={newUtilisateur.email}
                                            onChange={(e) => setNewUtilisateur({ ...newUtilisateur, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <label htmlFor="password">Mot de passe</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Mot de passe"
                                            value={newUtilisateur.password}
                                            onChange={(e) => setNewUtilisateur({ ...newUtilisateur, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <label htmlFor="telephone">Téléphone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="telephone"
                                            placeholder="Téléphone"
                                            value={newUtilisateur.telephone}
                                            onChange={(e) => setNewUtilisateur({ ...newUtilisateur, telephone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <label htmlFor="role">Rôle</label>
                                        <select
                                            className="form-control"
                                            id="role"
                                            value={newUtilisateur.role}
                                            onChange={(e) => setNewUtilisateur({ ...newUtilisateur, role: e.target.value })}
                                            required
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="livreur">Livreur</option>
                                            <option value="client">Client</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={newUtilisateur.date_creation}
                                        readOnly // Date de création est fixe et automatique
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {editingUtilisateur ? 'Mettre à jour' : 'Ajouter'}
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

export default UserList;