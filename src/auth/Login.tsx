import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import monColis from '../images/monColis.jpg';
import api from '../api'; // Assurez-vous que le chemin est correct
const Login: React.FC = () => {
  const [form, setForm] = useState({
    identifiant: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', form);
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      setError(null);
      
      // Navigation basée sur le rôle
      navigate(
        role === 'admin' 
          ? '/AdminDashboard' 
          : role === 'manager' 
            ? '/ManagerDashboard' 
            : role === 'receptionniste' 
              ? '/DashboardReceptionist' 
              : role === 'livreur' 
                ? '/LivreurDashboard' 
                : role === 'client' 
                  ? '/ClientDashboard' 
                  : '/superAdminDashboard'
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const orangeButtonStyle = {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
    transition: 'all 0.3s',
  };
  
  const orangeButtonHoverStyle = {
    backgroundColor: '#e68a00',
    borderColor: '#e68a00',
    boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)',
  };

  return (
    <div 
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%)',
      }}
    >
      <div className="container-fluid h-100">
        <div className="row min-vh-100">
          {/* Section Gauche - Branding */}
          <div 
            className="col-lg-6 d-flex flex-column justify-content-center align-items-center p-5"
            style={{
              background: 'linear-gradient(135deg, #FF9800 0%, #FF8A65 100%)',
              color: 'white'
            }}
          >
            <div className="text-center">
          
              <div className="mb-4">
              <div 
                 className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                > <Image className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  src={monColis} 
                  alt="Logo"
                   style={{ 
                    maxHeight: '70px',
                    marginBottom: '10px'
                  }}/>
                  <i className="bi bi-box-seam" style={{ fontSize: '3.5rem' }}></i>
                </div>
              </div>

              {/* Nom de l'application */}
              <h1 className="display-4 fw-bold mb-3">ColiExpress</h1>
              
              {/* Slogan */}
              <p className="lead mb-4 fs-5">
                Votre solution de livraison rapide et fiable
              </p>
              
              {/* Message de bienvenue */}
              <div className="mb-4">
                <h3 className="h4 mb-3">Bienvenue !</h3>
                <p className="mb-0 opacity-75">
                  Connectez-vous pour accéder à votre espace personnel et gérer vos colis en toute simplicité.
                </p>
              </div>

              {/* Éléments décoratifs */}
              <div className="mt-5">
                <div className="d-flex justify-content-center gap-3 mb-3">
                  <div 
                    className="rounded-circle"
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.6)'
                    }}
                  ></div>
                  <div 
                    className="rounded-circle"
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.4)'
                    }}
                  ></div>
                  <div 
                    className="rounded-circle"
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.6)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Droite - Formulaire */}
          <div className="col-lg-6 d-flex justify-content-center align-items-center p-4">
            <div className="w-100" style={{ maxWidth: '450px' }}>
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="text-center py-3 px-3" style={{ backgroundColor: '#FF9800', color: 'white' }}>
                  <h4 className="fw-bold mb-0">Connexion</h4>
                </div>
                
                <div className="card-body p-4 p-md-5">
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="identifiant" className="form-label small text-muted">Email ou téléphone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          id="identifiant"
                          name="identifiant"
                          value={form.identifiant}
                          onChange={handleChange}
                          className="form-control bg-light border-start-0"
                          placeholder="Entrez votre email ou téléphone"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="password" className="form-label small text-muted">Mot de passe</label>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="form-control bg-light border-start-0 border-end-0"
                          placeholder="Entrez votre mot de passe"
                          required
                        />
                        <span 
                          className="input-group-text bg-light border-start-0 cursor-pointer"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''} text-muted`}></i>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label small" htmlFor="rememberMe">
                          Se souvenir de moi
                        </label>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 py-2 mb-4 rounded-pill fw-bold"
                      disabled={loading}
                      style={orangeButtonStyle}
                      onMouseOver={(e) => {
                        Object.assign(e.currentTarget.style, orangeButtonHoverStyle);
                      }}
                      onMouseOut={(e) => {
                        Object.assign(e.currentTarget.style, orangeButtonStyle);
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Connexion en cours...
                        </>
                      ) : (
                        'Se connecter'
                      )}
                    </button>
                  </form>
                  
                  <div className="text-center">
                    <Link 
                      to="/forgotpassword" 
                      className="text-decoration-none small"
                      style={{ color: '#FF9800' }}
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="text-center mb-3">
                    <span className="text-muted small">Vous n'avez pas de compte ?</span>
                  </div>
                  
                  <Link 
                    to="/register" 
                    className="btn btn-outline-secondary w-100 py-2 rounded-pill"
                    style={{
                      color: '#FF9800',
                      borderColor: '#FF9800'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF3E0';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Créer un compte
                  </Link>
                </div>
              </div>
              
              <div className="text-center mt-4 small text-muted">
                © 2025 ColiExpress. Tous droits réservés.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;