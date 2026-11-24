const Database = require('better-sqlite3');
const path = require('path');

// Database file location
const dbPath = process.env.DB_FILE ||
    path.join(__dirname, '..', 'clinic.db');

// Create database connection
const db = new Database(dbPath);

// Enable foreign key support
db.pragma('foreign_keys = ON');

// Create doctors table
db.prepare(`
    CREATE TABLE IF NOT EXISTS doctors (
        doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialization TEXT NOT NULL
    )
`).run();

// Create slots table
db.prepare(`
    CREATE TABLE IF NOT EXISTS slots (
        slot_id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT DEFAULT 'available',
        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
    )
`).run();

// Create appointments table
db.prepare(`
    CREATE TABLE IF NOT EXISTS appointments (
        appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        slot_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        patient_email TEXT NOT NULL,
        status TEXT DEFAULT 'booked',
        FOREIGN KEY (slot_id) REFERENCES slots(slot_id)
    )
`).run();

// Prevent duplicate active bookings
db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS
    one_active_appointment_per_slot
    ON appointments(slot_id)
    WHERE status = 'booked'
`);

// Insert sample doctors
const doctors = [
    ['Dr. Rahim Ahmed', 'Cardiology'],
    ['Dr. Sara Khan', 'Dermatology'],
    ['Dr. Tanvir Hasan', 'Neurology'],
    ['Dr. Nusrat Jahan', 'Gynecology'],
    ['Dr. Mahmud Islam', 'Orthopedics'],
    ['Dr. Farhana Akter', 'Pediatrics'],
    ['Dr. Imran Hossain', 'Medicine'],
    ['Dr. Samia Rahman', 'Ophthalmology']
];

const insertDoctor = db.prepare(`
    INSERT INTO doctors (name, specialization)
    VALUES (?, ?)
`);

const doctorExists = db.prepare(`
    SELECT doctor_id FROM doctors WHERE name = ?
`);

for (const doctor of doctors) {
    if (!doctorExists.get(doctor[0])) {
        insertDoctor.run(doctor[0], doctor[1]);
    }
}

console.log('Database connected successfully!');

module.exports = db;