import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import './anounce.css'

const Anounce = (props) => {
  return (
    <div className="anounce-container">
      <Helmet>
        <title>Anounce - Voting game</title>
        <meta property="og:title" content="Anounce - Outstanding Old Bison" />
      </Helmet>
      <Header rootClassName="header-root-class-name1"></Header>
      <h1 className="anounce-text">
        <span>Анонсы</span>
        <br></br>
      </h1>
      <div className="anounce-game-card">
        <span className="anounce-text03">Игра</span>
        <span className="anounce-text04">
          &quot;Управление из любой точки&quot;
        </span>
        <div className="anounce-info">
          <div className="anounce-container1">
            <span className="anounce-text05">Дата</span>
            <span className="anounce-text06">21.10.2023</span>
          </div>
          <div className="anounce-container2">
            <span className="anounce-text07">Время</span>
            <span className="anounce-text08">
              <span>18:00</span>
              <br></br>
            </span>
          </div>
          <div className="anounce-container3">
            <span className="anounce-text11">
              <span>Число игроков</span>
              <br></br>
            </span>
            <span className="anounce-text14">
              <span>05/15</span>
              <br></br>
            </span>
          </div>
        </div>
        <div className="anounce-description">
          <span className="anounce-text17">Описание</span>
          <span className="anounce-text18">
            Деловая игра &quot;Управление из любой точки&quot; предназначена для
            того, чтобы развивать управлять из любой ролевой позиции событиями,
            разворачивающимися в игровом пространстве. В игре задействованы
            различные темы: политика и экономика, государства, бизнес.
          </span>
        </div>
        <button type="button" className="button anounce-button">
          <span>
            <span>Записаться</span>
            <br></br>
          </span>
        </button>
      </div>
    </div>
  )
}

export default Anounce
