import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      padding: '1rem',
      
    },
    formBox: {
      backgroundColor: '#ffffffff',
      padding: '2rem',
      borderRadius: '100px 30px 100px 30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    heading: {
      fontSize: '1.8rem',
      marginBottom: '1rem',
      textAlign: 'center',
      color: '#2c3e50',
    },
    input: {
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    select: {
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: '#fff',
      transition: 'border-color 0.2s ease',
      cursor: 'pointer',
    },
    button: {
      padding: '0.7rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      backgroundColor: hover ? '#2980b9' : '#3498db',
      color: '#fff',
      transition: 'all 0.2s ease',
      marginTop: '0.5rem',
    },
    error: {
      color: '#e74c3c',
      fontSize: '0.9rem',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Register
          </button>
          <p>Already have an account? <a href="/login">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
