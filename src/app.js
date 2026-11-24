require('./database');

const express = require('express');

const slotRoutes = require('./routes/slotRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Clinic Backend is running!'
    });
});

// Slots API
app.use('/api/slots', slotRoutes);

// Appointments API
app.use('/api/appointments', appointmentRoutes);

module.exports = app;