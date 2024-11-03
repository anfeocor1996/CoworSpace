// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Configuración global de axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para manejar errores
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

// Funciones auxiliares para manejo de respuestas y errores
const handleResponse = async (promise) => {
    try {
        const response = await promise;
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const api = {
    // Espacios
    spaces: {
        getAll: () => 
            handleResponse(axios.get('/spaces')),
        
        getById: (id) => 
            handleResponse(axios.get(`/spaces/${id}`)),
        
        create: (spaceData) => 
            handleResponse(axios.post('/spaces', spaceData)),
        
        update: (id, spaceData) => 
            handleResponse(axios.put(`/spaces/${id}`, spaceData)),
        
        delete: (id) => 
            handleResponse(axios.delete(`/spaces/${id}`)),
        
        getAvailable: (date) =>
            handleResponse(axios.get(`/spaces/available`, { params: { date } }))
    },

    // Reservas
    reservations: {
        getAll: () => 
            handleResponse(axios.get('/reservations')),
        
        getById: (id) => 
            handleResponse(axios.get(`/reservations/${id}`)),
        
        create: (reservationData) => 
            handleResponse(axios.post('/reservations', reservationData)),
        
        update: (id, reservationData) => 
            handleResponse(axios.put(`/reservations/${id}`, reservationData)),
        
        delete: (id) => 
            handleResponse(axios.delete(`/reservations/${id}`)),
        
        getByMember: (memberId) =>
            handleResponse(axios.get(`/reservations/member/${memberId}`)),
        
        checkAvailability: (spaceId, startTime, endTime) =>
            handleResponse(axios.get('/reservations/check-availability', {
                params: { spaceId, startTime, endTime }
            }))
    },

    // Eventos
    events: {
        getAll: () => 
            handleResponse(axios.get('/events')),
        
        getById: (id) => 
            handleResponse(axios.get(`/events/${id}`)),
        
        create: (eventData) => 
            handleResponse(axios.post('/events', eventData)),
        
        update: (id, eventData) => 
            handleResponse(axios.put(`/events/${id}`, eventData)),
        
        delete: (id) => 
            handleResponse(axios.delete(`/events/${id}`)),
        
        register: (eventId, memberId) =>
            handleResponse(axios.post(`/events/${eventId}/register`, { memberId })),
        
        cancelRegistration: (eventId, memberId) =>
            handleResponse(axios.delete(`/events/${eventId}/register/${memberId}`)),
        
        getParticipants: (eventId) =>
            handleResponse(axios.get(`/events/${eventId}/participants`))
    },

    // Miembros
    members: {
        getAll: () => 
            handleResponse(axios.get('/members')),
        
        getById: (id) => 
            handleResponse(axios.get(`/members/${id}`)),
        
        create: (memberData) => 
            handleResponse(axios.post('/members', memberData)),
        
        update: (id, memberData) => 
            handleResponse(axios.put(`/members/${id}`, memberData)),
        
        delete: (id) => 
            handleResponse(axios.delete(`/members/${id}`)),
        
        updateMembership: (id, membershipTypeId) =>
            handleResponse(axios.put(`/members/${id}/membership`, { membershipTypeId }))
    },

    // Recursos
    resources: {
        getAll: () => 
            handleResponse(axios.get('/resources')),
        
        getById: (id) => 
            handleResponse(axios.get(`/resources/${id}`)),
        
        create: (resourceData) => 
            handleResponse(axios.post('/resources', resourceData)),
        
        update: (id, resourceData) => 
            handleResponse(axios.put(`/resources/${id}`, resourceData)),
        
        delete: (id) => 
            handleResponse(axios.delete(`/resources/${id}`)),
        
        getBySpace: (spaceId) =>
            handleResponse(axios.get(`/resources/space/${spaceId}`))
    },

    // Membresías
    memberships: {
        getAll: () => 
            handleResponse(axios.get('/membership-types')),
        
        getById: (id) => 
            handleResponse(axios.get(`/membership-types/${id}`)),
        
        create: (membershipData) => 
            handleResponse(axios.post('/membership-types', membershipData)),
        
        update: (id, membershipData) => 
            handleResponse(axios.put(`/membership-types/${id}`, membershipData)),
        
        delete: (id) => 
            handleResponse(axios.delete(`/membership-types/${id}`))
    }
};

export default api;