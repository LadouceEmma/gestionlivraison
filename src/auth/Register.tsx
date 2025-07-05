import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

interface RegisterForm {
  nom: string;
  email: string;
  telephone: string;
  password: string;
  confirm_password: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/register-client', form);
      alert(res.data.message);
      navigate('/login');
    } catch (err: any) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (err && typeof err === 'object') {
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Erreur d\'inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                <h3 className="h4 mb-3">Rejoignez-nous !</h3>
                <p className="mb-0 opacity-75">
                  Créez votre compte pour profiter de nos services de livraison et suivre vos colis en temps réel.
                </p>
              </div>

              {/* Avantages */}
              <div className="mt-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <span className="small">Livraison rapide et sécurisée</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <span className="small">Suivi en temps réel</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <span className="small">Service client 24/7</span>
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
                  <h4 className="fw-bold mb-0">Inscription</h4>
                  <small className="opacity-75">Étape {step} sur 2</small>
                </div>
                
                <div className="card-body p-4 p-md-5">
                  {/* Indicateur de progression */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className={`small ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                        Informations personnelles
                      </span>
                      <span className={`small ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                        Mot de passe
                      </span>
                    </div>
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${(step / 2) * 100}%`,
                          backgroundColor: '#FF9800'
                        }}
                      ></div>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div>
                        <div className="mb-4">
                          <label className="form-label small text-muted">Nom complet</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-person text-muted"></i>
                            </span>
                            <input
                              type="text"
                              name="nom"
                              value={form.nom}
                              onChange={handleChange}
                              className="form-control bg-light border-start-0"
                              placeholder="Entrez votre nom complet"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label small text-muted">Email</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-envelope text-muted"></i>
                            </span>
                            <input
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              className="form-control bg-light border-start-0"
                              placeholder="Entrez votre email"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label small text-muted">Téléphone</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-phone text-muted"></i>
                            </span>
                            <input
                              type="tel"
                              name="telephone"
                              value={form.telephone}
                              onChange={handleChange}
                              className="form-control bg-light border-start-0"
                              placeholder="Entrez votre numéro de téléphone"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary w-100 py-2 rounded-pill fw-bold"
                          onClick={() => setStep(2)}
                          style={orangeButtonStyle}
                          onMouseOver={(e) => {
                            Object.assign(e.currentTarget.style, orangeButtonHoverStyle);
                          }}
                          onMouseOut={(e) => {
                            Object.assign(e.currentTarget.style, orangeButtonStyle);
                          }}
                        >
                          Étape suivante
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <div className="mb-4">
                          <label className="form-label small text-muted">Mot de passe</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-lock text-muted"></i>
                            </span>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={form.password}
                              onChange={handleChange}
                              className="form-control bg-light border-start-0 border-end-0"
                              placeholder="Créez votre mot de passe"
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
                          <label className="form-label small text-muted">Confirmer le mot de passe</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-shield-check text-muted"></i>
                            </span>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirm_password"
                              value={form.confirm_password}
                              onChange={handleChange}
                              className="form-control bg-light border-start-0 border-end-0"
                              placeholder="Confirmez votre mot de passe"
                              required
                            />
                            <span 
                              className="input-group-text bg-light border-start-0 cursor-pointer"
                              onClick={toggleConfirmPasswordVisibility}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''} text-muted`}></i>
                            </span>
                          </div>
                        </div>

                        <div className="d-flex gap-2 mb-4">
                          <button
                            type="button"
                            className="btn btn-outline-secondary flex-fill py-2 rounded-pill"
                            onClick={() => setStep(1)}
                            style={{
                              color: '#6c757d',
                              borderColor: '#6c757d'
                            }}
                          >
                            Retour
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary flex-fill py-2 rounded-pill fw-bold"
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
                                Inscription...
                              </>
                            ) : (
                              'S\'inscrire'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                  
                  <div className="text-center">
                    <span className="text-muted small">Vous avez déjà un compte ? </span>
                    <Link 
                      to="/login" 
                      className="text-decoration-none small fw-bold"
                      style={{ color: '#FF9800' }}
                    >
                      Se connecter
                    </Link>
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

export default Register;