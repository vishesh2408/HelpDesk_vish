// components/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      top: 0,
      left: 0,
      right: 0,
      padding: '1rem 2rem',
      backgroundColor: '#2c3e50',
      color: '#fff',
      flexWrap: 'wrap',
    },
    title: { fontSize: '1.8rem', cursor: 'pointer', fontWeight: '600' },
    userSection: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '1rem' },
    button: { padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' },
    logoutButton: { backgroundColor: hoverLogout ? '#c0392b' : '#e74c3c', color: '#fff' },
    loginButton: { backgroundColor: hoverLogin ? '#2980b9' : '#3498db', color: '#fff' },
    userName: { fontWeight: '500', color: '#ecf0f1' },
  };

  const handleTitleClick = () => {
    if (!user) navigate('/login');
    else if (user.role === 'admin') navigate('/admin/dashboard');
    else if (user.role === 'agent') navigate('/agent/dashboard');
    else navigate('/user/dashboard');
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title} onClick={handleTitleClick}>{title || 'HelpDesk Mini'}</h1>
      <div style={styles.userSection}>
        {user ? (
          <>
            <span style={styles.userName}>{user.name} ({user.role})</span>
            <button
              style={{ ...styles.button, ...styles.logoutButton }}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
              onClick={() => { logout(); navigate('/login'); }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            style={{ ...styles.button, ...styles.loginButton }}
            onMouseEnter={() => setHoverLogin(true)}
            onMouseLeave={() => setHoverLogin(false)}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
