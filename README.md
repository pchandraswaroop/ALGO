# AlgoU Judge

A modern, high-performance, and beautifully designed Online Judge Platform built on the MERN stack (MongoDB, Express, React, Node.js). Users can register, log in, manage their profiles, browse coding challenges, write code in a feature-rich Monaco editor workspace, and submit solutions to be judged against test cases in isolated execution runtimes.

---

## 🌟 Key Features

- **Dual-Pane Coding Workspace**: A resizable split-column layout separating the problem description and submission history from the Monaco code editor, providing a seamless and professional coding experience.
- **Multi-Language Support**: Dynamically loads boilerplate templates and supports secure execution for **C++, C, Java, Python, and JavaScript**.
- **Universal Light/Dark Themes**: Fully customized premium UI built with Tailwind CSS variables. Enjoy a seamless, dynamic toggle between Light and Dark modes across all dashboards, cards, inputs, and the Monaco Editor.
- **Secure Execution Sandbox**: The backend utilizes isolated runner environments (Background workers/Docker) to compile, run, and evaluate user code safely against hidden test cases.
- **Authentication & Profiles**: JWT-based authentication with state-protection router guards, seamless login/register experiences, password visibility toggles, and secure profile management.
- **Responsive Design**: Polished end-to-end layout with full-width navbars, dynamic UI components, hover-state micro-animations, and mobile-responsive grids.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Monaco Editor, React Router DOM, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs.
- **Execution Engine**: Custom Node.js worker and queueing system for asynchronous code execution and verdict polling.

---

## 📂 Project Structure

```text
MyProject/
├── backend/                  # Express.js API & Execution Engine
│   ├── controller/           # Business logic (Auth, Users, Problems, Submissions)
│   ├── database/             # Database configuration (Mongoose connect)
│   ├── middleware/           # Request logging, verification, and error handling
│   ├── model/                # MongoDB Schemas (User, Problem, Submission)
│   ├── routes/               # API endpoint configurations
│   ├── index.js              # Express API entry point
│   ├── worker.js             # Code execution sandbox worker
│   └── package.json
│
├── frontend/                 # React.js SPA (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/       # Reusable layout components (Navbar, Sidebar, Layouts)
│   │   ├── pages/            # View pages (Dashboard, Login, Register, Profile, Problem)
│   │   ├── api.js            # Axios client with automatic bearer token interceptors
│   │   ├── App.jsx           # Client-side router configuration
│   │   ├── index.css         # Global Tailwind CSS variables and theme configurations
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
```

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas cloud URI)
- Git

### 1. Clone and Configure Environment

Navigate into the backend directory to set up the API server:
```bash
cd backend
npm install
```

Create a `backend/.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/algou-judge
JWT_SECRET=your_jwt_secret_key
```

Navigate into the frontend directory to set up the client application:
```bash
cd ../frontend
npm install
```

Create a `frontend/.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 2. Run the Project Locally

You will need to run the **Backend API**, the **Execution Worker**, and the **Frontend Client** simultaneously. Open three separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Execution Worker):**
```bash
cd backend
node worker.js
```

**Terminal 3 (Frontend Client):**
```bash
cd frontend
npm run dev
```

The frontend will be accessible at `http://localhost:5173`.

---

## 🏗️ Production Deployment

To deploy the application to a production environment:

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```
   This generates a highly optimized static build under the `dist/` directory, ready to be served by Nginx, Vercel, Netlify, or any static hosting provider.

2. **Deploy the Backend**:
   Host the Express API and the `worker.js` script on a VPS (like DigitalOcean, AWS EC2, or Render). Ensure your MongoDB database is securely hosted (e.g., MongoDB Atlas) and environment variables are properly set in the production environment.
