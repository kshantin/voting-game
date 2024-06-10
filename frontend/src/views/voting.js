import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import './voting.css';

const Voting = (props) => {
  const [criteria, setCriteria] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [votes, setVotes] = useState({});
  const [isVotingCompleted, setIsVotingCompleted] = useState(false);

  useEffect(() => {
    // Fetch criteria and participants from the backend
    fetch('/api/voting/criteria')
      .then(response => response.json())
      .then(data => setCriteria(data))
      .catch(error => console.error('Error fetching criteria:', error));

    fetch(`/api/voting/participants?gameId=${props.gameId}`)
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  }, [props.gameId]);

  const handleVoteChange = (criterionId, participantId) => {
    setVotes({ ...votes, [criterionId]: participantId });
  };

  const handleVoteSubmit = () => {
    const voteData = Object.entries(votes).map(([criterionId, participantId]) => ({
      gameId: props.gameId,
      voterId: props.userId,
      participantId: parseInt(participantId, 10),
      criterionId: parseInt(criterionId, 10),
    }));

    fetch('/api/voting/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Votes submitted:', data);
        setIsVotingCompleted(true);
      })
      .catch(error => console.error('Error submitting votes:', error));
  };

  return (
    <div className="voting-container">
      <Helmet>
        <title>Voting - Outstanding Old Bison</title>
        <meta property="og:title" content="Voting - Outstanding Old Bison" />
      </Helmet>
      <Header rootClassName="header-root-class-name"></Header>
      <h1 className="voting-text">Голосование</h1>
      {isVotingCompleted ? (
        <div>Спасибо за ваше голосование!</div>
      ) : (
        <div>
          {criteria.map(criterion => (
            <div key={criterion.id} className="voting-dropdown">
              <label htmlFor={`criterion-${criterion.id}`}>{criterion.name}:</label>
              <select
                id={`criterion-${criterion.id}`}
                onChange={(e) => handleVoteChange(criterion.id, e.target.value)}
              >
                <option value="">--Выберите участника--</option>
                {participants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.username}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button onClick={handleVoteSubmit}>Проголосовать</button>
        </div>
      )}
    </div>
  );
};

export default Voting;
