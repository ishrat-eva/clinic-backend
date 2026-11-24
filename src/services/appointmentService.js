const repository = require('../repositories/appointmentRepository');

// CREATE APPOINTMENT
function createAppointment(appointment) {
    if (
        !appointment.slot_id ||
        !appointment.patient_name ||
        !appointment.patient_email
    ) {
        throw new Error('All appointment fields are required');
    }

    const slot = repository.getSlotById(
        Number(appointment.slot_id)
    );

    if (!slot) {
        throw new Error('Slot not found');
    }

    if (slot.status !== 'available') {
        throw new Error('This slot is already booked');
    }

    return repository.createAppointment({
        ...appointment,
        slot_id: Number(appointment.slot_id)
    });
}

// GET ALL APPOINTMENTS
function getAllAppointments() {
    return repository.getAllAppointments();
}

// GET SINGLE APPOINTMENT
function getAppointmentById(id) {
    const appointment = repository.getAppointmentById(id);

    if (!appointment) {
        throw new Error('Appointment not found');
    }

    return appointment;
}

// UPDATE APPOINTMENT
function updateAppointment(id, appointment) {
    const existing = getAppointmentById(id);

    if (existing.status !== 'booked') {
        throw new Error('Cannot update a cancelled appointment');
    }

    if (!appointment.patient_name || !appointment.patient_email) {
        throw new Error('Patient name and email are required');
    }

    repository.updateAppointment(id, appointment);

    return getAppointmentById(id);
}

// CANCEL APPOINTMENT
function cancelAppointment(id) {
    const existing = getAppointmentById(id);

    if (existing.status !== 'booked') {
        throw new Error('Appointment is already cancelled');
    }

    repository.cancelAppointment(id);

    return {
        message: 'Appointment cancelled successfully'
    };
}

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment
};