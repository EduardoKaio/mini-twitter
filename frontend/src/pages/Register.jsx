import React, { useState } from 'react';
import { register } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Ícones de olho
import { Snackbar, Alert } from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ username, email, password });
      console.log('Usuário registrado com sucesso:', response);
      setSuccessMessage(true); // Exibe o Snackbar
      setTimeout(() => navigate('/login', { replace: true }), 2000); // Redireciona após 3 segundos
    } catch (err) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Registrar</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button className='button-login' type="submit">Cadastrar</button>
        </form>

        <p className="login-prompt">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>

      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
          sx={{
            backgroundColor: '#7b1fa2',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }}
        >
          Usuário registrado com sucesso!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
