import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    nom: string;
    onLogout: () => void; // Fonction pour gérer la déconnexion
};

const ClientSidebar: React.FC<Props> = ({ nom, onLogout }) => {

    return (
        <div className="d-flex flex-column min-vh-100 bg-light p-3" style={{ width: '250px' }}>
            <h5 className="text-center">Bienvenue, {nom}</h5>
            <hr />
            <ul className="nav flex-column">
            <li className="nav-item">
                    <Link className="nav-link" to="/ColisList">Mes Colis</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/suivicolis">Suivre un Colis</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/profil">Mon Profil</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/messagerie">Messagerie</Link>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={onLogout}>
                        Déconnexion
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ClientSidebar;