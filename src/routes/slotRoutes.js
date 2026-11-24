const express = require('express');
const router = express.Router();

const slotService = require('../services/slotService');

// CREATE SLOT
router.post('/', (req, res) => {
    try {
        const slot = slotService.createSlot(req.body);

        res.status(201).json({
            message: 'Slot created successfully',
            data: slot
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET ALL SLOTS
router.get('/', (req, res) => {
    try {
        const slots = slotService.getAllSlots();

        res.status(200).json({
            data: slots
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET SINGLE SLOT
router.get('/:id', (req, res) => {
    try {
        const slot = slotService.getSlotById(Number(req.params.id));

        res.status(200).json({
            data: slot
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

// UPDATE SLOT
router.put('/:id', (req, res) => {
    try {
        const slot = slotService.updateSlot(
            Number(req.params.id),
            req.body
        );

        res.status(200).json({
            message: 'Slot updated successfully',
            data: slot
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE SLOT
router.delete('/:id', (req, res) => {
    try {
        const result = slotService.deleteSlot(Number(req.params.id));

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;