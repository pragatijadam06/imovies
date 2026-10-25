# Full Stack Development with MERN
## Project Documentation — IMovies

---

## 1. Introduction

* **Project Title:** IMovies — Movie Ticket Booking Made Simple
* **Domain:** Web Development / Entertainment & Ticketing Systems
* **Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
* **Developer:** Project author

---

## 2. Project Overview

### 2.1 Purpose
**IMovies** is a full-stack web application designed to simplify the movie ticket reservation process for cinema-goers. The platform allows users to explore currently playing blockbusters, filter titles by genre and language, view cinema locations and showtimes, select seats through an interactive visual seating layout, and manage their reservations seamlessly.

### 2.2 Key Features
1. **Dynamic Movie Catalog:** Browse movies with posters, durations, genres, age ratings, director/cast details, and descriptions.
2. **Real-Time Search & Filtering:** Filter movies instantly by genre and language, or search by title.
3. **Multi-Theatre & Showtime Management:** Discover participating cinemas across cities (Bangalore, Chennai, Hyderabad) with real-time showtime listings.
4. **Time-Aware Show Availability:** Automatically detects current local time; marks past showtimes as *Expired* and prevents invalid bookings.
5. **Interactive Visual Seat Grid:** Color-coded seat map distinguishing *Available*, *Selected*, and *Booked* seats with dynamic subtotal calculations.
6. **Double-Booking & Race Condition Prevention:** Atomic seat reservations using MongoDB `$addToSet` and `$not $elemMatch` constraints to ensure no two customers can reserve the same seat simultaneously.
7. **Secure User Authentication:** JWT-based stateless authentication with password hashing using bcrypt (12 salt rounds).
8. **Booking Confirmation & History:** Generates unique alphanumeric booking references (e.g., `IMOV-XXXXXX`) and provides a dedicated booking history view with cancellation capabilities.
9. **Cancellation Flow:** Users can cancel active bookings; reserved seats are immediately released back to the show's availability pool.
10. **Modern Purple & White Theme:** Aesthetic, accessible user interface featuring high-contrast typography, responsive layouts, and fluid transitions.

---

## 3. Architecture

### 3.1 Frontend Architecture (React.js)
* **Framework:** React 19 with Vite bundler for rapid HMR and lightweight bundle sizes.
* **Routing:** `react-router-dom` (v7) handling declarative client-side routes, URL parameters (e.g. `/movies/:id`, `/shows/:showId/seats`), and protected route guards (`<PrivateRoute>`).
* **State Management:**
  * React `Context API` (`AuthContext`) manages global authentication state (current user, JWT token, login, and logout handlers).
  * Local component state (`useState`, `useEffect`) manages filters, seat selections, and dynamic pricing calculations.
* **HTTP Client:** Axios instance configured with base URL and an automatic request interceptor that injects the `Authorization: Bearer <token>` header on protected requests.
* **Styling & UI:** Custom modern CSS design system based on CSS variables (`index.css`), complemented by Bootstrap 5 grid utilities and `react-hot-toast` for notifications.

### 3.2 Backend Architecture (Node.js & Express.js)
* **Runtime:** Node.js (v18+) with Express.js REST framework.
* **Architecture Pattern:** Controller-Service-Model MVC pattern separating routes, controllers, data models, and middleware.
* **Middleware Pipeline:**
  * `cors()`: Cross-Origin Resource Sharing handling.
  * `express.json()`: Body parsing.
  * `protect`: Custom authentication middleware verifying JWT signatures from request headers and attaching the authenticated User document to `req.user`.
  * Centralized Error Handler: Captures uncaught exceptions, Mongoose validation errors, and returns consistent JSON error payloads with meaningful HTTP status codes.
* **Atomic Seat Concurrency:** The booking controller executes atomic database updates using `Show.findOneAndUpdate(...)` to eliminate double-booking race conditions without external distributed locks.

