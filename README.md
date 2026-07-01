# AlgoU Online Judge Platform

A modern, high-performance Online Judge Platform built on the MERN stack (MongoDB, Express, React, Node.js). Users can register, log in, manage their profiles, browse coding challenges, write code in a Monaco editor, run custom input test scripts, and submit solutions to be judged against test cases in isolated Docker execution runtimes.

---

## 1. Project Directory Structure

```text
MyProject/
├── backend/                  # Express.js Server
│   ├── controller/           # Business logic (Auth, Users, Problems, Submissions)
│   ├── database/             # Database configuration (Mongoose connect)
│   ├── middleware/           # Request logging, verification, and errors
│   ├── model/                # MongoDB Schema models (User, Problem, TestCase, Submission)
│   ├── routes/               # API endpoint configurations
│   ├── scripts/              # Seed scripts (e.g., admin creation CLI)
│   ├── index.js              # Entry point script
│   └── package.json
│
├── frontend/                 # React.js SPA (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/       # Reusable layout components (Navbar, Router guards)
│   │   ├── context/          # Global Auth state context
│   │   ├── pages/            # View pages (Home/Dashboard, Login, Register, Profile)
│   │   ├── api.js            # Axios client with automatic bearer token interceptors
│   │   ├── App.jsx           # Client-side router configuration
│   │   └── main.jsx
│   └── package.json
```

---

## 2. Requirements & Prerequisites

*   Node.js (version 16+)
*   npm or yarn
*   MongoDB Instance (Atlas cloud or Local instance)
*   Docker (Optional - for isolated sandbox runner in later phases)

---

## 3. Quick Setup & Run Instructions

### Step 1: Clone and Configure Environment

1.  Navigate to the **backend** directory:
    ```bash
    cd backend
    npm install
    ```
2.  Create a `backend/.env` file with these keys:
    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/ALGO
    JWT_SECRET=your_super_secure_random_jwt_secret_key
    FRONTEND_URL=http://localhost:5173
    ```
3.  Navigate to the **frontend** directory:
    ```bash
    cd ../frontend
    npm install
    ```
4.  Create a `frontend/.env` file:
    ```env
    VITE_BACKEND_URL=http://localhost:3000
    ```

### Step 2: Run the Project Locally

*   **Start the Backend**:
    ```bash
    cd backend
    npm run dev
    ```
*   **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

Open your browser and navigate to the Vite preview address (usually `http://localhost:5173`).

---

## 5. Completed Sprint Features

### Authentication & Profile Integration (Phase 2)
1.  **Axios API Client & Interceptors**: Handles request automation and automatically grabs the JWT token from `localStorage` to inject as a bearer credential on headers.
2.  **State Protection Router Guards**: Prevents unlogged users from seeing dashboards, and logged-in users from seeing the register screen.
3.  **Show Password Toggle**: Login, Register, and Profile updates feature a click toggle (using Eye/EyeOff icons) to easily preview input password contents.
4.  **Profile Danger Zone**: Enables users to delete their account cascade-style (which wipes all associated code submissions in the database to keep data clean).
