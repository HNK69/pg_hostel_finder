# PG & Hostel Finder - Frontend Application

A premium, modern React + Vite frontend for finding PG & Student Hostels. Built using Tailwind CSS, Framer Motion, Axios, and React Router.

---

## 🚀 Tech Stack
- **Core**: React.js + Vite (JS)
- **Styling**: Tailwind CSS v4 (Sleek custom colors, display fonts, glassmorphism shadows)
- **Animations**: Framer Motion
- **Navigation**: React Router DOM (Lazy-loaded routes and Protected Routes)
- **Forms**: React Hook Form
- **API Client**: Axios (Centralized instance, request/response interceptors, automatic JWT injection, session validation)
- **Toasts**: React Hot Toast
- **Carousel**: Swiper.js

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- Existing Flask backend running locally at `http://127.0.0.1:5000`

### Step 1: Install Dependencies
Navigate into the `frontend` folder and install packages:
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables (Optional)
Vite uses a development proxy configured in [vite.config.js](vite.config.js) that forwards `/api` requests to `http://127.0.0.1:5000` automatically.
If you need to change the API server, create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://your-remote-api-server/api
```

### Step 3: Run Development Server
Start the frontend server locally on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Step 4: Production Build
To build the optimized static assets for production:
```bash
npm run build
```
The output files will be generated inside the `dist/` directory.

---

## 📂 Project Structure
```
frontend/
├── vite.config.js       # Vite configuration with backend proxy
├── postcss.config.js    # PostCSS configs for Tailwind v4 compiler
├── src/
│   ├── api/             # Axios instance configuration
│   ├── assets/          # Project assets and placeholders
│   ├── components/      # Reusable UI elements (Navbar, Cards, Loaders)
│   ├── context/         # React Authentication Context
│   ├── hooks/           # Custom utility hooks (useDebounce)
│   ├── layouts/         # Layout wraps (MainLayout, DashboardLayout)
│   ├── pages/           # Page modules (Home, Details, Search, CRUD panels)
│   ├── routes/          # Router paths and Protected Router wrappers
│   ├── App.jsx          # Entry page wrap
│   └── index.css        # Tailwind classes, imports, base animations
└── README.md
```

---

## 🔐 User Roles & APIs
- **Students (Guest Visitors)**: Can browse hostels, search room filters, view galleries, and submit reviews (public endpoints).
- **Owners & Admins**: Can register/login to access the Owner Dashboard to register property listings, configure bed capacities and monthly rent pricing, insert image URLs, and manage feedback comments.
