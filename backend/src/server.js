const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const routes = require('./routes/imoveisRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});