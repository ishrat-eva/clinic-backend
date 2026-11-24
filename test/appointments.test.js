const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database');

describe('Appointments API Integration Tests', () => {

    let slotId;

    beforeEach(() => {
        db.prepare('DELETE FROM appointments').run();
        db.prepare('DELETE FROM slots').run();

        const result = db.prepare(`
            INSERT INTO slots (
                doctor_id,
                date,
                start_time,
                end_time,
                status
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            1,
            '2026-12-01',
            '10:00',
            '10:30',
            'available'
        );

        slotId = result.lastInsertRowid;
    });

    afterAll(() => {
        db.close();
    });

    // Test 1: Book Appointment
    test('Should book an appointment', async () => {
        const response = await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Eva',
                patient_email: 'eva@gmail.com'
            });

        expect(response.status).toBe(201);
        expect(response.body.data.status).toBe('booked');
    });

    // Test 2: Get All Appointments
    test('Should get all appointments', async () => {
        await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Eva',
                patient_email: 'eva@gmail.com'
            });

        const response = await request(app)
            .get('/api/appointments');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    // Test 3: Get Single Appointment
    test('Should get appointment by ID', async () => {
        const created = await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Eva',
                patient_email: 'eva@gmail.com'
            });

        const id = created.body.data.appointment_id;

        const response = await request(app)
            .get(`/api/appointments/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.data.appointment_id).toBe(id);
    });

    // Test 4: Update Appointment
    test('Should update patient information', async () => {
        const created = await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Eva',
                patient_email: 'eva@gmail.com'
            });

        const id = created.body.data.appointment_id;

        const response = await request(app)
            .put(`/api/appointments/${id}`)
            .send({
                patient_name: 'Eva Rahman',
                patient_email: 'eva.rahman@gmail.com'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.patient_name).toBe('Eva Rahman');
    });

    // Test 5: Cancel Appointment
    test('Should cancel appointment and release slot', async () => {
        const created = await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Eva',
                patient_email: 'eva@gmail.com'
            });

        const id = created.body.data.appointment_id;

        const response = await request(app)
            .delete(`/api/appointments/${id}`);

        expect(response.status).toBe(200);

        const slot = await request(app)
            .get(`/api/slots/${slotId}`);

        expect(slot.body.data.status).toBe('available');
    });

    // Test 6: Prevent Duplicate Booking
    test('Should not allow booking an already booked slot', async () => {
        await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Eva',
                patient_email: 'eva@gmail.com'
            });

        const response = await request(app)
            .post('/api/appointments')
            .send({
                slot_id: slotId,
                patient_name: 'Sara',
                patient_email: 'sara@gmail.com'
            });

        expect(response.status).toBe(409);
    });

    test('should reject appointment with invalid slot ID', async () => {
    const response = await request(app)
        .post('/api/appointments')
        .send({
            slot_id: 9999,
            patient_name: 'Eva',
            patient_email: 'eva@gmail.com'
        });

    expect(response.statusCode).toBe(400);
});

test('should reject appointment without patient name', async () => {
    const response = await request(app)
        .post('/api/appointments')
        .send({
            slot_id: slotId,
            patient_name: '',
            patient_email: 'eva@gmail.com'
        });

    expect(response.statusCode).toBe(400);
});

test('should reject appointment without email', async () => {
    const response = await request(app)
        .post('/api/appointments')
        .send({
            slot_id: slotId,
            patient_name: 'Eva',
            patient_email: ''
        });

    expect(response.statusCode).toBe(400);
});

test('should reject booking an already booked slot', async () => {
    await request(app)
        .post('/api/appointments')
        .send({
            slot_id: slotId,
            patient_name: 'Eva',
            patient_email: 'eva@gmail.com'
        });

    const response = await request(app)
        .post('/api/appointments')
        .send({
            slot_id: slotId,
            patient_name: 'Rahim',
            patient_email: 'rahim@gmail.com'
        });

    expect(response.statusCode).toBe(409);
});

});