### 3.3 Database Architecture (MongoDB & Mongoose)
* **Database Engine:** MongoDB Community Server (v7.0/v9.0) with Mongoose ODM.
* **Collections & Schemas:**
  1. **Users (`User.js`):** `name`, `email` (unique, indexed), `password` (hashed with bcrypt, excluded from standard queries via `select: false`), `role` (`user` / `admin`).
  2. **Movies (`Movie.js`):** `title`, `description`, `genre` (array), `languages` (array), `duration` (minutes), `rating`, `releaseDate`, `cast`, `director`, `poster` (URL), `trailer` (URL), `isActive`.
  3. **Theatres (`Theatre.js`):** `name`, `location`, `city`, `totalSeats`, `rows`, `seatsPerRow`, `isActive`.
  4. **Shows (`Show.js`):** `movie` (Ref: Movie), `theatre` (Ref: Theatre), `date` (Date), `time` (String), `price` (Number), `bookedSeats` (array of Strings, e.g. `['A1', 'A2']`), `isActive`.
  5. **Bookings (`Booking.js`):** `bookingRef` (Unique String), `user` (Ref: User), `show` (Ref: Show), `seats` (array of Strings), `totalPrice` (Number), `status` (`confirmed` / `cancelled`).

---

## 4. Setup Instructions

