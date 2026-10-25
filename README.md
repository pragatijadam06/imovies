# 🎬 IMovies — Book Movie Tickets Online

A full-stack MERN movie ticket booking web application with a cinema-dark theme, interactive seat selection, JWT authentication, and booking management.

---

## ✨ Features

| Area | Details |
|---|---|
| 🎬 Movies | Browse 8 seeded movies with posters, genres, ratings, cast |
| 🔍 Search & Filter | Search by title, filter by genre or language |
| 🏛️ Theatres | 4 theatres across Bangalore, Chennai, Hyderabad |
| 🎟️ Showtimes | 325 seeded shows for the next 7 days |
| 🪑 Seat Selection | Visual grid — available / selected / booked in different colours |
| 💰 Dynamic Pricing | Total updates live as you select seats |
| 🔒 Authentication | JWT login / register, bcrypt password hashing |
| 📋 Booking History | View all past bookings with status badges |
| ❌ Cancellation | Cancel a booking — seats released back automatically |
| 📵 Double-booking Guard | Atomic MongoDB `findOneAndUpdate` prevents seat conflicts |

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Bootstrap 5, React Router v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB (local), Mongoose |
| Auth | JWT, bcryptjs |
| HTTP | Axios (with JWT interceptor) |
| Notifications | react-hot-toast |

---

## 📁 Folder Structure

```
IMovies/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic (auth, movies, theatres, shows, bookings)
│   ├── middleware/     # JWT protect, adminOnly, errorHandler
│   ├── models/         # Mongoose schemas (User, Movie, Theatre, Show, Booking)
│   ├── routes/         # Express routers
│   ├── seed/           # seedDB.js — populates sample data
│   ├── .env.example    # Environment variable template
│   ├── package.json
│   └── server.js       # Express entry point
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios API layer (index.js)
│   │   ├── components/ # Navbar, Footer, MovieCard, PrivateRoute
│   │   ├── context/    # AuthContext (JWT state)
│   │   ├── pages/      # All page components
│   │   └── index.css   # Cinema-dark global theme
│   ├── .env.example
│   ├── index.html
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- **npm** v9 or later (included with Node.js)
- **MongoDB Community Server** — [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Git** (optional, for version control)

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/imovies
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRE=7d
NODE_ENV=development
```

> **Never commit `.env` to Git.** The `.gitignore` already excludes it.

### Frontend — `frontend/.env` (optional)

The frontend automatically uses the Vite proxy (`/api` → `http://localhost:5000`).  
Only needed for production or custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Start MongoDB

**Windows — open a terminal and run:**
```powershell
# Create data directory (one-time)
New-Item -ItemType Directory -Force -Path "C:\data\db"

# Start the MongoDB server
& "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --dbpath C:\data\db
```
Leave this terminal open (or run it as a background service).

### 2. Install backend dependencies

```bash
cd IMovies/backend
npm install
```

### 3. Configure backend environment

```bash
# Windows
copy .env.example .env
# Then open .env and set JWT_SECRET to any long random string
```

### 4. Seed sample data

```bash
# Still inside backend/
node seed/seedDB.js
```
This creates 8 movies, 4 theatres, and 325 shows for the next 7 days.

### 5. Start the backend

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 6. Install frontend dependencies (new terminal)

```bash
cd IMovies/frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🌐 Local URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Movies API | http://localhost:5000/api/movies |
| Auth API | http://localhost:5000/api/auth/register |

---

## 🧪 Testing the Main Features

1. **Browse movies** — Open http://localhost:5173, click **Movies**
2. **Register** — Click **Register**, fill in the form
3. **Login** — Click **Login**, use your credentials
4. **Select a movie** → Click **Book Tickets**
5. **Choose showtime** — Pick theatre, date, and time
6. **Select seats** — Click available seats (green), review total
7. **Confirm booking** — Click **Confirm Booking**
8. **View booking history** — Click your name in the navbar → **My Bookings**
9. **Cancel a booking** — Click **Cancel** on a booking card

---

## 🔑 API Endpoints (Quick Reference)

```
POST   /api/auth/register       Register a new user
POST   /api/auth/login          Login
GET    /api/auth/me             Get current user (protected)

GET    /api/movies              List movies (search/filter/paginate)
GET    /api/movies/filters      Get genres & languages for filters
GET    /api/movies/:id          Single movie details

GET    /api/theatres            List theatres

GET    /api/shows/movie/:id     Shows for a specific movie
GET    /api/shows/:showId       Single show + seat availability

POST   /api/bookings            Create booking (protected)
GET    /api/bookings/my         My bookings (protected)
GET    /api/bookings/:id        Single booking (owner only)
PUT    /api/bookings/:id/cancel Cancel booking (protected)
```

---

## 📤 Pushing to GitHub

```bash
cd IMovies

# Initialise Git (if not done)
git init
git add .
git commit -m "feat: initial IMovies MERN app"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/imovies.git
git branch -M main
git push -u origin main
```

> **Important:** Never push `.env` — it is in `.gitignore` by default.

---

## ☁️ Deployment Guide

### Frontend — Vercel (free)

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com), import the `frontend` folder.
3. Set the **Root Directory** to `frontend`.
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`
5. Deploy.

### Backend — Railway / Render (free tier)

1. Go to [railway.app](https://railway.app) or [render.com](https://render.com).
2. Connect your GitHub repo, set the **Root Directory** to `backend`.
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV=production`.
4. Deploy.

### Database — MongoDB Atlas (free)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Get the connection string, replace `MONGO_URI` in your backend's env vars.
3. Whitelist your server's IP address in Atlas Network Access.
4. Run the seed script against Atlas: `MONGO_URI=<atlas-uri> node seed/seedDB.js`

---

## ⚠️ Known Limitations

- **No real payment processing** — booking confirmation is a demo flow (no card/UPI integration).
- **No email notifications** — booking confirmation is only shown in-app.
- **Admin panel** — not implemented; seed script is used to manage data.
- **Show images** — posters are fetched from TMDB CDN; an internet connection is required to display them.
- **Session persistence** — JWT is stored in `localStorage`. For production, consider `httpOnly` cookies.

---

## 🏗 Built With

- [React](https://react.dev/) — UI library
- [Express](https://expressjs.com/) — Web framework
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — Database
- [Bootstrap 5](https://getbootstrap.com/) — CSS framework
- [Vite](https://vitejs.dev/) — Frontend build tool
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — JWT auth
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Password hashing
- [react-hot-toast](https://react-hot-toast.com/) — Notifications

---

*Made with ❤️ as part of the SkillWallet mentorship project.*
