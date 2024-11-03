// components/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">CoWork Space</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/spaces">Espacios</Link>
        <Link to="/reservations">Reservas</Link>
        <Link to="/members">Miembros</Link>
      </div>
    </nav>
  );
};

export default Navbar;