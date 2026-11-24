const express = require('express');
const router = express.Router();

const appointmentService = require('../services/appointmentService');

// CREATE APPOINTMENT
router.post('/', (req, res) => {
    try {
        const appointment =
            appointmentService.createAppointment(req.body);

        res.status(201).json({
            message: 'Appointment booked successfully',
            data: appointment
        });
    } catch (error) {
        const status = error.message.includes('already booked') ||
            error.message.includes('no longer available')
            ? 409
            : 400;

        res.status(status).json({
            message: error.message
        });
    }
});

// GET ALL APPOINTMENTS
router.get('/', (req, res) => {
    try {
        const appointments =
            appointmentService.getAllAppointments();

        res.status(200).json({
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET SINGLE APPOINTMENT
router.get('/:id', (req, res) => {
    try {
        const appointment =
            appointmentService.getAppointmentById(
                Number(req.params.id)
            );

        res.status(200).json({
            data: appointment
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

// UPDATE APPOINTMENT
router.put('/:id', (req, res) => {
    try {
        const appointment =
            appointmentService.updateAppointment(
                Number(req.params.id),
                req.body
            );

        res.status(200).json({
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// CANCEL APPOINTMENT
router.delete('/:id', (req, res) => {
    try {
        const result =
            appointmentService.cancelAppointment(
                Number(req.params.id)
            );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;