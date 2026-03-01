# Doctor Appointment & Management Platform

A full-stack MERN application for managing doctor appointments, patients, and an admin back office. The project includes:

- **Frontend**: Patient-facing React app (booking, profile, appointments, prescriptions, etc.)
- **Admin Panel**: React-based admin dashboard (doctors, patients, appointments management)
- **Backend API**: Node.js + Express + MongoDB REST API with authentication and role-based access

> Note: Replace all screenshot image paths with your actual files before publishing on GitHub.

---

## 📸 Screenshots

_Add your own screenshots in the `screenshots/` folder and update the paths below._

- Home Page (User)
  - `![Home Page](screenshots/home-page.png)`
- Doctor Listing Page
  - `![Doctors List](screenshots/doctors-list.png)`
- Appointment Booking Flow
  - `![Book Appointment](screenshots/book-appointment.png)`
- User Dashboard / My Appointments
  - `![My Appointments](screenshots/my-appointments.png)`
- Admin Dashboard
  - `![Admin Dashboard](screenshots/admin-dashboard.png)`
- Admin – Doctors Management
  - `![Doctors Management](screenshots/admin-doctors.png)`
- Admin – Patients / Appointments Management
  - `![Patients & Appointments](screenshots/admin-patients-appointments.png)`

---

## 🧰 Tech Stack

**Frontend & Admin (Client Apps)**
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify

**Backend (API Server)**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Cloudinary (image hosting)
- Razorpay (payments, if enabled)

**Other Tools**
- ESLint
- Vite
- Nodemon
- dotenv

---

## 📁 Project Structure

```bash
root/
├─ admin/        # React admin dashboard (Vite)
├─ backend/      # Node.js + Express + MongoDB API
├─ frontend/     # React main client app (Vite)
└─ README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **backend/** folder (same level as `server.js`) with values matching your setup:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

Adjust `CLIENT_URL` and `ADMIN_URL` if you use different ports.

---

## 🏃 How to Run Project Locally

> Prerequisite: Install **Node.js** and **npm** (or **yarn**) on your system. Also make sure MongoDB is running (local or cloud like MongoDB Atlas).

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

From the **root folder**, install dependencies in each sub-project:

```bash
# Backend













































































































> Feel free to fork this repo, add your own features, and use it as a portfolio project on GitHub and LinkedIn.Built with ❤️ using the MERN stack (MongoDB, Express, React, Node.js).## 🙌 Credits---- Payment integration with Razorpay (if configured)- Image uploads (e.g., doctor profile photos) via Cloudinary- Admin dashboard to manage doctors, patients, and appointments- Manage profiles for patients and doctors- Book, view, and cancel appointments- Browse doctors by speciality- User authentication (patients / doctors / admin)## ✨ Features (High Level)---- Update frontend/admin API base URL to point to your deployed backend.- Set all environment variables on the serverThe backend (`backend/`) can be deployed to platforms like Render, Railway, or a VPS. Make sure to:This will generate production-ready static assets in the `dist/` folders which can be deployed to services like Vercel, Netlify, or any static hosting provider.```npm run buildcd ../admin# Adminnpm run buildcd frontend# Frontend```bashTo create optimized production builds:## 🚀 Production Build (Optional)---Place this in `.env` inside `frontend/` and/or `admin/` if your project uses it.```VITE_API_BASE_URL=http://localhost:5000```env- If you have environment-based configuration on the frontend/admin (like `.env` files for Vite), set them to point to your backend:- Base API URLs are usually configured in a context or config file (for example something like `VITE_API_BASE_URL`).- The **frontend** and **admin** apps use **Axios** to talk to the backend.## 🔗 API & Frontend Integration---Make sure these URLs match what you put in the backend `.env` (`CLIENT_URL`, `ADMIN_URL`).- `http://localhost:5174`Vite will show another local URL, typically:```npm run devcd admin```bashOpen another terminal:### 5️⃣ Start the Admin Panel- `http://localhost:5173`Vite will show a local URL, typically:```npm run devcd frontend```bashOpen a new terminal:### 4️⃣ Start the Frontend (User) AppBy default it will run on `http://localhost:5000` (or the `PORT` you set in `.env`).```npm start        # plain node server.js# ornpm run server   # uses nodemon (for development)cd backend```bashIn a terminal:### 3️⃣ Start the Backend Server```npm installcd ../admin# Admin (admin panel)npm installcd ../frontend# Frontend (user app)npm installcd backend