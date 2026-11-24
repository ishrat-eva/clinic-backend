const repository = require('../repositories/slotRepository');

function createSlot(slot) {
    if (!slot.doctor_id || !slot.date ||
        !slot.start_time || !slot.end_time) {
        throw new Error('All slot fields are required');
    }

    if (!repository.doctorExists(slot.doctor_id)) {
        throw new Error('Doctor not found');
    }

    if (slot.end_time <= slot.start_time) {
        throw new Error('End time must be after start time');
    }

    const existingSlots = repository.getAllSlots();

    const conflict = existingSlots.some(existing =>
        existing.doctor_id === Number(slot.doctor_id) &&
        existing.date === slot.date &&
        slot.start_time < existing.end_time &&
        slot.end_time > existing.start_time
    );

    if (conflict) {
        throw new Error('This time slot overlaps with another slot');
    }

    return repository.createSlot(slot);
}

function getAllSlots() {
    return repository.getAllSlots();
}

function getSlotById(id) {
    const slot = repository.getSlotById(id);

    if (!slot) {
        throw new Error('Slot not found');
    }

    return slot;
}

function updateSlot(id, slot) {
    const existing = getSlotById(id);

    if (repository.hasBookedAppointment(id)) {
        throw new Error('Cannot update a booked slot');
    }

    if (!repository.doctorExists(slot.doctor_id)) {
        throw new Error('Doctor not found');
    }

    if (!slot.date || !slot.start_time || !slot.end_time) {
        throw new Error('All slot fields are required');
    }

    if (slot.end_time <= slot.start_time) {
        throw new Error('End time must be after start time');
    }

    const allSlots = repository.getAllSlots();

    const conflict = allSlots.some(other =>
        other.slot_id !== Number(id) &&
        other.doctor_id === Number(slot.doctor_id) &&
        other.date === slot.date &&
        slot.start_time < other.end_time &&
        slot.end_time > other.start_time
    );

    if (conflict) {
        throw new Error('This time slot overlaps with another slot');
    }

    repository.updateSlot(id, slot);

    return getSlotById(id);
}

function deleteSlot(id) {
    getSlotById(id);

    if (repository.hasBookedAppointment(id)) {
        throw new Error('Cannot delete a booked slot');
    }

    repository.deleteSlot(id);

    return { message: 'Slot deleted successfully' };
}

module.exports = {
    createSlot,
    getAllSlots,
    getSlotById,
    updateSlot,
    deleteSlot
};