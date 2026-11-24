const path = require('path');

process.env.DB_FILE = path.join(
    __dirname,
    'clinic.test.db'
);