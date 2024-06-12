import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './profile.css';

const Profile = (props) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [userID, setUserID] = useState(null);
    const [criteria, setCriteria] = useState([]);
    const [votes, setVotes] = useState([]);
    const [votingStatuses, setVotingStatuses] = useState({}); // Добавляем состояние для статусов голосования

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log("Вы не авторизованы");
                    return;
                }

                const decodedToken = jwtDecode(token);
                setUserID(decodedToken.userId);
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (err) {
                setError(`Failed to fetch profile: ${err.message}`);
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const criteriaResponse = await axios.get('http://localhost:8080/api/voting/criteria');
                setCriteria(criteriaResponse.data);

                if (profile && profile.games) {
                    const gameIds = profile.games.map(game => game.id);
                    const votesResponse = await axios.get('http://localhost:8080/api/voting/votes', {
                        params: { gameIds: gameIds.join(',') }
                    });
                    setVotes(votesResponse.data);

                    // Получаем статусы голосования для каждой игры
                    const statusPromises = gameIds.map(gameId =>
                        axios.get('http://localhost:8080/api/voting/status', {
                            params: { gameId }
                        })
                    );
                    const statusResponses = await Promise.all(statusPromises);
                    const statuses = {};
                    statusResponses.forEach((response, index) => {
                        statuses[gameIds[index]] = response.data.votingClosed;
                    });
                    setVotingStatuses(statuses);
                }
            } catch (err) {
                setError(`Failed to fetch voting data: ${err.message}`);
                console.error('Error fetching voting data:', err);
            }
        };

        if (profile) {
            fetchData();
        }
    }, [profile]);

    const getVoteCounts = () => {
        return criteria.map(criterion => {
            // Фильтруем голоса по критерию и номинанту (participantId)
            const votesForCriterion = votes.filter(vote => vote.criterionId === criterion.id && vote.participantId === userID);
            return votesForCriterion.length;
        });
    };

    const voteCounts = getVoteCounts();

    const chartData = {
        labels: criteria.map(criterion => criterion.name),
        datasets: [
            {
                label: 'Количество голосов за пользователя',
                data: voteCounts,
                backgroundColor: 'rgba(255, 255, 255, 0.6)', // Белый цвет с прозрачностью
                borderColor: 'rgba(255, 255, 255, 1)', // Белый цвет
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                }
            },
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)',
              }
          }
      },
      plugins: {
          legend: {
              labels: {
                  color: 'white',
              }
          }
      },
      maintainAspectRatio: false,
  };

  const goToVoting = (gameId) => {
      window.location.href = `/voting/${gameId}`; // Переход на страницу голосования
  };

  if (error) {
      return <div className="error">{error}</div>;
  }

  if (!profile) {
      return <div>Loading...</div>;
  }

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
                  <br />
              </h1>
              <div className="profile-profile-info">
                  <div className="profile-username">
                      <span className="profile-text03">
                          <span>Имя пользователя: </span>
                          <br />
                      </span>
                      <span className="profile-text06">
                          <span>{profile.user.username}</span>
                          <br />
                      </span>
                  </div>
                  <div className="profile-count-game">
                      <span className="profile-text09">
                          <span>Количество игр:</span>
                          <br />
                      </span>
                      <span className="profile-text12">
                          <span>{profile.gameCount}</span>
                          <br />
                      </span>
                  </div>
                  <div className="profile-best-roles">
                      <span className="profile-text15">
                          <span>Лучшие роли:</span>
                          <br />
                      </span>
                      <span className="profile-text18">
                          <span>1</span>
                          <br />
                      </span>
                  </div>
              </div>
              <div className="chart-container" style={{ backgroundColor: '#0E91EF', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                  <h2 style={{ color: 'white' }}>Результаты голосования</h2>
                  <div style={{ height: '400px', width: '100%' }}>
                      <Bar data={chartData} options={chartOptions} />
                  </div>
              </div>
              {profile.games.map((game) => (
                  <div key={game.id} className="profile-game">
                      <span className="profile-text21">{game.gameName}</span>
                      <span className="profile-text22">{new Date(game.date).toLocaleDateString()}</span>
                      {votingStatuses[game.id] ? (
                          <button type="button" className="button profile-button" onClick={() => closeVoting(game.id)}>
                              <span>
                                  <span>Отчёт об игре</span>
                                  <br />
                              </span>
                          </button>
                      ) : (
                          <button type="button" className="button profile-button" onClick={() => goToVoting(game.id)}>
                              <span>
                                  <span>Перейти к голосованию</span>
                                  <br />
                              </span>
                          </button>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );
};

export default Profile;
