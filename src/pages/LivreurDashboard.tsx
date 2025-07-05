import React from 'react';
import LivreurSidebar from '../composants/LivreurSidebar';

const LivreurDashboard: React.FC = () => {
    const username = "Nom du livreur"; // Remplacez cela par la logique d'authentification du livreur

    return (
        <div className="d-flex">
            <LivreurSidebar username={username} />
            <div className="container flex-grow-1 p-3">
                <h2>Mes Livraisons</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Destinataire</th>
                            <th>Adresse</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Exemples de lignes de tableau (à remplacer par des données dynamiques) */}
                        <tr>
                            <td>1</td>
                            <td>Jean Dupont</td>
                            <td>123 Rue Exemple</td>
                            <td>En cours</td>
                            <td><button className="btn btn-primary">Modifier</button></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Marie Curie</td>
                            <td>456 Avenue Recherche</td>
                            <td>Livré</td>
                            <td><button className="btn btn-secondary" disabled>Détails</button></td>
                        </tr>
                        {/* Ajouter des lignes dynamiquement ici */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivreurDashboard;