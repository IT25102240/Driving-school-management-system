# DriveSafe Pro - Enterprise Fleet & Scheduling Platform

![DriveSafe Pro](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-blue)

**DriveSafe Pro** is a comprehensive, web-based enterprise fleet and scheduling platform designed specifically for driving schools. It provides an immersive and responsive user interface for managing students, instructors, vehicles, and schedules all in one place.

## 🚀 Tech Stack

### Frontend Language
*   **HTML5** (Structure)
*   **Vanilla CSS3** (Styling, Dark Mode, Animations, Responsive Design)
*   **Vanilla JavaScript** (DOM manipulation, API integration, interactive dashboards)

### Backend Language & Database
*   **Node.js** (JavaScript Runtime)
*   **Express.js** (Web Framework for creating API endpoints)
*   **SQLite3** (Lightweight relational database)
*   **JSON Web Tokens (JWT)** (Secure authentication and session management)

## ✨ Core Features

*   **Role-Based Access Control:** Secure portals with specific permissions and views tailored for **Admins**, **Instructors**, and **Students**.
*   **Immersive User Interface:** A highly responsive design built with Vanilla CSS, featuring glassmorphism, fluid micro-animations, and a seamless **Dark/Light Mode** toggle.
*   **Entity Management (CRUD):** 
    *   **Students:** Manage enrollments, packages, and statuses.
    *   **Instructors:** Track licenses, specializations, and availability.
    *   **Vehicles:** Monitor fleet details, transmission types, and upcoming service dates.
*   **Scheduling System:** Book, view, and manage driving lessons seamlessly.
*   **Revenue Tracking:** Built-in dashboard widgets to track payments and calculate overall revenue.
*   **Secure Authentication:** Passwords and sessions secured using JWT.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/IT25102240/DriveSafe_Pro.git
   cd DriveSafe_Pro
   ```

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   node server.js
   ```

4. **Access the platform:**
   Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints (Express.js)

The backend provides RESTful APIs to handle data operations securely (requires Bearer token authentication):

*   **Auth:** `POST /api/auth/login`
*   **Dashboard Stats:** `GET /api/dashboard/stats`
*   **Students:** `/api/students` (GET, POST, PUT, DELETE)
*   **Instructors:** `/api/instructors` (GET, POST, PUT, DELETE)
*   **Vehicles:** `/api/vehicles` (GET, POST, PUT, DELETE)
*   **Lessons:** `/api/lessons` (GET, POST, PUT, DELETE)
*   **Payments:** `/api/payments` (GET, POST, PUT, DELETE)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
