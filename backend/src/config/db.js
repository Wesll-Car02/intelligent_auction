// backend/src/config/db.js
// Database connection configuration
const mysql = require('mysql2/promise'); // Using promise-based version
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Database host (from .env or default)
    user: process.env.DB_USER || 'root',      // Database user (from .env or default)
    password: process.env.DB_PASSWORD || 'root',  // Database password (from .env or default)
    database: process.env.DB_NAME || 'dbleilao', // Database name (from .env or default)
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0
});

// Test the connection (optional)
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the MariaDB database.');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to the MariaDB database:', err);
        // Exit process if DB connection fails on startup? Or handle differently?
        // process.exit(1);
    });

module.exports = pool; // Export the pool for use in controllers