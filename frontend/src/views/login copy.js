import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import './login.css'

const Login = (props) => {
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
            id=" email"
            placeholder="@email"
            className="input login-input"
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
          />
        </div>
      </div>

      <div className="login-submit-form">
        <div className="login-container1">
          <div className="login-container2">
            <button type="button" className="button login-button">
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
  )
}

export default Login
