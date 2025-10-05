import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [collapsed, setCollapsed] = useState(true);

  const baseLinks = [
    
    { path: '/tickets/new', label: 'New Ticket' },
  ];

  const agentLinks = [
    { path: '/agent/dashboard', label: 'Dashboard' },
    ...baseLinks,
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
   
    { path: '/tickets/new', label: 'Create Ticket' },
    
  ];

  let links = baseLinks;
  if (user?.role === 'agent') links = agentLinks;
  if (user?.role === 'admin') links = adminLinks;

  const styles = {
    sidebar: {
      width: collapsed ? '0' : '200px',
      backgroundColor: '#34495e',
      color: '#fff',
      minHeight: '100vh',
      padding: collapsed ? '0' : '2rem 1rem',
      position: 'fixed',
      top: '110px',
      left: 0,
      display: 'flex',
      borderRadius: '10px 8px 8px 0',
      flexDirection: 'column',
      gap: '5rem',
      transition: 'width 0.3s ease, padding 0.3s ease',
      overflowX: 'hidden',
      zIndex: 1000,
    },
    toggleButton: {
      position: 'fixed',
      top: '110px',
      left: collapsed ? '0' : '200px',
      zIndex: 1100,
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0 8px 8px 0',
      cursor: 'pointer',
      backgroundColor: '#1abc9c',
      color: '#fff',
      fontWeight: '600',
      transition: 'left 0.3s ease',
    },
    list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3.5rem' },
    item: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      color: '#ecf0f1',
      fontWeight: '500',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    hoverItem: { backgroundColor: '#2c3e50', color: '#1abc9c', transform: 'scale(1.03)' },
    activeItem: { backgroundColor: '#1abc9c', color: '#fff', fontWeight: '600' },
  };

  return (
    <>
      <button style={styles.toggleButton} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '☰' : '✕'}
      </button>
      <aside style={styles.sidebar}>
        <ul style={styles.list}>
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                style={{
                  ...styles.item,
                  ...(hovered === index ? styles.hoverItem : {}),
                  ...(location.pathname === link.path ? styles.activeItem : {}),
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
