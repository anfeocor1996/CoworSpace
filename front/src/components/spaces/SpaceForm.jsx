// components/spaces/SpaceForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Spaces.css';

const SpaceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        max_capacity: '',
        hourly_rate: '',
        is_available: true,
        resources: []
    });

    useEffect(() => {
        fetchResources();
        if (id) {
            fetchSpaceData();
        }
    }, [id]);

    const fetchResources = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/resources');
            setResources(response.data);
        } catch (error) {
            console.error('Error al cargar recursos:', error);
        }
    };

    const fetchSpaceData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3001/api/spaces/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error al cargar el espacio:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (id) {
                await axios.put(`http://localhost:3001/api/spaces/${id}`, formData);
            } else {
                await axios.post('http://localhost:3001/api/spaces', formData);
            }
            navigate('/spaces');
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleResourceChange = (resourceId) => {
        const updatedResources = formData.resources.includes(resourceId)
            ? formData.resources.filter(id => id !== resourceId)
            : [...formData.resources, resourceId];
        
        setFormData(prev => ({
            ...prev,
            resources: updatedResources
        }));
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="space-form-container">
            <h1>{id ? 'Editar Espacio' : 'Nuevo Espacio'}</h1>
            <form onSubmit={handleSubmit} className="space-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Tipo:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="office">Oficina Privada</option>
                        <option value="meeting_room">Sala de Reuniones</option>
                        <option value="desk">Escritorio</option>
                        <option value="event_space">Espacio para Eventos</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Capacidad Máxima:</label>
                    <input
                        type="number"
                        name="max_capacity"
                        value={formData.max_capacity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Tarifa por Hora:</label>
                    <input
                        type="number"
                        name="hourly_rate"
                        value={formData.hourly_rate}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="is_available"
                            checked={formData.is_available}
                            onChange={handleChange}
                        />
                        Disponible
                    </label>
                </div>

                <div className="form-group">
                    <label>Recursos Disponibles:</label>
                    <div className="resources-grid">
                        {resources.map(resource => (
                            <label key={resource.id} className="resource-item">
                                <input
                                    type="checkbox"
                                    checked={formData.resources.includes(resource.id)}
                                    onChange={() => handleResourceChange(resource.id)}
                                />
                                {resource.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/spaces')}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SpaceForm;