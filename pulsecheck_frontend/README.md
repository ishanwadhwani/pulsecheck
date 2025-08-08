# PulseCheck - Uptime Monitoring SaaS

PulseCheck is a simple and reliable uptime monitoring service built with the MERN stack (Next.js instead of React). It allows users to monitor their websites and APIs, receiving instant email alerts when a service goes down.

## ✨ Features

-   Secure user registration and JWT-based authentication.
-   CRUD functionality for managing monitors (Create, Read, Update, Delete).
-   A 24/7 background engine that intelligently checks services based on user-defined intervals.
-   Real-time dashboard updates using polling.
-   Email notifications for downtime alerts via Nodemailer.

## 🛠️ Tech Stack

-   **Frontend:** Next.js, React, Tailwind CSS
-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL
-   **Authentication:** JSON Web Tokens (JWT), bcryptjs
-   **Task Scheduling:** node-cron
-   **Email:** Nodemailer

## 🚀 Getting Started

### Prerequisites

-   Node.js
-   PostgreSQL

### Backend Setup

1.  Navigate to the `pulsecheck-backend` directory.
2.  Run `npm install`.
3.  Create a `.env` file and add your PostgreSQL and JWT secret credentials.
4.  Set up the database using the SQL schema provided.
5.  Run `npm run dev` to start the backend server.

### Frontend Setup

1.  Navigate to the `pulsecheck-frontend` directory.
2.  Run `npm install`.
3.  Run `npm run dev` to start the frontend development server.
4.  Open `http://localhost:3000` in your browser.