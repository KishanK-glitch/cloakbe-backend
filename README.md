
## Cloakbe: Smart Locker Management System

**Cloakbe** is an end-to-end IoT-simulated smart locker solution designed for high-traffic public spaces (malls, airports, transit hubs). It features real-time locker allocation, dynamic time-based pricing, and a secure dual-authentication retrieval system.

## Key Features

* **Real-time Locker Grid:** Interactive 2D layout with dynamic status updates using CSS Grid and polling.
* **Secure Retrieval:** OTP-based fallback authentication for users who lose their access codes.
* **Dynamic Pricing:** Automated fare calculation based on duration of use (Pay-at-Pickup model).
* **Concurrency Control:** Implements Row-Level Locking in SQLite to prevent race conditions during simultaneous bookings.
* **Hardware Mocking:** Integrated terminal logging to simulate physical locker relay triggers.

## Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Vite.
* **Backend:** Python 3.11, FastAPI, SQLAlchemy (ORM).
* **Database:** SQLite (Relational).
* **Simulation:** Mock SMS Gateway (Fast2SMS logic ready for production DLT).

## Project Structure

```text
FINAL version/
├── cloakbe_backend/         # FastAPI Microservice
│   ├── app/
│   │   ├── controllers/    # API Route Handlers
│   │   ├── services/       # Business Logic (Pricing, Allocation)
│   │   └── utils/          # SMS Simulator & JWT
│   └── seed.py             # Database Initialization Script
├── frontend/               # React TypeScript Application
│   ├── src/
│   │   ├── components/     # UI Modules (Locker Grid, Payment)
│   │   └── pages/          # Main Application Flows
└── README.md

```

## Getting Started

### 1. Backend Setup

```bash
cd cloakbe_backend
pip install -r requirements.txt
python seed.py  # Initialize the demo locker layout
uvicorn app.main:app --reload

```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

## Engineering Highlights (Demo Focus)

* **Race Condition Prevention:** The allocation_service utilizes BEGIN IMMEDIATE transactions to ensure that if two users click the same locker at the same millisecond, only one booking succeeds.
* **Post-Pay Logic:** Unlike basic prototypes, Cloakbe calculates the final amount only at the point of pickup, ensuring fair billing for the exact duration used.
* **SMS Failover:** Features a built-in terminal simulator to ensure 100% demo reliability regardless of telecom DLT/KYC restrictions.

---

## Team: Code Gijutsu

* **Lead Developer:** Kishan K.
* **Frontend Developer:** Bhuvan J P.
* **UI-UX Designer:** Ananya.
* **Event:** Hack for Hire 2026.

---
