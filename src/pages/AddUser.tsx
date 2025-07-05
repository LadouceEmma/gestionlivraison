import React, { useState } from 'react';

const AddUser: React.FC = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [role, setRole] = useState<'admin' | 'livreur'>('admin');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = { nom, email, password, telephone, role };

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                // Réinitialiser le formulaire ou faire autre chose
                setNom('');
                setEmail('');
                setPassword('');
                setTelephone('');
            }
        } catch (error) {
            setMessage('Erreur lors de l\'ajout de l\'utilisateur');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Ajouter un Utilisateur</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Téléphone</label>
                    <input
                        type="tel"
                        className="form-control"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Rôle</label>
                    <select className="form-select" value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'livreur')}>
                        <option value="admin">Administrateur</option>
                        <option value="livreur">Livreur</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Ajouter</button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default AddUser;