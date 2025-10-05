import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
  const [hovered, setHovered] = useState(false);

  const styles = {
    card: {
      backgroundColor: '#ffffff',
      padding: '1.2rem 1.5rem',
      marginBottom: '1rem',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      maxWidth: '700px',
      width: '100%',
    },
    cardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '0.5rem',
      color: '#2c3e50',
      textDecoration: 'none',
    },
    link: {
      textDecoration: 'none',
      color: '#3498db',
      transition: 'color 0.2s ease',
    },
    linkHover: {
      color: '#2980b9',
    },
    info: {
      fontSize: '0.95rem',
      color: '#555',
      marginBottom: '0.3rem',
    },
  };

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 style={styles.title}>
        <Link
          to={`/tickets/${ticket.id}`}
          style={styles.link}
          onMouseEnter={e => e.currentTarget.style.color = styles.linkHover.color}
          onMouseLeave={e => e.currentTarget.style.color = styles.link.color}
        >
          {ticket.title}
        </Link>
      </h3>
      <p style={styles.info}>Status: {ticket.status}</p>
      <p style={styles.info}>Assignee: {ticket.assignee_id || 'Unassigned'}</p>
      <p style={styles.info}>Latest Comment: {ticket.latest_comment || 'None'}</p>
    </div>
  );
};

export default TicketCard;
