// pages/AgentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getTickets, getTicketById, updateTicket, postComment } from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [updating, setUpdating] = useState(false);

  // Pagination hook
  const { limit, offset, next, prev, reset } = usePagination(12); // 5 tickets per page

  // Fetch tickets assigned to the agent
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ assignee_id: user.id, limit, offset });
      setTickets(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all agents for reassignment dropdown
  const fetchAgents = async () => {
    try {
      const res = await api.get('/users?role=agent');
      setAgents(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch ticket details including comments and timeline
  const openTicketDetail = async (ticketId) => {
    try {
      const data = await getTicketById(ticketId);
      setSelectedTicket(data);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle updating ticket fields (status, priority, assignee)
  const handleUpdateTicket = async (updates) => {
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      const data = await updateTicket(selectedTicket.ticket.id, {
        ...updates,
        version: selectedTicket.ticket.version,
      });
      setSelectedTicket(prev => ({ ...prev, ticket: data.ticket }));
      fetchTickets(); // refresh ticket list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  // Post a comment
  const handlePostComment = async () => {
    if (!commentText.trim() || !selectedTicket) return;
    setUpdating(true);
    try {
      const data = await postComment(selectedTicket.ticket.id, { body: commentText });
      setSelectedTicket(prev => ({
        ...prev,
        comments: [...prev.comments, data.comment],
      }));
      setCommentText('');
    } catch (err) {
      console.error(err);
      alert('Failed to post comment');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, [limit, offset]); // refetch when limit or offset changes

  // Styles
  const styles = {
    container: { display: 'flex', fontFamily: 'Arial, sans-serif' },
    main: { flex: 1, background: '#f5f5f5', minHeight: '100vh' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '1rem' },
    card: {
      background: '#fff',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar role="agent" />
      <div style={styles.main}>
        <Header title="Agent Dashboard" />

        {loading ? (
          <p>Loading assigned tickets...</p>
        ) : (
          <>
            <div style={styles.grid}>
              {tickets.map(ticket => (
                <div
                  key={ticket.id}
                  style={styles.card}
                  onClick={() => openTicketDetail(ticket.id)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title="Click to view detail"
                >
                  <h4>{ticket.title}</h4>
                  <p>Status: {ticket.status}</p>
                  <p>Priority: {ticket.priority}</p>
                  <p>Due At: {new Date(ticket.due_at).toLocaleString()}</p>
                  {ticket.breached && <span style={{ color: 'red' }}>SLA Breached</span>}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              onPrev={() => { prev(); }}
              onNext={() => { next(); }}
            />
          </>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}
            onClick={() => setSelectedTicket(null)}
          >
            <div
              style={{
                background: '#fff',
                padding: '2rem',
                width: '90%',
                maxWidth: '800px',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '90%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2>{selectedTicket.ticket.title}</h2>
              <p><strong>Description:</strong> {selectedTicket.ticket.description}</p>
              <p><strong>Created By:</strong> {selectedTicket.ticket.requester_id}</p>
              <p><strong>Assignee:</strong> {selectedTicket.ticket.assignee_id || 'Unassigned'}</p>
              <p><strong>Status:</strong> {selectedTicket.ticket.status}</p>
              <p><strong>Priority:</strong> {selectedTicket.ticket.priority}</p>
              <p><strong>Due At:</strong> {new Date(selectedTicket.ticket.due_at).toLocaleString()}</p>
              {selectedTicket.ticket.breached && <span style={{ color: 'red' }}>SLA Breached</span>}

              {/* Update Status */}
              <div style={{ marginTop: '1rem' }}>
                <label>Status: </label>
                <select
                  value={selectedTicket.ticket.status}
                  onChange={e => handleUpdateTicket({ status: e.target.value })}
                  disabled={updating}
                  style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Update Priority */}
              <div style={{ marginTop: '1rem' }}>
                <label>Priority: </label>
                <select
                  value={selectedTicket.ticket.priority}
                  onChange={e => handleUpdateTicket({ priority: e.target.value })}
                  disabled={updating}
                  style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Reassign Ticket */}
              <div style={{ marginTop: '1rem' }}>
                <label>Reassign to: </label>
                <select
                  value={selectedTicket.ticket.assignee_id || ''}
                  onChange={e => handleUpdateTicket({ assignee_id: e.target.value })}
                  disabled={updating}
                  style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name || agent.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comments Section */}
              <div style={{ marginTop: '2rem' }}>
                <h4>Reply</h4>
                {selectedTicket.comments.map(c => (
                  <div
                    key={c.id}
                    style={{ borderBottom: '1px solid #ddd', padding: '0.5rem 0' }}
                  >
                    <p><strong>{c.author_id}:</strong> {c.body}</p>
                    <small>{new Date(c.created_at).toLocaleString()}</small>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ flex: 1, padding: '0.5rem' }}
                  />
                  <button onClick={handlePostComment} disabled={updating} style={{ padding: '0.5rem 1rem' }}>
                    Post
                  </button>
                </div>
              </div>

              {/* Timeline Section */}
              <div style={{ marginTop: '2rem' }}>
                <h4>Timeline</h4>
                {selectedTicket.timeline.map(t => (
                  <div key={t.id} style={{ borderBottom: '1px solid #eee', padding: '0.3rem 0' }}>
                    <p>{t.action} by {t.actor_id} — {new Date(t.created_at).toLocaleString()}</p>
                    <pre style={{ fontSize: '0.8rem' }}>{JSON.stringify(t.metadata)}</pre>
                  </div>
                ))}
              </div>

              <button onClick={() => setSelectedTicket(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
