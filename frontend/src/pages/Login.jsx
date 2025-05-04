import React, { useState } from 'react';
import { login } from '../services/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');      // ou email, conforme seu backend
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      console.log('Usuário logado com sucesso:', response);

      // 1) Salvar tokens no localStorage
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      
      // 2) Redirecionar para o feed
      navigate('/feed', { replace: true });
      window.location.reload(); // Recarrega a página para garantir que o estado seja atualizado
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nome de Usuário"
            uttonalue={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password-icon"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button className='button-login' type="submit">Entrar</button>
        </form>

        <p className="register-prompt">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
