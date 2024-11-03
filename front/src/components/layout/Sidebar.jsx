// components/layout/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3>Espacios</h3>
          <Link to="/spaces/new">Nuevo Espacio</Link>
          <Link to="/spaces">Ver Todos</Link>
        </div>
        <div className="sidebar-section">
          <h3>Reservas</h3>
          <Link to="/reservations/new">Nueva Reserva</Link>
          <Link to="/reservations">Ver Todas</Link>
        </div>
        <div className="sidebar-section">
          <h3>Miembros</h3>
          <Link to="/members/new">Nuevo Miembro</Link>
          <Link to="/members">Ver Todos</Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;