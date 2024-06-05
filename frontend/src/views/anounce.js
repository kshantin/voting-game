import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Header from '../components/header'
import './anounce.css'

const Anounce = (props) => {
  const [games, setGames] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/games')
      .then(response => response.json())
      .then(data => setGames(data))
  }, [])

  const joinGame = (gameId) => {
    const userId = 1 // замените на ID текущего пользователя
    fetch(`http://localhost:8080/api/games/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'user_id': userId,
        'game_id': gameId
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Вы успешно записались на игру')
          // обновить состояние или сделать повторный запрос данных игр
        } else {
          alert('Ошибка при записи на игру')
        }
      })
  }

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
      {games.map((game) => (
        <div key={game.id} className="anounce-game-card">
          <span className="anounce-text03">Игра</span>
          <span className="anounce-text04">{game.game_name}</span>
          <div className="anounce-info">
            <div className="anounce-container1">
              <span className="anounce-text05">Дата</span>
              <span className="anounce-text06">{new Date(game.date).toLocaleDateString()}</span>
            </div>
            <div className="anounce-container2">
              <span className="anounce-text07">Время</span>
              <span className="anounce-text08">{game.time}</span>
            </div>
            <div className="anounce-container3">
              <span className="anounce-text11">
                <span>Число игроков</span>
                <br></br>
              </span>
              <span className="anounce-text14">
                <span>{game.current_players}/{game.number_of_players}</span>
                <br></br>
              </span>
            </div>
          </div>
          <div className="anounce-description">
            <span className="anounce-text17">Описание</span>
            <span className="anounce-text18">{game.description}</span>
          </div>
          <button type="button" className="button anounce-button" onClick={() => joinGame(game.id)}>
            <span>
              <span>Записаться</span>
              <br></br>
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}

export default Anounce