### 4.1 Prerequisites
Before installing the project, verify that the following tools are installed on your workstation:
* **Node.js:** v18.0.0 or higher ([https://nodejs.org](https://nodejs.org))
* **npm:** v9.0.0 or higher (packaged with Node.js)
* **MongoDB Community Server:** v6.0 or higher running locally on port `27017` ([https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community))
* **Code Editor:** Visual Studio Code or any modern IDE

### 4.2 Installation Guide

#### Step 1: Clone or Open the Workspace
```bash
cd IMovies
```

#### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 3: Configure Backend Environment Variables
Create a `.env` file in the `backend/` directory by duplicating `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/imovies
JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

#### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Step 5: Configure Frontend Environment Variables (Optional)
In `frontend/`, create a `.env` file (the Vite development proxy forwards `/api` calls to `http://localhost:5000` automatically):
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 6: Seed Database with Sample Data
Populate MongoDB with 8 movies, 4 theatres, and showtimes:
```bash
cd ../backend
node seed/seedDB.js
```

---

### Public Repository Safety

- Keep real environment files (such as `.env`) out of version control.
- Commit `.env.example` only with placeholder values, never real secrets or passwords.
- Do not publish database connection strings containing credentials, API keys, JWT secrets, access tokens, or private user data.
- Exclude generated dependencies and build artifacts such as `node_modules/`, virtual environments, and `dist/` using `.gitignore`.

---

## 5. Folder Structure

```
IMovies/
├── backend/                       # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── movieController.js    # Movie queries, filters, auto-repair
│   │   ├── theatreController.js  # Theatre listing
│   │   ├── showController.js     # Showtime listing, expiration calculation
│   │   └── bookingController.js  # Atomic booking, cancellation, history
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role protection
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User model & password pre-save hook
│   │   ├── Movie.js              # Movie model
│   │   ├── Theatre.js            # Cinema theatre model
│   │   ├── Show.js               # Show scheduling & booked seats array
│   │   └── Booking.js            # Customer booking record
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── movieRoutes.js        # /api/movies routes
│   │   ├── theatreRoutes.js      # /api/theatres routes
│   │   ├── showRoutes.js         # /api/shows routes
│   │   └── bookingRoutes.js      # /api/bookings routes
│   ├── seed/
│   │   └── seedDB.js             # 14-day master database seeder
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Express server entry point
│
├── frontend/                      # React SPA (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js          # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar & auth status
│   │   │   ├── Footer.jsx        # Footer links & copyright
│   │   │   ├── MovieCard.jsx     # Reusable movie card component
│   │   │   └── PrivateRoute.jsx  # Auth guard wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & handlers
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero banner, now showing, highlights
│   │   │   ├── MoviesPage.jsx    # Search & genre/language filter catalog
│   │   │   ├── MovieDetailPage.jsx # Details, cast, and showtime selector
│   │   │   ├── SeatSelectionPage.jsx # Interactive seat layout & pricing
│   │   │   ├── BookingConfirmPage.jsx # Reservation summary & demo payment
│   │   │   ├── BookingSuccessPage.jsx # Confirmed ticket view & ref code
│   │   │   ├── MyBookingsPage.jsx# User booking history & cancellation
│   │   │   ├── LoginPage.jsx     # Login form
│   │   │   ├── RegisterPage.jsx  # Registration form
│   │   │   └── NotFoundPage.jsx  # 404 page
│   │   ├── App.jsx               # Route declarations & toaster setup
│   │   ├── index.css             # Purple & White theme design system
│   │   └── main.jsx              # React DOM mounting
│   ├── index.html                # HTML5 root with meta tags
│   ├── vite.config.js            # Vite configuration with API proxy
│   └── package.json              # Frontend dependencies & scripts
│
├── start.bat                     # Windows 1-click startup script
├── reseed.bat                    # Windows 1-click database refresh script
├── README.md                     # Quickstart documentation
└── PROJECT_DOCUMENTATION.md      # Full project documentation
```

---

## 6. Running the Application

### 6.1 Option A: One-Click Startup (Windows)
Double-click `start.bat` in the project root. This automatically launches:
1. Local MongoDB Server
2. Backend API on `http://localhost:5000`
3. Frontend Vite Server on `http://localhost:5173`

### 6.2 Option B: Manual Terminal Execution

#### Terminal 1 — Start Database
```powershell
& "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --dbpath C:\data\db
```

#### Terminal 2 — Start Backend Server
```bash
cd IMovies/backend
npm run dev
# Running on http://localhost:5000
```

#### Terminal 3 — Start Frontend Client
```bash
cd IMovies/frontend
npm run dev
# Running on http://localhost:5173
```

---

## 7. API Documentation

### 7.1 Authentication Endpoints (`/api/auth`)

#### 1. Register User
* **Method:** `POST /api/auth/register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Account created successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "671cb0a8...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

#### 2. Login User
* **Method:** `POST /api/auth/login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "671cb0a8...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

#### 3. Current User Profile
* **Method:** `GET /api/auth/me`
* **Access:** Private (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "671cb0a8...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

---

### 7.2 Movie Endpoints (`/api/movies`)

#### 1. List Movies (with Search & Pagination)
* **Method:** `GET /api/movies?search=batman&genre=Action&language=English&page=1&limit=12`
* **Access:** Public
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "total": 1,
    "page": 1,
    "pages": 1,
    "movies": [
      {
        "_id": "671cb0a8...",
        "title": "The Dark Knight",
        "description": "When the menace known as the Joker wreaks havoc...",
        "genre": ["Action", "Crime", "Drama"],
        "languages": ["English", "Hindi", "Tamil"],
        "duration": 152,
        "rating": 9.0,
        "poster": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
      }
    ]
  }
  ```

#### 2. Get Filters (Genres and Languages)
* **Method:** `GET /api/movies/filters`
* **Access:** Public
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "genres": ["Action", "Adventure", "Drama", "Sci-Fi", "Thriller"],
    "languages": ["English", "Hindi", "Korean", "Tamil", "Telugu"]
  }
  ```

#### 3. Single Movie Details
* **Method:** `GET /api/movies/:id`
* **Access:** Public
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "movie": {
      "_id": "671cb0a8...",
      "title": "Interstellar",
      "description": "A group of explorers travel through a wormhole...",
      "director": "Christopher Nolan",
      "cast": ["Matthew McConaughey", "Anne Hathaway"],
      "duration": 169,
      "rating": 8.6,
      "poster": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    }
  }
  ```

---

### 7.3 Showtime Endpoints (`/api/shows`)

#### 1. Shows for a Specific Movie
* **Method:** `GET /api/shows/movie/:movieId`
* **Access:** Public
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "shows": [
      {
        "_id": "671cb11f...",
        "movie": "671cb0a8...",
        "theatre": {
          "_id": "671cb0f1...",
          "name": "PVR Cinemas - Phoenix Mall",
          "location": "Whitefield",
          "city": "Bangalore"
        },
        "date": "2026-10-26T00:00:00.000Z",
        "time": "04:00 PM",
        "price": 250,
        "bookedSeats": ["A1", "A2"],
        "isExpired": false
      }
    ]
  }
  ```

#### 2. Single Show Details & Seat Availability
* **Method:** `GET /api/shows/:showId`
* **Access:** Public
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "show": {
      "_id": "671cb11f...",
      "theatre": {
        "name": "PVR Cinemas - Phoenix Mall",
        "rows": 10,
        "seatsPerRow": 12,
        "totalSeats": 120
      },
      "date": "2026-10-26T00:00:00.000Z",
      "time": "04:00 PM",
      "price": 250,
      "bookedSeats": ["A1", "A2"],
      "isExpired": false
    }
  }
  ```

---

### 7.4 Booking Endpoints (`/api/bookings`)

#### 1. Create a Booking (Atomic Seat Reservation)
* **Method:** `POST /api/bookings`
* **Access:** Private (`Bearer <token>`)
* **Request Body:**
  ```json
  {
    "showId": "671cb11f...",
    "seats": ["C4", "C5"]
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Booking confirmed!",
    "booking": {
      "_id": "671cb290...",
      "bookingRef": "IMOV-K7X9PQ21",
      "seats": ["C4", "C5"],
      "totalPrice": 500,
      "status": "confirmed",
      "createdAt": "2026-10-25T14:30:00.000Z"
    }
  }
  ```
* **Error Response - Seat Already Booked (409 Conflict):**
  ```json
  {
    "success": false,
    "message": "Seat(s) C4 already booked. Please select different seats."
  }
  ```
* **Error Response - Expired Showtime (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "This show (01:30 PM) has already started or ended. Bookings are closed."
  }
  ```

