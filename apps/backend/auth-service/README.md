# Auth Service

This service provides **user authentication and authorization APIs** including user registration, login, and protected routes.  
It is built with **Node.js, Express, MongoDB, and Passport.js**.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- npm (comes with Node.js)
- MongoDB instance (local or cloud, e.g. MongoDB Atlas)

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd auth-service
   
2. **Install dependencies**
    ```bash
    npm install
   
3. **Run the service**
    ```bash
   npm run dev

The server will start on the port defined in your .env file (Example: http://localhost:3050).

---

## 📄 Environment Variables

Create a .env file in the project root with the following variables:

        PORT=3050
        MONGO_URI=mongodb://localhost:27017/userdb
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
        GOOGLE_CALLBACK_URL=http://localhost:${PORT}/api/auth/google/callback
        VITE_API_URL=http://localhost:${PORT}
        SESSION_SECRET=your_session_secret
        JWT_SECRET=your_jwt_secret
        FRONTEND_URL=your_frontend_url
        EMAIL_USER=your_email
        EMAIL_PASS=your_email_passkey
