import React, { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    onSubmit(text);
    setText('');
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      width: '100%',
      marginTop: '1rem',
      transition: 'all 0.3s ease-in-out',
    },
    textarea: {
      resize: 'vertical',
      minHeight: '80px',
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    textareaFocus: {
      borderColor: '#007bff',
    },
    button: {
      alignSelf: 'flex-end',
      background: 'linear-gradient(90deg, #007bff, #0056b3)',
      color: 'white',
      fontSize: '0.95rem',
      fontWeight: '500',
      border: 'none',
      borderRadius: '8px',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      transition: 'background 0.3s ease, transform 0.1s ease',
    },
    buttonHover: {
      background: 'linear-gradient(90deg, #0056b3, #003d80)',
      transform: 'scale(1.02)',
    },
  };

  const [hovered, setHovered] = useState(false);

  return (
    <form
      className="comment-form"
      onSubmit={handleSubmit}
      style={styles.form}
    >
      <textarea
        placeholder="💬 Add a comment..."
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          ...styles.textarea,
          ...(text ? styles.textareaFocus : {}),
        }}
      />
      <button
        type="submit"
        style={{
          ...styles.button,
          ...(hovered ? styles.buttonHover : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
