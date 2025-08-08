const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database'); // Ensure database connection is established
const MonitoringEngine = require('./core/monitoringEngine');

const authRoutes = require('./routes/authRoutes');
const checkRoutes = require('./routes/checkRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'PulseCheck Backend is running'
    });
});

// tell the app to use the auth routes
app.use('/api/auth', authRoutes);
app.use('/api/checks', checkRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    MonitoringEngine.initialize();
});
