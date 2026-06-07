# Auth Backend

A Node.js, Express, MongoDB, and JWT authentication backend with a simple MVC-style structure.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT generation for authenticated sessions
- HTTP-only cookie support on both register and login
- Mongoose validation for user data
- Health check endpoint for quick verification
- Startup checks for required environment variables

## Project Structure

```text
backend/
├── controller/
│   └── authController.js
├── database/
│   └── db.js
├── model/
│   └── authUser.js
├── routes/
│   └── authRoutes.js
├── index.js
├── package.json
└── package-lock.json
```

## Requirements

- Node.js 14+
- MongoDB Atlas or local MongoDB

## Setup

1. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create `backend/.env` and fill in your values.

3. Use a MongoDB URI that points to the database you want to store users in. If you want users stored in `ALGO`, the URI should end with `/ALGO`.

4. Add these variables to `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_uri_here
   JWT_SECRET=your_strong_random_secret_here
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

`FRONTEND_URL` is optional, but it is recommended when your frontend runs on a separate origin.

## Run

Start the server:

```bash
cd backend
npm start
```

If port `3000` is already in use, change `PORT` in `backend/.env` to another free port such as `3002`.

The server will also stop immediately if `MONGO_URI` or `JWT_SECRET` is missing.

## Verify It Works

### Health Check

Send a `GET` request to:

```text
http://localhost:3000/
```

Expected response:

```json
{
  "message": "AlgoU Auth Server is running!",
  "status": "healthy",
  "timestamp": "..."
}
```

### Register User

Send a `POST` request to:

```text
http://localhost:3000/register
```

Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

Send a `POST` request to:

```text
http://localhost:3000/login
```

Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## MongoDB Notes

- If your `MONGO_URI` ends with `/ALGO`, new users will be stored in the `ALGO` database.
- If no database name is included in the URI, MongoDB may default to `test`.
- The user documents are stored in the `authusers` collection.

## Auth Notes

- `POST /register` and `POST /login` both return a JWT and set a `token` HTTP-only cookie.
- In production, the cookie is configured with `SameSite=None` and `Secure=true` so it can work across origins.
- Passwords are hashed with `bcryptjs` before being stored.

## Tech Stack

- Express
- Mongoose
- MongoDB
- JWT
- bcryptjs
- cors
- cookie-parser

## License

MIT
