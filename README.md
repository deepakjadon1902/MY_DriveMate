# 🚗 My Drivemate

> **A modern ride-sharing platform built with React, Vite, TypeScript, Supabase, and Tailwind CSS.**

---

## 🎯 Overview

**My Drivemate** is an interactive and beautiful ride-sharing web application where users can register either as **Drivers** or **Passengers**. It includes real-time ride management, booking, and notification features with a stylish UI that adapts to day and night modes.

From offering rides to booking them, the app is fully responsive, fast, secure, and built for real-world use.

---

## 🛠 Tech Stack

### 🧩 Frontend
- **React 18 + TypeScript** – for scalable, type-safe UI components
- **Vite** – lightning-fast bundler for development & production
- **Tailwind CSS** – for utility-first and responsive styling
- **Framer Motion** – smooth animations and transitions
- **React Router** – seamless navigation
- **Lucide React** – beautiful and consistent icon library
- **React Hot Toast** – sleek toast notifications

### 🌐 Backend
- **Supabase**
  - Authentication & Authorization
  - PostgreSQL Database with RLS
  - Realtime Subscriptions
  - Edge Functions (serverless)

---

## 🔐 Authentication System
- Sign up as **Driver** or **Passenger**
- Phone number required at registration
- Secure email/password login
- Role-based access control for secure navigation

---

## 🚘 Driver Features
- **Offer a Ride** with details like:
  - Pickup and Destination
  - Date and Time
  - Car Model and Number Plate
  - ₹ Price per Seat
  - Available Seats
- View and manage ride requests
- Receive **notifications** when a passenger books a ride
- **Confirm or Cancel** bookings
- See **Passenger contact details** upon confirmation

---

## 🣍 Passenger Features
- **Search Rides** by destination and date
- View all rides (past, current, future)
- **Book** rides with a single click
- Get **notifications** when driver confirms the ride
- Track ride status: **Upcoming, Going, Finished, Cancelled**
- Cancel booked rides
- See **Driver's phone number** after confirmation

---

## 🔔 Realtime Notifications
- **Driver gets alerted** when a ride is booked
- **Passenger gets confirmation** once driver accepts
- After confirmation, **both parties can see each other's phone number and email** for direct contact

---

## 👤 Profile Page
- Glassmorphism UI
- Animated welcome message
- User details: Name, Email, Phone, Role
- Booking/Ride History

---

## 🌙 Day/Night Mode
- Toggle between Day (black text) and Night (white text)
- Fully themed UI with smooth transitions

---

## 🗃️ Database Tables
- `profiles`: User info including role and contact
- `rides`: Ride details (driver, seats, car info, etc.)
- `bookings`: Bookings made by passengers
- `notifications`: Triggered alerts and messages

---

## 🔐 Security
- Supabase **Row-Level Security (RLS)** for strict data access
- Protected routes and endpoints
- Input validation and form sanitization

---

## ⚙️ Best Practices
- Component-based architecture
- Custom hooks for code reusability
- Context API for global state
- Strong typing with TypeScript
- Responsive design for all devices
- Error Boundaries for graceful failure

---

## 🚀 Deployment
- Hosted on **Netlify**
- Auto deployment from GitHub
- Free SSL and global CDN

---

## 📸 Screenshots (Add yours!)
- 📱 Responsive UI (Mobile/Desktop)
- ✨ Day & Night Mode
- 🚘 Ride Booking Flow
- 📩 Notification System

---

## 📌 How to Clone & Run This Project

```bash
# Clone the repo
$ git clone https://github.com/deepakjadon1902/MY_DriveMate.git

# Move into the project directory
$ cd MY_DriveMate

# Install dependencies
$ npm install

# Set up your Supabase project
# 1. Create a project at https://supabase.io
# 2. Create tables as mentioned in schema (profiles, rides, bookings, notifications)
# 3. Enable RLS and add policies
# 4. Get your Supabase project URL and anon/public key

# Create a .env file and add:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Start the development server
$ npm run dev
```


## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is open source under the MIT License.

---

> Made with ❤️ for ridesharing by **Deepak Jadon**

