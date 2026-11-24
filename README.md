
# Clinic Management System - Backend

## Project Overview

This project is a backend application for a Clinic Management System.

It provides two main features:
1. Slots Management
2. Appointments Management

## Technologies Used

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Jest
- Supertest
- Postman

## Features

### Slots Management
- Create a slot
- View all slots
- View a single slot
- Update a slot
- Delete a slot

### Appointments Management
- Book an appointment
- View all appointments
- View a single appointment
- Update patient information
- Cancel an appointment

## Installation

Clone the repository:

```bash
git clone https://github.com/ishrat-eva/clinic-backend.git
```

Go to the project directory:

```bash
cd clinic-backend
```

Install dependencies:

```bash
npm install
```

## Run the Server

```bash
npm run dev
```

Server URL:

http://localhost:3000

## Run Tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/slots | Create slot |
| GET | /api/slots | Get all slots |
| GET | /api/slots/:id | Get single slot |
| PUT | /api/slots/:id | Update slot |
| DELETE | /api/slots/:id | Delete slot |
| POST | /api/appointments | Book appointment |
| GET | /api/appointments | Get all appointments |
| GET | /api/appointments/:id | Get single appointment |
| PUT | /api/appointments/:id | Update appointment |
| DELETE | /api/appointments/:id | Cancel appointment |

## Testing

Integration tests are written using Jest and Supertest.

The test suite covers CRUD operations and edge cases.
