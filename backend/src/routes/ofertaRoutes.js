// backend/src/routes/ofertaRoutes.js
// Defines the API routes for offers
const express = require('express');
const ofertaController = require('../controllers/ofertaController'); // Import controller functions

const router = express.Router();

// Route to get all offers
// GET /api/ofertas
router.get('/', ofertaController.getAllOfertas);

// Route to toggle the favorite status of an offer by its primary key 'id'
// PATCH /api/ofertas/:id/favorito
router.patch('/:id/favorito', ofertaController.toggleFavorito);

module.exports = router; // Export the router to be used in server.js