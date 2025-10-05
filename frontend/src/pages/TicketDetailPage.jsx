// pages/TicketDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getTicketById, updateTicket } from '../services/ticketService';
import { listCommentsByTicket, addComment } from '../services/commentService';
import CommentSection from '../components/CommentSection';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../hooks/useAuth';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const t = await getTicketById(id);

      // 🔹 Role-based access enforcement
      if (user.role === 'user' && t.ticket.requester_id !== user.id) {
        setTicket(null); // prevent viewing
        return;
      }
      if (user.role === 'agent' && t.ticket.assignee_id !== user.id) {
        setTicket(null); // prevent viewing tickets not assigned
        return;
      }

      setTicket(t.ticket);
      setComments(t.comments);
    } catch (err) {
      console.error(err);
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleComment = async (text, parentId = null) => {
    try {
      await addComment(id, { body: text, parent_id: parentId });
      fetchTicket();
    } catch (err) {
      console.error(err);
      setError('Failed to add comment');
    }
  };

  const handleUpdate = async (fields) => {
    try {
      // Include optimistic locking header
      const updated = await updateTicket(id, fields, ticket.version);
      fetchTicket();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || 'Update failed');
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '1rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    heading: { fontSize: '1.8rem', marginBottom: '1rem', color: '#2c3e50' },
    info: { marginBottom: '0.8rem', color: '#34495e' },
    section: { margin: '1rem 0' },
    loading: { textAlign: 'center', marginTop: '2rem', color: '#7f8c8d' },
    error: { color: '#e74c3c', marginTop: '1rem' },
    button: { marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#3498db', color: '#fff' }
  };

  if (loading) return <p style={styles.loading}>Loading ticket...</p>;
  if (!ticket) return <Navigate to="/login" />; // redirect if unauthorized or not found

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{ticket.title}</h2>
      <p style={styles.info}><strong>Status:</strong> {ticket.status}</p>
      <p style={styles.info}><strong>Description:</strong> {ticket.description}</p>
      <p style={styles.info}><strong>Assignee:</strong> {ticket.assignee_id || 'Unassigned'}</p>
      <p style={styles.info}><strong>Requester:</strong> {ticket.requester_id}</p>
      <p style={styles.info}><strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
      <p style={styles.info}><strong>Updated At:</strong> {new Date(ticket.updated_at).toLocaleString()}</p>
      <p style={styles.info}><strong>SLA Breached:</strong> {ticket.breached ? 'Yes' : 'No'}</p>

      {/* Agent/Admin Controls */}
      {(user.role === 'agent' || user.role === 'admin') && (
        <div style={styles.section}>
          <strong>Update Ticket:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            <button style={styles.button} onClick={() => handleUpdate({ status: 'in_progress' })}>Mark In Progress</button>
            <button style={styles.button} onClick={() => handleUpdate({ status: 'resolved' })}>Resolve</button>
          </div>
        </div>
      )}

      {/* Comments */}
      <div style={styles.section}>
        <h3>Comments</h3>
        <CommentSection comments={comments} onReply={handleComment} />
        <CommentForm onSubmit={handleComment} />
      </div>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default TicketDetailPage;
