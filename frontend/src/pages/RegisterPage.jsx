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
      backgroundColor: '#0a0a0a', // fallback for doodle
      padding: '1rem',
      position: 'relative', // needed for doodle overlay
      overflow: 'hidden',
    },
    formBox: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '100px 30px 100px 30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      zIndex: 2,
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
    doodle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
  };

  return (
    <div style={styles.container}>
      {/* Professional floating background */}
      <css-doodle style={styles.doodle}>
        {`
          @grid: 50x1 / 50vmin;
          :container { perspective: 20vmin; }

          background: @m(
            @p(#6c5ce7, #00b894, #fdcb6e, #0984e3) 20%,
            radial-gradient(circle, @p(#6c5ce7, #00b894, #fdcb6e, #0984e3) 30%, transparent 70%)
            @r(100%) @r(100%) / @r(2%, 4%) @lr no-repeat
          );

          @size: 60%;
          @place-cell: center;
          border-radius: 50%;
          transform-style: preserve-3d;
          animation: float 15s ease-in-out infinite;
          animation-delay: calc(@i * -0.3s);

          @keyframes float {
            0% {
              transform: translate3d(0, 0, 0) scale(0.8);
              opacity: 0.4;
            }
            50% {
              transform: translate3d(@r(-20vmin,20vmin), @r(-10vmin,10vmin), @r(0vmin,30vmin)) scale(1.2);
              opacity: 0.8;
            }
            100% {
              transform: translate3d(0, 0, 0) scale(0.8);
              opacity: 0.4;
            }
          }
        `}
      </css-doodle>

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
