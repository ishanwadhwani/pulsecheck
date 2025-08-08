PulseCheck - Backend
This is the backend server for the PulseCheck application. It is a Node.js/Express application responsible for handling API requests, managing user data, running the monitoring engine, and sending notifications.

✨ Features
Secure Authentication: JWT-based user registration and login system.

RESTful API: Full CRUD (Create, Read, Update, Delete) functionality for managing monitors.

Smart Monitoring Engine: A node-cron scheduled task that intelligently checks URLs based on user-defined intervals.

Downtime Alerts: Automatically sends email notifications via Nodemailer when a monitored service goes down.

Detailed Logging: Records the history of every check for uptime analysis.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL

Authentication: JSON Web Tokens (JWT), bcryptjs

Task Scheduling: node-cron

Email Service: Nodemailer

HTTP Client: Axios

🚀 Getting Started
1. Prerequisites
You must have Node.js installed.

You must have PostgreSQL installed and running.

2. Database Setup (The Blueprint)
First, create a new database in PostgreSQL named pulsecheck. Then, run the following SQL script to create all the necessary tables, relationships, and indexes.

-- Enable UUID generation for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- The core "checks" table - what we are monitoring
CREATE TABLE checks (
    check_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    interval_minutes INTEGER NOT NULL DEFAULT 5,
    current_status VARCHAR(20) DEFAULT 'Pending',
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A log of every single check that runs
CREATE TABLE check_logs (
    log_id BIGSERIAL PRIMARY KEY,
    check_id UUID NOT NULL REFERENCES checks(check_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster database queries
CREATE INDEX idx_checks_user_id ON checks(user_id);
CREATE INDEX idx_check_logs_check_id ON check_logs(check_id);

3. Environment Variables
Create a .env file in the root of the pulsecheck-backend directory and add the following variables. Replace the placeholder values with your local configuration.

# PostgreSQL Database Configuration
DB_USER=your_postgres_user
DB_HOST=localhost
DB_DATABASE=pulsecheck
DB_PASSWORD=your_secret_password
DB_PORT=5432

# JWT Secret for signing tokens
JWT_SECRET=a-very-strong-and-long-secret-key-for-jwt

# Server Port
PORT=5002

# Nodemailer / Ethereal Credentials (for email alerts)
# Note: These are placeholders for the mailService.js file
# You should replace them directly in the mailService.js file or update it to use environment variables.

4. Installation & Running
Navigate to the directory: cd pulsecheck-backend

Install dependencies: npm install

Start the development server: npm run dev

The server will be running on http://localhost:5002.