#### 2. Get User Bookings
* **Method:** `GET /api/bookings/my`
* **Access:** Private (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "bookings": [
      {
        "_id": "671cb290...",
        "bookingRef": "IMOV-K7X9PQ21",
        "seats": ["C4", "C5"],
        "totalPrice": 500,
        "status": "confirmed"
      }
    ]
  }
  ```

#### 3. Cancel Booking
* **Method:** `PUT /api/bookings/:id/cancel`
* **Access:** Private (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully."
  }
  ```

---

## 8. Authentication & Authorization

### 8.1 Strategy
* **Architecture:** Stateless JSON Web Token (JWT) authentication.
* **Token Issuance:** Generated upon registration or login via `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
* **Password Hashing:** Implemented with `bcryptjs` using 12 salt rounds inside Mongoose's `pre('save')` hook. Plaintext passwords are never stored in the database.
* **Security Measures:**
  * Password exclusion: Model defines `password: { select: false }` to prevent leakage in standard queries.
  * Sanitization: Email addresses are normalized to lowercase and trimmed before storage.
  * Private Route Guarding: React client wraps protected views (`/shows/:id/seats`, `/booking/confirm`, `/my-bookings`) in `<PrivateRoute>`, redirecting unauthenticated visitors to `/login` with an automatic return redirect.
  * Server-side Authorization: The `protect` middleware extracts the Bearer token, verifies its cryptographic signature, and looks up the active user before delegating execution to the controller.

---

## 9. User Interface Design

The application features a modern **Purple and White** theme engineered for high visual appeal and accessibility:
* **Color Palette:**
  * Primary Accent: Royal Violet (`#7c3aed`) and Deep Purple (`#6d28d9`)
  * Background Canvas: Crisp Off-White with soft violet undertones (`#f8f7fc`)
  * Surface Cards: Pure White (`#ffffff`) with subtle violet drop shadows
  * Typography: Deep Midnight Violet (`#18132b`) and Slate Muted (`#5e5873`)
