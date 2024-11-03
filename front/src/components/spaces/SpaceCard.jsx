// components/spaces/SpaceCard.jsx
import React from 'react';
import './Spaces.css';

const SpaceCard = ({ space, onEdit, onDelete }) => {
    const getSpaceTypeLabel = (type) => {
        const types = {
            office: 'Oficina Privada',
            meeting_room: 'Sala de Reuniones',
            desk: 'Escritorio',
            event_space: 'Espacio para Eventos'
        };
        return types[type] || type;
    };

    return (
        <div className="space-card">
            <div className="space-card-header">
                <h3>{space.name}</h3>
                <span className={`status-badge ${space.is_available ? 'available' : 'occupied'}`}>
                    {space.is_available ? 'Disponible' : 'Ocupado'}
                </span>
            </div>
            
            <div className="space-card-body">
                <p className="space-description">{space.description}</p>
                <div className="space-details">
                    <div className="detail-item">
                        <span className="detail-label">Tipo:</span>
                        <span>{getSpaceTypeLabel(space.type)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Capacidad:</span>
                        <span>{space.max_capacity} personas</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Tarifa:</span>
                        <span>${space.hourly_rate}/hora</span>
                    </div>
                </div>

                {space.resources && space.resources.length > 0 && (
                    <div className="space-resources">
                        <h4>Recursos:</h4>
                        <div className="resource-tags">
                            {space.resources.map((resource, index) => (
                                <span key={index} className="resource-tag">
                                    {resource}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-card-actions">
                <button 
                    onClick={() => onEdit(space.id)}
                    className="btn btn-warning"
                >
                    Editar
                </button>
                <button 
                    onClick={() => onDelete(space.id)}
                    className="btn btn-danger"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default SpaceCard;