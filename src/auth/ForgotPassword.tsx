import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [identifiant, setIdentifiant] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/forgot-password', { identifiant });
      setSuccess(res.data.message);
      alert(res.data.message);
      navigate('/resetpassword'); // Redirige vers la page de réinitialisation
    } catch (err: any) {
      // Gestion d'erreur plus robuste
      let errorMessage = 'Erreur lors de la demande';
      
      if (err && typeof err === 'object') {
        // Vérifier si err.response existe et a une propriété data.message
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          // Utiliser le message d'erreur directement s'il existe
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Erreur récupération mot de passe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Style personnalisé pour les boutons orange
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
              {/* Logo */}
              <div className="mb-4">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="bi bi-shield-lock" style={{ fontSize: '3.5rem' }}></i>
                </div>
              </div>

              {/* Nom de l'application */}
              <h1 className="display-4 fw-bold mb-3">ColiExpress</h1>
              
              {/* Slogan */}
              <p className="lead mb-4 fs-5">
                Votre solution de livraison rapide et fiable
              </p>
              
              {/* Message de récupération */}
              <div className="mb-4">
                <h3 className="h4 mb-3">Récupération sécurisée</h3>
                <p className="mb-0 opacity-75">
                  Pas de panique ! Nous allons vous aider à retrouver l'accès à votre compte en toute sécurité.
                </p>
              </div>

              {/* Étapes du processus */}
              <div className="mt-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    1
                  </div>
                  <span className="small">Entrez votre email ou téléphone</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    2
                  </div>
                  <span className="small opacity-75">Recevez le code de vérification</span>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    3
                  </div>
                  <span className="small opacity-75">Réinitialisez votre mot de passe</span>
                </div>
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
                <div className="text-center py-4 px-3" style={{ backgroundColor: '#FF9800', color: 'white' }}>
                  <h4 className="fw-bold mb-0">Mot de passe oublié</h4>
                  <small className="opacity-75">Récupération de compte</small>
                </div>
                
                <div className="card-body p-4 p-md-5">
                  {/* Icône d'information */}
                  <div className="text-center mb-4">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#FFF3E0',
                        color: '#FF9800'
                      }}
                    >
                      <i className="bi bi-key" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <div>{success}</div>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <p className="text-muted mb-0">
                      Entrez votre adresse e-mail ou numéro de téléphone et nous vous enverrons un code pour réinitialiser votre mot de passe.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="identifiant" className="form-label small text-muted">Email ou téléphone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="text"
                          id="identifiant"
                          name="identifiant"
                          value={identifiant}
                          onChange={(e) => setIdentifiant(e.target.value)}
                          className="form-control bg-light border-start-0"
                          placeholder="Entrez votre email ou téléphone"
                          required
                        />
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
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Envoyer le code
                        </>
                      )}
                    </button>
                  </form>
                  
                  <hr className="my-4" />
                  
                  <div className="text-center mb-3">
                    <span className="text-muted small">Vous vous souvenez de votre mot de passe ?</span>
                  </div>
                  
                  <Link 
                    to="/login" 
                    className="btn btn-outline-secondary w-100 py-2 rounded-pill d-flex align-items-center justify-content-center"
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
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour à la connexion
                  </Link>

                  {/* Aide supplémentaire */}
                  <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-info-circle text-muted me-2 mt-1"></i>
                      <div>
                        <small className="text-muted">
                          <strong>Besoin d'aide ?</strong><br/>
                          Si vous n'arrivez pas à récupérer votre compte, contactez notre support client.
                        </small>
                      </div>
                    </div>
                  </div>
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

export default ForgotPassword;