* **Responsive Layout:** Fluid grid layouts adapting gracefully across mobile phones (<768px), tablets (768px - 1024px), and desktop monitors (>1024px).
* **Key Screen Breakdowns:**
  1. **Home Page (`/`):** Dynamic hero section with action buttons, key value propositions, and a curated *Now Showing* movie grid.
  2. **Movies Catalog (`/movies`):** Real-time search bar combined with genre and language filter dropdowns, movie cards with ratings, and pagination controls.
  3. **Movie Detail View (`/movies/:id`):** Backdrop hero banner, movie metadata (duration, rating, cast, director), and showtime selection grouped by date with real-time *Available* and *Expired* badges.
  4. **Interactive Seating Layout (`/shows/:id/seats`):** Visual theater screen representation, interactive seat rows with color-coded seat states (*Available*, *Selected*, *Booked*), real-time ticket price calculation, and ticket selection controls.
  5. **Booking Confirmation (`/booking/confirm`):** Detailed reservation summary and demo checkout flow.
  6. **Booking Success Summary (`/booking/success/:id`):** Visual confirmation badge, booking reference code, date/theatre/time breakdown, and navigation links.
  7. **My Bookings (`/my-bookings`):** Historical record of past and active bookings with cancellation actions and status pills.

---

## 10. Testing

### 10.1 Testing Strategy
1. **API Integration Testing:** Comprehensive testing of all Express REST endpoints using automated PowerShell scripts and Postman:
   * Validation of HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `409 Conflict`).
   * Verification of JWT payload generation and protected endpoint authentication.
2. **Double-Booking & Race Condition Verification:**
   * Automated test simulating concurrent seat booking requests for the same seat ID.
   * Confirmed that the first request succeeds (HTTP 201) while subsequent requests are blocked with HTTP 409 Conflict: `"Seat(s) X already booked."`
3. **Showtime Expiration Logic Testing:**
   * Validated that shows occurring prior to the current system clock are marked `isExpired: true`.
   * Verified that booking requests for expired shows are rejected with HTTP 400.
4. **Cancellation Integrity Testing:**
   * Validated that cancelling an active booking updates its status to `cancelled` and atomically removes the booked seats from the Show document's `bookedSeats` array via `$pullAll`.
5. **Frontend Production Build Verification:**
   * Executed `npm run build` using Vite.
   * Confirmed zero compilation, syntax, or module resolution errors across all 97 modules.

---

## 11. Screenshots or Demo

Add screenshots or a link to a deployed demo here when available. Recommended screenshots:

- Homepage
- Movie catalogue and filters
- Movie details and showtimes
- Seat selection
- Booking confirmation and booking history

Local development addresses (for example, `localhost`) are only accessible on the developer's machine and are not public demo links. Do not publish real account credentials, access tokens, or private environment values in this section.

---

## 12. Known Issues & Limitations

1. **Demonstration Payment Flow:** As an educational prototype, payment processing uses a simulated confirmation flow. Real payment gateways (such as Stripe or Razorpay) are not integrated.
2. **Third-Party CDN Dependency:** Movie posters are served from TMDb's CDN; active internet connectivity is required for poster images to render.
3. **Session Token Storage:** Tokens are stored in browser `localStorage` for simplicity. For production environments, `httpOnly` secure cookies are recommended to prevent potential XSS exposure.
4. **Email / SMS Dispatch:** Booking confirmations are currently rendered in-app; external transactional email/SMS services (SendGrid/Twilio) are not attached.

---

## 13. Future Enhancements

1. **Payment Gateway Integration:** Integrate Razorpay or Stripe for real credit card, debit card, and UPI payment processing.
2. **QR Code Digital Ticket:** Generate scannable QR codes for booking reference IDs to facilitate automated barcode scanning at theater entrances.
3. **Email & WhatsApp Notifications:** Automatically dispatch ticket PDFs and calendar invites via email and WhatsApp.
4. **Administrative Portal:** A dedicated administrator dashboard for cinema managers to create new movies, configure theater seat matrices, and manage showtime schedules.
5. **Concessions & Add-Ons:** Allow customers to pre-order popcorn, snacks, and beverages during seat selection.
6. **User Reviews & Ratings:** Allow authenticated users who attended a screening to post star ratings and verified reviews.
