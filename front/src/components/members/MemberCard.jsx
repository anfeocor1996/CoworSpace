// components/members/MemberCard.jsx
import React from 'react';
import './Members.css';

const MemberCard = ({ member, onEdit, onDelete }) => {
    const getStatusColor = (status) => {
        return status === 'active' ? 'status-active' : 'status-inactive';
    };

    return (
        <div className="member-card">
            <div className="member-card-header">
                <h3>{member.name}</h3>
                <span className={`status-badge ${getStatusColor(member.status)}`}>
                    {member.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
            </div>
            
            <div className="member-card-body">
                <div className="member-details">
                    <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span>{member.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Teléfono:</span>
                        <span>{member.phone || 'No especificado'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Membresía:</span>
                        <span>{member.membership_type}</span>
                    </div>
                </div>

                {member.last_access && (
                    <div className="member-activity">
                        <span className="activity-label">Último acceso:</span>
                        <span>{new Date(member.last_access).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            <div className="member-card-actions">
                <button 
                    onClick={() => onEdit(member.id)}
                    className="btn btn-warning"
                >
                    Editar
                </button>
                <button 
                    onClick={() => onDelete(member.id)}
                    className="btn btn-danger"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default MemberCard;