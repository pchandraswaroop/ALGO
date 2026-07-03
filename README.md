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
*   RabbitMQ instance (Docker, Docker Desktop, or a local service)
*   Docker (for isolated sandbox runner)

### Why RabbitMQ runs separately

RabbitMQ is a message broker. Think of it as a waiting room for judge work:

```text
Backend API  ->  RabbitMQ queue  ->  Judge Worker
```

The backend API does not judge code directly. It saves a submission, then puts a small message into RabbitMQ. The worker reads that message later and runs the code.

RabbitMQ is a separate program, just like MongoDB is a separate program. Your Node.js app connects to it using `RABBITMQ_URL`.

Common local options:

* **Docker / Docker Desktop**: run RabbitMQ in a container. This is common for development because it is easy to start and stop.
* **Local Windows service**: install RabbitMQ directly on Windows and keep it running in the background.
* **Cloud RabbitMQ**: use a hosted RabbitMQ URL. This is more common after deployment.

For local development, Docker is usually the easiest path because you can keep RabbitMQ isolated from your system.

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
    RABBITMQ_URL=amqp://localhost:5672
    JUDGE_QUEUE_NAME=judge.submissions
    JUDGE_WORKER_ENABLED=true
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
*   **Build Judge Docker Images**:
    ```powershell
    cd backend
    .\docker\build.ps1
    ```
    This builds local Docker images for the judge. Each image contains the tools needed to run one family of languages:
    * `judge-gcc:13` runs C and C++.
    * `judge-java:17` runs Java.
    * `judge-node:18` runs JavaScript.
    * `judge-python:3.10` runs Python.

    The worker uses these images so user code runs inside containers instead of directly on your machine.
*   **Start the Judge Worker**:
    ```bash
    cd backend
    npm run worker
    ```
    This starts `backend/worker.js`. The worker listens to RabbitMQ, receives queued submissions, runs the code in Docker, and updates the MongoDB verdict.

    Keep RabbitMQ running locally on `amqp://localhost:5672`, or update `RABBITMQ_URL`.
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
