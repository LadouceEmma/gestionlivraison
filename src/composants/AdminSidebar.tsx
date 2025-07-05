import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    username: string;
};

const AdminSidebar: React.FC<Props> = ({ username }) => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light p-3" style={{ width: '250px' }}>
            <h5 className="text-center">Bienvenue, {username}</h5>
            <hr />
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/ColisList">Gérer Colis</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/LivreurList">Gérer Livreurs</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/UserList">Gérer Utilisateurs</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/suivicolis">Suivi Colis</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/messagerie">Messagerie</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/parametres">Paramètres</Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;