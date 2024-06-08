import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './create-game.css';

const CreateGame = (props) => {
  const [gameName, setGameName] = useState('');
  const [numberOfPlayers, setNumberOfPlayers] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const handleGameNameChange = (e) => {
    setGameName(e.target.value);
  };

  const handleNumberOfPlayersChange = (e) => {
    setNumberOfPlayers(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        gameName,
        numberOfPlayers: parseInt(numberOfPlayers, 10),
        description,
        date,
        time: time + ':00',
      };

      const response = await axios.post('http://localhost:8080/api/games', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log('Game created successfully', response.data);
        // Перенаправление после успешного создания игры, например:
        // window.location.href = '/games';
      } else {
        setError('Failed to create game');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during game creation');
      }
      console.error('Game creation error', error);
    }
  };
// Версия 1 
//  const handleSubmit = async () => {
//   if (!gameName || !numberOfPlayers) {
//     setError('Game name and number of players are required.');
//     return;
//   }

//   try {
//     const token = localStorage.getItem('token');
//     const payload = {
//       gameName,
//       numberOfPlayers: parseInt(numberOfPlayers, 10),
//       description,
//       date,
//       time: time + ':00',
//     };

//     console.log('Sending payload:', payload);  // Логирование данных перед отправкой

//     const response = await axios.post('http://localhost:8080/api/games', payload, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (response.status === 201) {
//       console.log('Game created successfully', response.data);
//       // Перенаправление после успешного создания игры, например:
//       // window.location.href = '/games';
//     } else {
//       setError('Failed to create game');
//     }
//   } catch (error) {
//     if (error.response) {
//       setError(error.response.data.message);
//     } else {
//       setError('An error occurred during game creation');
//     }
//     console.error('Game creation error', error);
//   }
// };

  return (
    <div className="create-game-container">
      <Helmet>
        <title>Create Game - Outstanding Old Bison</title>
        <meta property="og:title" content="Create Game - Outstanding Old Bison" />
      </Helmet>
      <h1 className="create-game-title">Create a New Game</h1>
      <div className="create-game-inputs">
        <div className="create-game-input">
          <label htmlFor="gameName">Game Name</label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={handleGameNameChange}
            placeholder="Enter game name"
            className="input"
          />
        </div>
        <div className="create-game-input">
          <label htmlFor="numberOfPlayers">Number of Players</label>
          <input
            type="number"
            id="numberOfPlayers"
            value={numberOfPlayers}
            onChange={handleNumberOfPlayersChange}
            placeholder="Enter number of players"
            className="input"
          />
        </div>
        <div className="create-game-input">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter game description"
            className="input"
          />
        </div>
        <div className="create-game-input">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="input"
          />
        </div>
        <div className="create-game-input">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={handleTimeChange}
            className="input"
          />
        </div>
      </div>
      {error && <div className="create-game-error">{error}</div>}
      <div className="create-game-submit">
        <button type="button" className="button" onClick={handleSubmit}>
          Create Game
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
