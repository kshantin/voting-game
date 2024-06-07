import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import './profile.css'

const Profile = (props) => {
  return (
    <div className="profile-container">
      <Helmet>
        <title>Profile - Outstanding Old Bison</title>
        <meta property="og:title" content="Profile - Outstanding Old Bison" />
      </Helmet>
      <Header rootClassName="header-root-class-name2"></Header>
      <div className="profile-container1">
        <h1 className="profile-text">
          <span>Мой профиль</span>
          <br></br>
        </h1>
        <div className="profile-profile-info">
          <div className="profile-username">
            <span className="profile-text03">
              <span>Имя пользователя: </span>
              <br></br>
            </span>
            <span className="profile-text06">
              <span>Кирилл</span>
              <br></br>
            </span>
          </div>
          <div className="profile-count-game">
            <span className="profile-text09">
              <span>Количество игр:</span>
              <br></br>
            </span>
            <span className="profile-text12">
              <span>2</span>
              <br></br>
            </span>
          </div>
          <div className="profile-best-roles">
            <span className="profile-text15">
              <span>Лучшие роли:</span>
              <br></br>
            </span>
            <span className="profile-text18">
              <span>1</span>
              <br></br>
            </span>
          </div>
        </div>
        <div className="profile-game">
          <span className="profile-text21">“Князь” и “Слалом”</span>
          <span className="profile-text22">23.12.2023</span>
          <button type="button" className="button profile-button">
            <span>
              <span>Голосование</span>
              <br></br>
            </span>
          </button>
        </div>
        <div className="profile-game1">
          <span className="profile-text26">
            &quot;Управляй из любой точки&quot;
          </span>
          <span className="profile-text27">10.12.2023</span>
          <button type="button" className="button profile-button1">
            <span>
              <span>Отчёт</span>
              <br></br>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
// Теперь давай создадим страницу профиля. На странице должны отображаться имя, количества игр, лучшие роли игрока, кроме того необходимо выводить . Исходя из кода ниже напиши обработчики для этих полей,   