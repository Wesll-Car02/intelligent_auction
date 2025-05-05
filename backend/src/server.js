// backend/src/server.js
// Main server setup file
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ofertaRoutes = require('./routes/ofertaRoutes'); // Import the routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.BACKEND_PORT || 3001; // Define the port from .env or default to 3001

// --- Middleware ---
// Enable CORS for all origins (adjust for production later if needed)
app.use(cors());
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Mount the offer routes under the /api/ofertas path
app.use('/api/ofertas', ofertaRoutes);

// --- Basic Root Route ---
app.get('/', (req, res) => {
    res.send('Backend do Leilão de Imóveis está rodando!');
});

// --- Global Error Handler (Basic Example) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
