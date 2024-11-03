// components/members/MemberForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Members.css';

const MemberForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [membershipTypes, setMembershipTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        membership_type_id: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchMembershipTypes();
        if (id) {
            fetchMemberData();
        }
    }, [id]);

    const fetchMembershipTypes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/membership-types');
            setMembershipTypes(response.data);
        } catch (error) {
            console.error('Error al cargar tipos de membresía:', error);
        }
    };

    const fetchMemberData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3001/api/members/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error al cargar el miembro:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.membership_type_id) {
            newErrors.membership_type_id = 'El tipo de membresía es requerido';
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
            if (id) {
                await axios.put(`http://localhost:3001/api/members/${id}`, formData);
            } else {
                await axios.post('http://localhost:3001/api/members', formData);
            }
            navigate('/members');
        } catch (error) {
            console.error('Error al guardar:', error);
            setErrors({ submit: 'Error al guardar el miembro' });
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
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="member-form-container">
            <h1>{id ? 'Editar Miembro' : 'Nuevo Miembro'}</h1>
            <form onSubmit={handleSubmit} className="member-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Tipo de Membresía:</label>
                    <select
                        name="membership_type_id"
                        value={formData.membership_type_id}
                        onChange={handleChange}
                        className={`form-control ${errors.membership_type_id ? 'error' : ''}`}
                    >
                        <option value="">Seleccione un tipo de membresía</option>
                        {membershipTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name} - ${type.price}/mes
                            </option>
                        ))}
                    </select>
                    {errors.membership_type_id && (
                        <span className="error-message">{errors.membership_type_id}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Estado:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>

                {errors.submit && (
                    <div className="error-message submit-error">{errors.submit}</div>
                )}

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/members')}
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

export default MemberForm;