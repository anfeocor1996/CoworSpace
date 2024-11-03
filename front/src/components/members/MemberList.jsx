// components/members/MemberList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MemberCard from './MemberCard';
import './Members.css';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, inactive
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/api/members');
            setMembers(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los miembros');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este miembro?')) {
            try {
                await axios.delete(`http://localhost:3001/api/members/${id}`);
                await fetchMembers();
            } catch (err) {
                setError('Error al eliminar el miembro');
                console.error('Error:', err);
            }
        }
    };

    const filteredMembers = members.filter(member => {
        const matchesFilter = filter === 'all' || member.status === filter;
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div className="loading">Cargando miembros...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="member-list-container">
            <div className="member-list-header">
                <h1>Miembros</h1>
                <div className="member-list-actions">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar miembros..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los miembros</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/members/new')}
                    >
                        Nuevo Miembro
                    </button>
                </div>
            </div>

            {filteredMembers.length === 0 ? (
                <div className="no-members">
                    No se encontraron miembros con los filtros seleccionados.
                </div>
            ) : (
                <div className="member-grid">
                    {filteredMembers.map(member => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            onDelete={handleDelete}
                            onEdit={() => navigate(`/members/edit/${member.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemberList;