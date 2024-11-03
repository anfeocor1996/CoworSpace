// components/reservations/ReservationCard.jsx
import React from 'react';
import './Reservations.css';

const ReservationCard = ({ reservation, onStatusChange, onEdit, onDelete }) => {
    const getStatusClass = (status) => {
        const statusClasses = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            cancelled: 'status-cancelled',
            completed: 'status-completed'
        };
        return statusClasses[status] || 'status-pending';
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const calculateDuration = () => {
        const start = new Date(reservation.start_time);
        const end = new Date(reservation.end_time);
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="reservation-card">
            <div className="reservation-card-header">
                <div className="reservation-space-info">
                    <h3>{reservation.space_name}</h3>
                    <span className={`status-badge ${getStatusClass(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                </div>
                <div className="reservation-date">
                    {new Date(reservation.start_time).toLocaleDateString()}
                </div>
            </div>
            
            <div className="reservation-card-body">
                <div className="reservation-details">
                    <div className="detail-item">
                        <span className="detail-label">Miembro:</span>
                        <span>{reservation.member_name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Hora inicio:</span>
                        <span>{formatDateTime(reservation.start_time)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Hora fin:</span>
                        <span>{formatDateTime(reservation.end_time)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Duración:</span>
                        <span>{calculateDuration()}</span>
                    </div>
                </div>

                {reservation.resources && reservation.resources.length > 0 && (
                    <div className="reservation-resources">
                        <h4>Recursos reservados:</h4>
                        <div className="resource-tags">
                            {reservation.resources.map((resource, index) => (
                                <span key={index} className="resource-tag">
                                    {resource.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="reservation-card-actions">
                {reservation.status === 'pending' && (
                    <button 
                        onClick={() => onStatusChange(reservation.id, 'confirmed')}
                        className="btn btn-success"
                    >
                        Confirmar
                    </button>
                )}
                {['pending', 'confirmed'].includes(reservation.status) && (
                    <>
                        <button 
                            onClick={() => onEdit(reservation.id)}
                            className="btn btn-warning"
                        >
                            Editar
                        </button>
                        <button 
                            onClick={() => onDelete(reservation.id)}
                            className="btn btn-danger"
                        >
                            Cancelar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReservationCard;