import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import './voting.css';

const Voting = () => {
    const { gameId } = useParams();
    const [criteria, setCriteria] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState({});
    const [error, setError] = useState(null);
    const [allFieldsSelected, setAllFieldsSelected] = useState(false);

    useEffect(() => {
        console.log('Fetching criteria from /api/voting/criteria');
        fetch('http://localhost:8080/api/voting/criteria', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          } 
        })
            .then(response => {
                console.log('Criteria response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched criteria:', data);
                setCriteria(data);
            })
            .catch(error => {
                console.error('Error fetching criteria:', error);
                setError('Error fetching criteria');
            });

        console.log(`Fetching participants from /api/voting/participants?gameId=${gameId}`);
        fetch(`http://localhost:8080/api/voting/participants?gameId=${gameId}`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          } 
        })
            .then(response => {
                console.log('Participants response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched participants:', data);
                setParticipants(data);
            })
            .catch(error => {
                console.error('Error fetching participants:', error);
                setError('Error fetching participants');
            });
    }, [gameId], );

    const handleSubmitVote = async () => {
      // Проверяем, были ли выбраны все поля
      if (!allFieldsSelected) {
          alert("Выберите участников для всех критериев");
          return;
      }
  
      // Формируем данные голоса
      const votes = criteria.map((criterion) => ({
          gameId: parseInt(gameId),
          voterId: 5, // Замените на идентификатор текущего пользователя
          participantId: parseInt(selectedParticipants[criterion.id]),
          criterionId: parseInt(criterion.id),
      }));
  
      try {
          const response = await fetch('http://localhost:8080/api/voting/vote', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(votes),
          });
          if (!response.ok) {
              throw new Error('Ошибка при отправке голосов');
          }
          console.log('Голоса отправлены успешно');
          // Дополнительные действия после успешной отправки голосов, если необходимо
      } catch (error) {
          console.error('Ошибка при отправке голосов:', error);
          // Обработка ошибки при отправке голосов
      }
  };

  const handleParticipantChange = (criterionId, participantId) => {
    setSelectedParticipants({
        ...selectedParticipants,
        [criterionId]: participantId,
    });

    // Проверяем, есть ли пустые значения в выбранных участниках
    const allSelected = Object.values(selectedParticipants).every((value) => value !== '');
    setAllFieldsSelected(allSelected);
  };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="voting-container">
            <Helmet>
                <title>Voting - Outstanding Old Bison</title>
                <meta property="og:title" content="Voting - Outstanding Old Bison" />
            </Helmet>
            <Header rootClassName="header-root-class-name"></Header>
            <h1 className="voting-text">Голосование</h1> 
            <div className="creteria-container">
              {criteria.map((criterion) => (
                  <div key={criterion.id} className="voting-criterion">
                      <div>{}</div>
                      <h2>{(criteria.indexOf(criterion) + 1) + ". " + criterion.name}</h2>
                      <select
                          className="voting-dropdown"
                          value={selectedParticipants[criterion.id] || ''}
                          onChange={(e) => handleParticipantChange(criterion.id, e.target.value)}
                      >
                          <option value="">Выберите участника</option>
                          {participants.map((participant) => (
                              <option key={participant.id} value={participant.id}>
                                  {participant.username}
                              </option>
                          ))}
                      </select>
                  </div>
              ))}
              <button onClick={() => handleSubmitVote(criteria.id)}>Проголосовать</button>
            </div>
        </div>
    );
};

export default Voting;
