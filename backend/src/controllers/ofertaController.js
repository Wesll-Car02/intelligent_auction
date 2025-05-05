// backend/src/controllers/ofertaController.js
// Controller functions for handling offer-related requests
const db = require('../config/db'); // Import the database connection pool

// Get all offers
exports.getAllOfertas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ofertasleiloesimoveis ORDER BY datacriacao DESC');
        res.status(200).json(rows); // Send the fetched rows as JSON response
    } catch (error) {
        console.error('Error fetching ofertas:', error);
        res.status(500).json({ message: 'Erro ao buscar ofertas no banco de dados.', error: error.message });
    }
};

// Toggle favorite status for an offer
exports.toggleFavorito = async (req, res) => {
    const { id } = req.params; // Get the offer ID from the request parameters

    if (!id) {
        return res.status(400).json({ message: 'ID da oferta é obrigatório.' });
    }

    try {
        // 1. Get the current favorite status
        const [rows] = await db.query('SELECT favorito FROM ofertasleiloesimoveis WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Oferta não encontrada.' });
        }

        const currentStatus = rows[0].favorito;
        const newStatus = currentStatus === 0 ? 1 : 0; // Toggle the status (0 -> 1, 1 -> 0)

        // 2. Update the favorite status in the database
        const [result] = await db.query(
            'UPDATE ofertasleiloesimoveis SET favorito = ? WHERE id = ?',
            [newStatus, id]
        );

        if (result.affectedRows === 0) {
            // This case should ideally not happen if the previous select worked, but good to check
            return res.status(404).json({ message: 'Oferta não encontrada para atualização.' });
        }

        console.log(`Oferta ID ${id} favorito status changed to ${newStatus}`);
        // Send back the updated status and ID
        res.status(200).json({ id: parseInt(id, 10), favorito: newStatus });

    } catch (error) {
        console.error(`Error toggling favorito for oferta ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao atualizar o status de favorito.', error: error.message });
    }
};