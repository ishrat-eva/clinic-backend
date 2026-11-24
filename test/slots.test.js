const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database');

describe('Slots API Integration Tests', () => {

    beforeEach(() => {
        db.prepare('DELETE FROM appointments').run();
        db.prepare('DELETE FROM slots').run();
    });

    afterAll(() => {
        db.close();
    });

    // Test 1: Create Slot
    test('Should create a new slot', async () => {
        const response = await request(app)
            .post('/api/slots')
            .send({
                doctor_id: 1,
                date: '2026-12-01',
                start_time: '10:00',
                end_time: '10:30'
            });

        expect(response.status).toBe(201);
        expect(response.body.data.status).toBe('available');
    });

    // Test 2: Get All Slots
    test('Should get all slots', async () => {
        await request(app)
            .post('/api/slots')
            .send({
                doctor_id: 1,
                date: '2026-12-01',
                start_time: '10:00',
                end_time: '10:30'
            });

        const response = await request(app)
            .get('/api/slots');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    // Test 3: Get Single Slot
    test('Should get a slot by ID', async () => {
        const created = await request(app)
            .post('/api/slots')
            .send({
                doctor_id: 1,
                date: '2026-12-01',
                start_time: '10:00',
                end_time: '10:30'
            });

        const id = created.body.data.slot_id;

        const response = await request(app)
            .get(`/api/slots/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.data.slot_id).toBe(id);
    });

    // Test 4: Update Slot
    test('Should update a slot', async () => {
        const created = await request(app)
            .post('/api/slots')
            .send({
                doctor_id: 1,
                date: '2026-12-01',
                start_time: '10:00',
                end_time: '10:30'
            });

        const id = created.body.data.slot_id;

        const response = await request(app)
            .put(`/api/slots/${id}`)
            .send({
                doctor_id: 1,
                date: '2026-12-01',
                start_time: '11:00',
                end_time: '11:30'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.start_time).toBe('11:00');
    });

    // Test 5: Delete Slot
    test('Should delete a slot', async () => {
        const created = await request(app)
            .post('/api/slots')
            .send({
                doctor_id: 1,
                date: '2026-12-01',
                start_time: '10:00',
                end_time: '10:30'
            });

        const id = created.body.data.slot_id;

        const response = await request(app)
            .delete(`/api/slots/${id}`);

        expect(response.status).toBe(200);

        const check = await request(app)
            .get(`/api/slots/${id}`);

        expect(check.status).toBe(404);
    });
test('should reject slot with invalid doctor ID', async () => {
    const response = await request(app)
        .post('/api/slots')
        .send({
            doctor_id: 9999,
            date: '2026-12-01',
            start_time: '10:00',
            end_time: '10:30'
        });

    expect(response.statusCode).toBe(400);
});
test('should reject slot when end time is before start time', async () => {
    const response = await request(app)
        .post('/api/slots')
        .send({
            doctor_id: 1,
            date: '2026-12-01',
            start_time: '11:00',
            end_time: '10:00'
        });

    expect(response.statusCode).toBe(400);
});

test('should reject overlapping slots for the same doctor', async () => {
    await request(app)
        .post('/api/slots')
        .send({
            doctor_id: 1,
            date: '2026-12-01',
            start_time: '10:00',
            end_time: '10:30'
        });

    const response = await request(app)
        .post('/api/slots')
        .send({
            doctor_id: 1,
            date: '2026-12-01',
            start_time: '10:15',
            end_time: '10:45'
        });

    expect(response.statusCode).toBe(400);
});
});