// pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getTickets, createTicket, postComment } from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';

const UserDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'normal' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 12;

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ requester_id: user.id });
      setTickets(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreateTicket = async () => {
    if (!newTicket.title) return alert('Title is required');
    try {
      await createTicket(newTicket);
      setNewTicket({ title: '', description: '', priority: 'normal' });
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert('Failed to create ticket');
    }
  };

  const handleComment = async (ticketId, body) => {
    if (!body) return;
    try {
      await postComment(ticketId, { body });
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    }
  };

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // --- Inline styles ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '220px', background: '#2c3e50', color: '#ecf0f1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', borderRadius: '10px' },
    sidebarLink: { color: '#ecf0f1', textDecoration: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' },
    sidebarLinkHover: { background: '#34495e' },
    main: { flex: 1, padding: '20px', background: '#ecf0f1' },
    headerContainer: { marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    headerTitle: { fontSize: '24px', fontWeight: 'bold' },
    ticketCard: { background: '#fff', padding: '15px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    ticketTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' },
    ticketMeta: { fontSize: '12px', color: '#7f8c8d', marginBottom: '10px' },
    ticketDescription: { marginBottom: '10px' },
    ticketComment: { fontSize: '13px', color: '#34495e', marginBottom: '5px' },
    ticketInput: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #bdc3c7' },
    ticketButton: { padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#3498db', color: '#fff', cursor: 'pointer' },
    breached: { color: 'red', fontWeight: 'bold' },
    pagination: { marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' },
    paginationButton: { padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#3498db', color: '#fff' }
  };

  return (
    <>
      <Header/>
  
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={{ fontSize: '20px', marginBottom: '20px' }}>Menu</div>
        <div style={styles.sidebarLink}>Dashboard</div>
        <div style={styles.sidebarLink}>My Tickets</div>
        <div style={styles.sidebarLink}>New Ticket</div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Page Header */}
        <div style={styles.headerContainer}>
          <div style={styles.headerTitle}>User Dashboard</div>
          <div>Welcome, {user.name}</div>
        </div>

        {/* Create Ticket */}
        <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Create New Ticket</h3>
          <input
            style={styles.ticketInput}
            placeholder="Title"
            value={newTicket.title}
            onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
          />
          <textarea
            style={styles.ticketInput}
            placeholder="Description"
            value={newTicket.description}
            onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
          />
          <select
            style={styles.ticketInput}
            value={newTicket.priority}
            onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button style={styles.ticketButton} onClick={handleCreateTicket}>Submit Ticket</button>
        </div>
        {/* Tickets List */}
        {loading ? (
          <p>Loading tickets...</p>
        ) : (
          <>
            {currentTickets.map(ticket => (
              <div key={ticket.id} style={styles.ticketCard}>
                <div style={styles.ticketTitle}>{ticket.title}</div>
                <div style={styles.ticketMeta}>
                  Status: {ticket.status} | Priority: {ticket.priority} | SLA Breached: {ticket.breached ? <span style={styles.breached}>Yes</span> : 'No'}
                </div>
                <div style={styles.ticketDescription}>{ticket.description}</div>

                {/* Comments */}
                {ticket.comments?.map(c => (
                  <div key={c.id} style={styles.ticketComment}>- {c.body}</div>
                ))}

                {/* Add Comment */}
                <TicketCommentInput ticketId={ticket.id} onComment={handleComment} />
              </div>
            ))}

            {/* Pagination Controls */}
            <div style={styles.pagination}>
              <button style={styles.paginationButton} onClick={goPrev} disabled={currentPage === 1}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button style={styles.paginationButton} onClick={goNext} disabled={currentPage === totalPages}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

// Sub-component for adding comments
const TicketCommentInput = ({ ticketId, onComment }) => {
  const [comment, setComment] = useState('');
  return (
    <div style={{ marginTop: '10px' }}>
      <input
        style={{ width: '80%', padding: '6px', borderRadius: '5px', border: '1px solid #bdc3c7' }}
        placeholder="Add a comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button
        style={{ padding: '6px 10px', marginLeft: '5px', borderRadius: '5px', border: 'none', background: '#2ecc71', color: '#fff', cursor: 'pointer' }}
        onClick={() => { onComment(ticketId, comment); setComment(''); }}
      >
        Comment
      </button>
    </div>
  );
};

export default UserDashboard;
