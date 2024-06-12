import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom'; // Импортируем useParams для получения gameId из URL
import Header from '../components/header';
import './report.css';

const ReportPage = (props) => {
  const { gameId } = useParams(); // Получаем gameId из URL
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Вы не авторизованы");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/games/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(`Error fetching game: ${err.message}`);
        console.error("Error fetching game:", err);
      }
    };

    fetchGame();
  }, [gameId]);

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getSeconds().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="report">
      <div className="report-container">
        <Helmet>
          <title>Report - Voting game</title>
          <meta property="og:title" content="Report" />
        </Helmet>
        <h2 className='report-h2'>Отчет об игре</h2>
        <span className="report-gameName">{game.gameName}</span>
        <div className="report-info">
          <div className="report-info-item">
            <span className="report-info-title">Дата:</span>
            <span className="report-info-value">{new Date(game.date).toLocaleDateString()}</span>
          </div>
          <div className="report-info-item">
            <span className="report-info-title">Время:</span>
            <span className="report-info-value">{formatTime(game.time)}</span>
          </div>
          <div className="report-info-item">
            <span className="report-info-title">Число игроков:</span>
            <span className="report-info-value">{game.currentPlayers}/{game.numberOfPlayers}</span>
          </div>
          {/* Добавьте другие необходимые данные */}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
