import React from 'react';

const CommentSection = ({ comments }) => {
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      maxWidth: '700px',
      width: '100%',
      marginTop: '2rem',
    },
    heading: {
      fontSize: '1.2rem',
      marginBottom: '1rem',
      color: '#333',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '0.5rem',
    },
    comment: {
      padding: '0.6rem 0.8rem',
      marginBottom: '0.5rem',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      transition: 'background 0.2s ease',
    },
    commentHover: {
      backgroundColor: '#e9ecef',
    },
    userName: {
      fontWeight: '600',
      marginRight: '0.4rem',
      color: '#007bff',
    },
    noComments: {
      color: '#777',
      fontStyle: 'italic',
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>Comments</h4>
      {comments.length === 0 ? (
        <p style={styles.noComments}>No comments yet.</p>
      ) : (
        comments.map(c => (
          <div
            key={c.id}
            style={styles.comment}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e9ecef')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
          >
            <span style={styles.userName}>{c.user_name}</span>: {c.comment_text}
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
