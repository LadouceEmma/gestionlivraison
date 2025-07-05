import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPassword: React.FC = () => {
  const [form, setForm] = useState({
    identifiant: '',
    reset_code: ['', '', '', '', '', ''],
    new_password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(0, 1);
    const newCode = [...form.reset_code];
    newCode[index] = value;
    setForm({ ...form, reset_code: newCode });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, new_password: e.target.value });
    setError(null);
  };

  const handleIdentifiantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, identifiant: e.target.value });
    setError(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = form.reset_code.join('');
      const res = await api.post('/reset-password', {
        identifiant: form.identifiant,
        reset_code: code,
        new_password: form.new_password
      });

      setSuccessMessage(res.data.message);
      setForm({ identifiant: '', reset_code: ['', '', '', '', '', ''], new_password: '' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center p-3">
      <div className="card border-0 rounded-4 shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-header text-white bg-gradient border-0 rounded-top-4 text-center p-4">
          <i className="bi bi-shield-lock-fill display-4 mb-3"></i>
          <h2 className="mb-0 fw-bold">Réinitialiser le mot de passe</h2>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger d-flex align-items-center border-0 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success d-flex align-items-center border-0 rounded-3 mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div>{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium text-orange">Identifiant</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-orange">
                  <i className="bi bi-person-fill text-orange"></i>
                </span>
                <input
                  type="text"
                  name="identifiant"
                  value={form.identifiant}
                  onChange={handleIdentifiantChange}
                  className="form-control border-orange"
                  placeholder="Email ou téléphone"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium text-orange">Code de réinitialisation</label>
              <div className="d-flex gap-2">
                {form.reset_code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e, index)}
                    className="form-control text-center fw-bold fs-5 border-orange"
                    style={{ width: '45px', height: '55px' }}
                    placeholder=""
                    required
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <small className="text-muted d-block mt-2">
                <i className="bi bi-info-circle-fill me-1 text-orange"></i>
                Entrez le code à 6 chiffres envoyé à votre adresse email
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium text-orange">Nouveau mot de passe</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-orange">
                  <i className="bi bi-key-fill text-orange"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  value={form.new_password}
                  onChange={handlePasswordChange}
                  className="form-control border-orange"
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-orange"
                  onClick={toggleShowPassword}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>
              <div className="password-strength mt-2">
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${form.new_password.length > 8 ? 'bg-success' : 'bg-orange'}`} 
                    style={{ width: `${Math.min(100, form.new_password.length * 10)}%` }}
                  ></div>
                </div>
                <small className="d-block mt-1 text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  8 caractères minimum recommandés
                </small>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-orange text-white fw-medium py-2 rounded-3">
                <i className="bi bi-check2-circle me-2"></i>
                Réinitialiser mon mot de passe
              </button>
              <button 
                type="button" 
                className="btn btn-light border fw-medium py-2 rounded-3"
                onClick={() => navigate('/login')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Retour à la connexion
              </button>
            </div>
          </form>
        </div>
        
        <div className="card-footer bg-light border-0 rounded-bottom-4 p-3 text-center">
          <small className="text-muted">
            Besoin d'aide? <a href="#" className="text-decoration-none text-orange fw-medium">Contactez le support</a>
          </small>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        /* Orange theme colors */
        .bg-orange {
          background-color: #FF6B00 !important;
        }
        .text-orange {
          color: #FF6B00 !important;
        }
        .btn-orange {
          background-color: #FF6B00 !important;
          border-color: #FF6B00 !important;
        }
        .btn-orange:hover {
          background-color: #E05A00 !important;
          border-color: #E05A00 !important;
        }
        .btn-outline-orange {
          color: #FF6B00 !important;
          border-color: #FF6B00 !important;
        }
        .btn-outline-orange:hover {
          background-color: #FFF1E6 !important;
        }
        .border-orange {
          border-color: #FF6B00 !important;
        }
        
        /* Custom Border Radius */
        .rounded-4 {
          border-radius: 0.75rem !important;
        }
        .rounded-top-4 {
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
        }
        .rounded-bottom-4 {
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }
        
        /* Gradient Background */
        .bg-gradient {
          background-image: linear-gradient(to right, #FF6B00, #FF8B3D) !important;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;