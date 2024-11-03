// components/reservations/ReservationForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Reservations.css';

const ReservationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [spaces, setSpaces] = useState([]);
    const [members, setMembers] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    const [formData, setFormData] = useState({
        member_id: '',
        space_id: '',
        start_time: new Date(),
        end_time: new Date(),
        status: 'pending'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchInitialData();
        if (id) {
            fetchReservationData();
        }
    }, [id]);

    const fetchInitialData = async () => {
        try {
            const [spacesRes, membersRes, resourcesRes] = await Promise.all([
                axios.get('http://localhost:3001/api/spaces'),
                axios.get('http://localhost:3001/api/members'),
                axios.get('http://localhost:3001/api/resources')
            ]);
            setSpaces(spacesRes.data);
            setMembers(membersRes.data);
            setResources(resourcesRes.data);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    };

    const fetchReservationData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3001/api/reservations/${id}`);
            const reservation = response.data;
            setFormData({
                ...reservation,
                start_time: new Date(reservation.start_time),
                end_time: new Date(reservation.end_time)
            });
            setSelectedResources(reservation.resources || []);
        } catch (error) {
            console.error('Error al cargar la reserva:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.member_id) newErrors.member_id = 'Seleccione un miembro';
        if (!formData.space_id) newErrors.space_id = 'Seleccione un espacio';
        if (!formData.start_time) newErrors.start_time = 'Seleccione fecha de inicio';
        if (!formData.end_time) newErrors.end_time = 'Seleccione fecha de fin';
        if (formData.start_time >= formData.end_time) {
            newErrors.end_time = 'La fecha de fin debe ser posterior a la de inicio';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const reservationData = {
                ...formData,
                resources: selectedResources
            };

            if (id) {
                await axios.put(`http://localhost:3001/api/reservations/${id}`, reservationData);
            } else {
                await axios.post('http://localhost:3001/api/reservations', reservationData);
            }
            navigate('/reservations');
        } catch (error) {
            console.error('Error al guardar la reserva:', error);
            setErrors({ submit: 'Error al guardar la reserva' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleResourceToggle = (resourceId) => {
        setSelectedResources(prev => 
            prev.includes(resourceId)
                ? prev.filter(id => id !== resourceId)
                : [...prev, resourceId]
        );
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="reservation-form-container">
            <h1>{id ? 'Editar Reserva' : 'Nueva Reserva'}</h1>
            <form onSubmit={handleSubmit} className="reservation-form">
                <div className="form-group">
                    <label>Miembro:</label>
                    <select
                        name="member_id"
                        value={formData.member_id}
                        onChange={handleChange}
                        className={`form-control ${errors.member_id ? 'error' : ''}`}
                    >
                        <option value="">Seleccione un miembro</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                    {errors.member_id && <span className="error-message">{errors.member_id}</span>}
                </div>

                <div className="form-group">
                    <label>Espacio:</label>
                    <select
                        name="space_id"
                        value={formData.space_id}
                        onChange={handleChange}
                        className={`form-control ${errors.space_id ? 'error' : ''}`}
                    >
                        <option value="">Seleccione un espacio</option>
                        {spaces.map(space => (
                            <option key={space.id} value={space.id}>
                                {space.name} - Capacidad: {space.max_capacity}
                            </option>
                        ))}
                    </select>
                    {errors.space_id && <span className="error-message">{errors.space_id}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Fecha y hora de inicio:</label>
                        <DatePicker
                            selected={formData.start_time}
                            onChange={date => setFormData(prev => ({ ...prev, start_time: date }))}
                            showTimeSelect
                            dateFormat="Pp"
                            className={`form-control ${errors.start_time ? 'error' : ''}`}
                            minDate={new Date()}
                        />
                        {errors.start_time && <span className="error-message">{errors.start_time}</span>}
                    </div>

                    <div className="form-group">
                        <label>Fecha y hora de fin:</label>
                        <DatePicker
                            selected={formData.end_time}
                            onChange={date => setFormData(prev => ({ ...prev, end_time: date }))}
                            showTimeSelect
                            dateFormat="Pp"
                            className={`form-control ${errors.end_time ? 'error' : ''}`}
                            minDate={formData.start_time}
                        />
                        {errors.end_time && <span className="error-message">{errors.end_time}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Recursos adicionales:</label>
                    <div className="resources-grid">
                        {resources.map(resource => (
                            <label key={resource.id} className="resource-item">
                                <input
                                    type="checkbox"
                                    checked={selectedResources.includes(resource.id)}
                                    onChange={() => handleResourceToggle(resource.id)}
                                />
                                {resource.name}
                            </label>
                        ))}
                    </div>
                </div>

                {errors.submit && (
                    <div className="error-message submit-error">{errors.submit}</div>
                )}

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/reservations')}
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

export default ReservationForm;