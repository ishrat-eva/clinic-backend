const db = require('../database');

function createAppointment(appointment) {
    const create = db.transaction(() => {
        const result = db.prepare(`
            INSERT INTO appointments (
                slot_id,
                patient_name,
                patient_email
            )
            VALUES (?, ?, ?)
        `).run(
            appointment.slot_id,
            appointment.patient_name,
            appointment.patient_email
        );

        const update = db.prepare(`
            UPDATE slots
            SET status = 'booked'
            WHERE slot_id = ?
            AND status = 'available'
        `).run(appointment.slot_id);

        if (update.changes !== 1) {
            throw new Error('Slot is no longer available');
        }

        return getAppointmentById(result.lastInsertRowid);
    });

    return create();
}

function getAllAppointments() {
    return db.prepare(`
        SELECT
            appointments.*,
            slots.date,
            slots.start_time,
            slots.end_time,
            doctors.name AS doctor_name
        FROM appointments
        JOIN slots ON appointments.slot_id = slots.slot_id
        JOIN doctors ON slots.doctor_id = doctors.doctor_id
    `).all();
}

function getAppointmentById(id) {
    return db.prepare(`
        SELECT
            appointments.*,
            slots.date,
            slots.start_time,
            slots.end_time,
            doctors.name AS doctor_name
        FROM appointments
        JOIN slots ON appointments.slot_id = slots.slot_id
        JOIN doctors ON slots.doctor_id = doctors.doctor_id
        WHERE appointments.appointment_id = ?
    `).get(id);
}

function getSlotById(id) {
    return db.prepare(`
        SELECT * FROM slots WHERE slot_id = ?
    `).get(id);
}

function updateAppointment(id, appointment) {
    return db.prepare(`
        UPDATE appointments
        SET patient_name = ?,
            patient_email = ?
        WHERE appointment_id = ?
    `).run(
        appointment.patient_name,
        appointment.patient_email,
        id
    ).changes;
}

function cancelAppointment(id) {
    const appointment = db.prepare(`
        SELECT * FROM appointments
        WHERE appointment_id = ?
    `).get(id);

    if (!appointment) return 0;

    const cancel = db.transaction(() => {
        db.prepare(`
            UPDATE appointments
            SET status = 'cancelled'
            WHERE appointment_id = ?
        `).run(id);

        db.prepare(`
            UPDATE slots
            SET status = 'available'
            WHERE slot_id = ?
        `).run(appointment.slot_id);
    });

    cancel();

    return 1;
}

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    getSlotById,
    updateAppointment,
    cancelAppointment
};