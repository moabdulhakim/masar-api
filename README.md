# 🚕 Masar API (Fleet Management System)

> A scalable, high-performance backend system for managing drivers, rides, and fleet operations. Built to simulate core functionalities of apps like **Uber** and **Mrsool**.

## 🛠 Tech Stack

The architecture follows the "Hard Way" learning path, focusing on manual implementation and deep understanding of backend concepts.

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL (Cloud-hosted on Neon.tech)
- **ORM:** TypeORM with migrations support
- **Authentication:** JWT (JSON Web Tokens) with access/refresh token pattern
- **Password Hashing:** Argon2
- **Validation:** class-validator & class-transformer
- **Architecture:** Modular Monolith (Auth, Users, Drivers, Rides, Sessions)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/moabdulhakim/masar-api.git
cd masar-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup (Important 🔐)

Create a `.env` file in the root directory. You will need a PostgreSQL connection string (e.g., from Neon.tech).

```env
# .env
DATABASE_URL="postgres://user:password@host/database?sslmode=require"
JWT_SECRET=73d895c51601bceebf80f6432e953d9f6a49f070423da2dcd9e04cb1cb762354
JWT_EXPIRATION_TIME="1d"
```

### 4. Run the application

```bash
# Development mode
npm run start:dev
```

The API will be accessible at `http://localhost:3000/api/v1`.

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)
- **POST** `/register` - Register a new user
- **POST** `/login` - Login and receive access/refresh tokens
- **POST** `/logout` - Logout and invalidate session (requires refresh token)
- **POST** `/refresh-tokens` - Refresh access token (requires refresh token)

### Drivers (`/api/v1/drivers`)
- **POST** `/` - Create a new driver profile

### Rides (`/api/v1/rides`)
- **GET** `/` - Get all rides
- **POST** `/` - Create a new ride request
- **POST** `/:rideId/accept` - Accept a ride (requires authentication)

### Sessions (`/api/v1/sessions`)
- **GET** `/user` - Get current user's sessions (requires authentication)

## 🗃️ Data Model

### Entities
- **User:** Core user entity with email, phone, password, roles, and location
- **Driver:** Extended driver profile with vehicle info, ratings, and availability
- **Ride:** Ride requests with locations, status, cost, and optimistic locking
- **UserSession:** Session tracking with refresh tokens, device info, and IP addresses

### Key Features
- **Multi-Role Users:** Users can have multiple roles (driver, rider, admin)
- **JSONB Fields:** Flexible location and configuration storage
- **Optimistic Locking:** Prevents race conditions in concurrent ride acceptance
- **Cascade Deletes:** Automatic cleanup of related data
- **UUID Primary Keys:** Secure and globally unique identifiers

## 📍 Current Features

### Core Infrastructure
* [x] **Project Scaffolding:** Modular architecture with multiple feature modules
* [x] **Global Configuration:** Centralized environment variables with `@nestjs/config`
* [x] **Database Connectivity:** Asynchronous PostgreSQL connection via TypeORM
* [x] **API Versioning:** URI-based versioning (v1)
* [x] **Error Handling:** Global exception filters for PostgreSQL errors
* [x] **Validation Pipelines:** Strict DTO validation with whitelisting

### Authentication & Authorization
* [x] **JWT Authentication:** Access and refresh token implementation
* [x] **User Registration:** Register users with email, phone, and password
* [x] **User Login:** Authenticate users and issue JWT tokens
* [x] **Token Refresh:** Refresh access tokens using refresh tokens
* [x] **Logout:** Invalidate user sessions
* [x] **Password Hashing:** Secure password storage using Argon2
* [x] **JWT Guards:** Route protection with JWT authentication guards

### User Management
* [x] **User Entity:** UUID-based users with roles (driver, rider, admin)
* [x] **User Roles:** Multi-role support per user
* [x] **Location Tracking:** JSONB-based location storage
* [x] **User Status:** Online/offline status tracking

### Driver Management
* [x] **Driver Profiles:** Extended user profiles for drivers
* [x] **Vehicle Types:** Support for different vehicle types (car, motorcycle, etc.)
* [x] **Driver Ratings:** 5-star rating system
* [x] **Availability Management:** Track driver availability status
* [x] **Working Hours:** JSONB-based working hours configuration
* [x] **Driver License:** License ID validation and storage

### Ride Management
* [x] **Ride Creation:** Create ride requests with start/end locations
* [x] **Ride Listing:** Retrieve all available rides
* [x] **Ride Acceptance:** Drivers can accept ride requests
* [x] **Ride Status:** Track ride lifecycle (requested, pending, completed, etc.)
* [x] **Optimistic Locking:** Prevent race conditions during ride acceptance
* [x] **Transaction Management:** Atomic ride acceptance with database transactions
* [x] **Location Storage:** JSONB-based start/end location tracking

### Session Management
* [x] **Session Tracking:** Track user sessions with device and location info
* [x] **User Agent Storage:** Store client device information
* [x] **IP Address Tracking:** Track session IP addresses
* [x] **Session Listing:** Users can view their active sessions
* [x] **Refresh Token Management:** Secure refresh token storage per session


---

## 🚀 What's Next? (Building V2)

This repository serves as my solid learning ground for core backend concepts. 

Note: the data model in V1 was intentionally kept simple as a learning ground. V2 restructures the schema with PostGIS, a proper ledger system, and a cleaner domain model.

Active development goals include:

* **Real-Time Tracking:** Replacing basic location updates with **WebSockets** for live driver tracking.
* **Geospatial Queries:** Migrating location data to **PostGIS** to efficiently query "nearest drivers" without overloading the database.
* **Safe Financials:** Building a basic Wallet/Ledger system, continuing to rely on database transactions and locking to safely handle mock payments.
* **AI Integration:** Collaborating to integrate a basic ride-matching algorithm to connect riders and drivers smartly.

*We are building this iteratively, focusing on clean code and practical problem-solving rather than over-engineering.*
