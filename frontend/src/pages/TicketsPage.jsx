import React, { useEffect, useState } from 'react';
import { getTickets } from '../services/ticketService';
import TicketCard from '../components/TicketCard';
import { usePagination } from '../hooks/usePagination';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { limit, offset, next, prev } = usePagination();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ limit, offset, search });
      setTickets(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [limit, offset, search]);

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '1rem',
    },
    heading: {
      fontSize: '1.8rem',
      marginBottom: '1rem',
      color: '#2c3e50',
    },
    searchInput: {
      width: '100%',
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      outline: 'none',
      marginBottom: '1rem',
      transition: 'border-color 0.2s ease',
    },
    ticketList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    pageButton: {
      padding: '0.6rem 1.2rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#3498db',
      color: '#fff',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tickets</h2>
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.searchInput}
        onFocus={e => (e.currentTarget.style.borderColor = '#3498db')}
        onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
      />
      {loading ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Loading...</p>
      ) : (
        <div style={styles.ticketList}>
          {tickets.map(t => <TicketCard key={t.id} ticket={t} />)}
        </div>
      )}
      <div style={styles.pagination}>
        <button style={styles.pageButton} onClick={prev}>Prev</button>
        <button style={styles.pageButton} onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default TicketsPage;
