# 🚕 Masar API (Fleet Management System)

> A scalable, high-performance backend system for managing drivers, rides, and fleet operations. Built to simulate core functionalities of apps like **Uber** and **Mrsool**.

## 🛠 Tech Stack

The architecture follows the "Hard Way" learning path, focusing on manual implementation and deep understanding of backend concepts.

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL (Cloud-hosted on Neon.tech)
- **ORM:** TypeORM
- **Validation:** class-validator & class-transformer
- **Architecture:** Modular Monolith (Drivers, Rides, etc.)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/mohammadabdulhakim/masar-api.git](https://github.com/mohammadabdulhakim/masar-api.git)
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

The API will be accessible at `http://localhost:3000/api/v1` (if global prefix is set).

## 📍 Current Features (Phase 3)

* [x] **Project Scaffolding:** Custom module structure (`AppModule`, `DriversModule`).
* [x] **Global Configuration:** Centralized Environment Variables (`@nestjs/config`).
* [x] **Database Connectivity:** Asynchronous connection to PostgreSQL via TypeORM.
* [x] **Entities & Schema:** UUID-based `Driver` entity with JSONB support.
* [x] **Repository Pattern:** Decoupling business logic from database access.
* [x] **Error Handling:** Global Exception Filters (handling DB conflicts `23505`).
* [x] **Validation Pipelines:** Strict DTO validation with Whitelisting.
