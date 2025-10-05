import React, { useState } from 'react';

const Pagination = ({ onPrev, onNext }) => {
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1.5rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.5rem 1.2rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      backgroundColor: '#3498db',
      color: '#fff',
      minWidth: '80px',
      textAlign: 'center',
    },
    hoverButton: {
      backgroundColor: '#2980b9',
      transform: 'scale(1.05)',
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.button, ...(hoverPrev ? styles.hoverButton : {}) }}
        onMouseEnter={() => setHoverPrev(true)}
        onMouseLeave={() => setHoverPrev(false)}
        onClick={onPrev}
      >
        Prev
      </button>
      <button
        style={{ ...styles.button, ...(hoverNext ? styles.hoverButton : {}) }}
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
