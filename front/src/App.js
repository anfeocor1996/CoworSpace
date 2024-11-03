import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Members Components
import MemberList from './components/members/MemberList';
import MemberForm from './components/members/MemberForm';

// Reservations Components
import ReservationList from './components/reservations/ReservationList';
import ReservationForm from './components/reservations/ReservationForm';

// Spaces Components
import SpaceList from './components/spaces/SpaceList';
import SpaceForm from './components/spaces/SpaceForm';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content-area">
            <Routes>
              {/* Rutas de Espacios */}
              <Route path="/" element={<SpaceList />} />
              <Route path="/spaces" element={<SpaceList />} />
              <Route path="/spaces/new" element={<SpaceForm />} />
              <Route path="/spaces/edit/:id" element={<SpaceForm />} />

              {/* Rutas de Reservas */}
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/reservations/new" element={<ReservationForm />} />
              <Route path="/reservations/edit/:id" element={<ReservationForm />} />

              {/* Rutas de Miembros */}
              <Route path="/members" element={<MemberList />} />
              <Route path="/members/new" element={<MemberForm />} />
              <Route path="/members/edit/:id" element={<MemberForm />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;