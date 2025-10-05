// pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password }); // Now returns user directly
      // ✅ Redirect based on role
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'agent') navigate('/agent/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    }
  };

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#f4f6f8', padding: '1rem'
    },
    formBox: {
      backgroundColor: '#fff', padding: '2rem', borderRadius: '100px 30px 100px 30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%',
      display: 'flex', flexDirection: 'column', gap: '1rem'
    },
    heading: { fontSize: '1.8rem', marginBottom: '1rem', color: '#2c3e50', textAlign: 'center' },
    input: { padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s ease' },
    inputFocus: { borderColor: '#3498db' },
    button: { padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', backgroundColor: hover ? '#2980b9' : '#3498db', color: '#fff', transition: 'all 0.2s ease' },
    error: { color: '#e74c3c', fontSize: '0.9rem', textAlign: 'center' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <button type="submit" style={styles.button} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>Login</button>
          <p>Don't have an account? <a href="/register">Register</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
