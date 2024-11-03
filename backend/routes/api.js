// backend/routes/api.js
const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Rutas para Espacios
router.get('/spaces', async (req, res) => {
    try {
        const spaces = await db.all('SELECT * FROM spaces');
        res.json(spaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/spaces', async (req, res) => {
    const { name, description, type, maxCapacity, hourlyRate } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO spaces (name, description, type, max_capacity, hourly_rate) VALUES (?, ?, ?, ?, ?)',
            [name, description, type, maxCapacity, hourlyRate]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas para Miembros
router.get('/members', async (req, res) => {
    try {
        const members = await db.all('SELECT * FROM members');
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/members', async (req, res) => {
    const { name, email, phone, membershipTypeId } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO members (name, email, phone, membership_type_id) VALUES (?, ?, ?, ?)',
            [name, email, phone, membershipTypeId]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas para Reservas
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await db.all(`
            SELECT r.*, m.name as member_name, s.name as space_name 
            FROM reservations r
            JOIN members m ON r.member_id = m.id
            JOIN spaces s ON r.space_id = s.id
        `);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reservations', async (req, res) => {
    const { memberId, spaceId, startTime, endTime } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO reservations (member_id, space_id, start_time, end_time) VALUES (?, ?, ?, ?)',
            [memberId, spaceId, startTime, endTime]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas para Eventos
router.get('/events', async (req, res) => {
    try {
        const events = await db.all('SELECT * FROM events');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/events', async (req, res) => {
    const { name, description, spaceId, startTime, endTime, maxParticipants } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO events (name, description, space_id, start_time, end_time, max_participants) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, spaceId, startTime, endTime, maxParticipants]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;