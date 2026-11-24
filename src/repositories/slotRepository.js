const db = require('../database');

function createSlot(slot) {
    const statement = db.prepare(`
        INSERT INTO slots (
            doctor_id, date, start_time, end_time
        )
        VALUES (?, ?, ?, ?)
    `);

    const result = statement.run(
        slot.doctor_id,
        slot.date,
        slot.start_time,
        slot.end_time
    );

    return getSlotById(result.lastInsertRowid);
}

function getAllSlots() {
    return db.prepare(`
        SELECT * FROM slots
    `).all();
}

function getSlotById(id) {
    return db.prepare(`
        SELECT * FROM slots WHERE slot_id = ?
    `).get(id);
}

function updateSlot(id, slot) {
    const result = db.prepare(`
        UPDATE slots
        SET doctor_id = ?,
            date = ?,
            start_time = ?,
            end_time = ?
        WHERE slot_id = ?
    `).run(
        slot.doctor_id,
        slot.date,
        slot.start_time,
        slot.end_time,
        id
    );

    return result.changes;
}

function deleteSlot(id) {
    const result = db.prepare(`
        DELETE FROM slots WHERE slot_id = ?
    `).run(id);

    return result.changes;
}

// Check whether doctor exists
function doctorExists(id) {
    return db.prepare(`
        SELECT doctor_id FROM doctors
        WHERE doctor_id = ?
    `).get(id);
}

// Check whether slot has an active appointment
function hasBookedAppointment(slotId) {
    return db.prepare(`
        SELECT appointment_id
        FROM appointments
        WHERE slot_id = ? AND status = 'booked'
    `).get(slotId);
}

// Export all functions
module.exports = {
    createSlot,
    getAllSlots,
    getSlotById,
    updateSlot,
    deleteSlot,
    doctorExists,
    hasBookedAppointment
};