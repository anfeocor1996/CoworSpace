// components/spaces/SpaceList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SpaceCard from './SpaceCard';
import './Spaces.css';

const SpaceList = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, available, occupied
    const navigate = useNavigate();

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/api/spaces');
            setSpaces(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los espacios');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este espacio?')) {
            try {
                await axios.delete(`http://localhost:3001/api/spaces/${id}`);
                await fetchSpaces();
            } catch (err) {
                setError('Error al eliminar el espacio');
                console.error('Error:', err);
            }
        }
    };

    const filteredSpaces = spaces.filter(space => {
        if (filter === 'available') return space.is_available;
        if (filter === 'occupied') return !space.is_available;
        return true;
    });

    if (loading) return <div className="loading">Cargando espacios...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="space-list-container">
            <div className="space-list-header">
                <h1>Espacios de Trabajo</h1>
                <div className="space-list-actions">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los espacios</option>
                        <option value="available">Disponibles</option>
                        <option value="occupied">Ocupados</option>
                    </select>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/spaces/new')}
                    >
                        Nuevo Espacio
                    </button>
                </div>
            </div>

            {filteredSpaces.length === 0 ? (
                <div className="no-spaces">
                    No hay espacios disponibles con los filtros seleccionados.
                </div>
            ) : (
                <div className="space-grid">
                    {filteredSpaces.map(space => (
                        <SpaceCard
                            key={space.id}
                            space={space}
                            onDelete={handleDelete}
                            onEdit={() => navigate(`/spaces/edit/${space.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SpaceList;