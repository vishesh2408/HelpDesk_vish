import React, { useState } from 'react';
import { createTicket } from '../services/ticketService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NewTicketPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sla_due, setSlaDue] = useState('');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket({ 
  title, 
  description, 
  user_id: user.id, 
  priority: 'normal', 
  sla_seconds: 86400 
});

      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error creating ticket');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh',
    },
    formBox: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    heading: {
      fontSize: '1.6rem',
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
    textarea: {
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'border-color 0.2s ease',
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
        <h2 style={styles.heading}>New Ticket</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={styles.textarea}
            onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <input
            type="datetime-local"
            value={sla_due}
            onChange={e => setSlaDue(e.target.value)}
            style={styles.input}
            onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicketPage;
