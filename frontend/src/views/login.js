import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

import Header from '../components/header';
import './login.css';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Авторизация успешна, перенаправьте пользователя или выполните другие действия
        console.log('Login successful', response.data);
        // Пример перенаправления
        // window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error', error);
    }
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>Outstanding Old Bison</title>
        <meta property="og:title" content="Outstanding Old Bison" />
      </Helmet>
      <Header></Header>
      <h1 className="login-text">Negotium</h1>
      <div className="login-inputs">
        <div className="login-email-comp">
          <span className="login-text01">
            <span>email</span>
            <br></br>
          </span>
          <input
            type="email"
            id="email"
            placeholder="@email"
            className="input login-input"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="login-password-comp">
          <span className="login-text04">
            <span>password</span>
            <br></br>
          </span>
          <input
            type="password"
            id="password"
            placeholder="password"
            className="input login-textinput"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      <div className="login-submit-form">
        <div className="login-container1">
          <div className="login-container2">
            <button type="button" className="button login-button" onClick={handleSubmit}>
              <span>
                <span>Вход</span>
                <br></br>
              </span>
            </button>
          </div>
        </div>
        <a
          href="http://localhost:3000/registr"
          target="_blank"
          rel="noreferrer noopener"
          className="login-link"
        >
          <span>Зарегистрироваться</span>
          <br></br>
        </a>
      </div>
    </div>
  );
};

export default Login;