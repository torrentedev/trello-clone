// backend/models/Section.js
const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: String,
    description: String
});

const SectionSchema = new mongoose.Schema({
    title: String,
    cards: [CardSchema]
});

module.exports = mongoose.model('Section', SectionSchema);
