import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import './profile.css';

const Profile = (props) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("Вы не авторизованы");
          return;
        }

        const decodedToken = jwtDecode(token);
        setUserID(decodedToken.userId); // Сохранение userID в состояние
        console.log(userID);
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
              <span>Имя пользователя: </span>
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
        {profile.games.map((game) => (
          <div key={game.id} className="profile-game">
            <span className="profile-text21">{game.gameName}</span>
            <span className="profile-text22">{new Date(game.date).toLocaleDateString()}</span>
            <button type="button" className="button profile-button">
              <span>
                <span>Голосование</span>
                <br />
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
