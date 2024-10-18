// backend/routes/sections.js
const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// Obtener todas las secciones
router.get('/', async (req, res) => {
    try {
        const sections = await Section.find();
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear una nueva sección
router.post('/', async (req, res) => {
    const section = new Section({
        title: req.body.title,
        cards: req.body.cards || []
    });

    try {
        const newSection = await section.save();
        res.status(201).json(newSection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Agregar una card a una sección
router.post('/:id/cards', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (section == null) {
            return res.status(404).json({ message: 'Section not found' });
        }
        const card = { title: req.body.title, description: req.body.description };
        section.cards.push(card);
        await section.save();
        res.status(201).json(section);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
