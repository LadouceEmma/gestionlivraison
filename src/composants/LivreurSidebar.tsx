import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    username: string;
};

const LivreurSidebar: React.FC<Props> = ({ username }) => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light p-3" style={{ width: '250px' }}>
            <h5 className="text-center">Bienvenue, {username}</h5>
            <hr />
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/mes-livraisons">Mes Livraisons</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/historique-livraisons">Historique des Livraisons</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/profil">Mon Profil</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/support">Support</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/deconnexion">Déconnexion</Link>
                </li>
            </ul>
        </div>
    );
};

export default LivreurSidebar;