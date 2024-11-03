// components/reservations/ReservationList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReservationCard from './ReservationCard';
import './Reservations.css';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
    const [dateFilter, setDateFilter] = useState('upcoming'); // upcoming, past, all
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/api/reservations');
            setReservations(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las reservas');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea cancelar esta reserva?')) {
            try {
                await axios.delete(`http://localhost:3001/api/reservations/${id}`);
                await fetchReservations();
            } catch (err) {
                setError('Error al cancelar la reserva');
                console.error('Error:', err);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:3001/api/reservations/${id}/status`, {
                status: newStatus
            });
            await fetchReservations();
        } catch (err) {
            setError('Error al actualizar el estado de la reserva');
            console.error('Error:', err);
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        const matchesStatus = filter === 'all' || reservation.status === filter;
        const now = new Date();
        const reservationDate = new Date(reservation.start_time);
        
        let matchesDate = true;
        if (dateFilter === 'upcoming') {
            matchesDate = reservationDate >= now;
        } else if (dateFilter === 'past') {
            matchesDate = reservationDate < now;
        }

        return matchesStatus && matchesDate;
    });

    const sortedReservations = [...filteredReservations].sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
    });

    if (loading) return <div className="loading">Cargando reservas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="reservation-list-container">
            <div className="reservation-list-header">
                <h1>Reservas</h1>
                <div className="reservation-list-actions">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todas las fechas</option>
                        <option value="upcoming">Próximas</option>
                        <option value="past">Pasadas</option>
                    </select>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/reservations/new')}
                    >
                        Nueva Reserva
                    </button>
                </div>
            </div>

            {sortedReservations.length === 0 ? (
                <div className="no-reservations">
                    No se encontraron reservas con los filtros seleccionados.
                </div>
            ) : (
                <div className="reservation-grid">
                    {sortedReservations.map(reservation => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                            onEdit={() => navigate(`/reservations/edit/${reservation.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationList;