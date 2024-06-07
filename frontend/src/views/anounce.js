import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import './anounce.css';

const Anounce = (props) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Вы не авторизованы");
      return;
    }
    
    fetch('http://localhost:8080/api/games', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => setGames(data))
      .catch(error => console.error("Error fetching games:", error));
  }, []);

  const joinGame = (gameId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Вы не авторизованы");
      return;
    }

    fetch('http://localhost:8080/api/games/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId }),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          console.log('Вы успешно записались на игру');
          // Обновить список игр после успешной записи
          setGames(prevGames => prevGames.map(game => {
            if (game.id === gameId) {
              return { ...game, currentPlayers: game.currentPlayers + 1 };
            }
            return game;
          }));
        } else {
          console.log('Ошибка при записи на игру');
        }
      })
      .catch(error => console.error("Error joining game:", error));
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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
          <span className="anounce-text04">{game.gameName}</span>
          <div className="anounce-info">
            <div className="anounce-container1">
              <span className="anounce-text05">Дата</span>
              <span className="anounce-text06">{new Date(game.date).toLocaleDateString()}</span>
            </div>
            <div className="anounce-container2">
              <span className="anounce-text07">Время</span>
              <span className="anounce-text08">{formatTime(game.time)}</span>
            </div>
            <div className="anounce-container3">
              <span className="anounce-text11">
                <span>Число игроков</span>
                <br></br>
              </span>
              <span className="anounce-text14">
                <span>{game.currentPlayers}/{game.numberOfPlayers}</span>
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
  );
};

export default Anounce;
