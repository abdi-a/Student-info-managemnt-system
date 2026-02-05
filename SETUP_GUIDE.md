# Student Information Management System - Setup Guide

This guide describes how to set up the full-stack application (Laravel Backend + Next.js Frontend) from scratch.

## 1. Prerequisites

Before you begin, ensure you have the following installed:
1.  **XAMPP**: For the MySQL Database and PHP. [Download Here](https://www.apachefriends.org/index.html)
2.  **Composer**: Dependency Manager for PHP. [Download Here](https://getcomposer.org/)
3.  **Node.js & npm**: For the Next.js frontend. [Download Here](https://nodejs.org/)
4.  **Git**: For version control.

---

## 2. Database Setup

1.  Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2.  Open your browser and navigate to `http://localhost/phpmyadmin`.
3.  Click **New** to create a database.
4.  Database Name: `sims_db`
5.  Click **Create**.

---

## 3. Backend Setup (Laravel)

Run the following commands in your terminal (inside the root `Student-info-managemnt-system` folder) to generate the backend framework:

```bash
# Install Laravel Installer (if not installed)
composer global require laravel/installer

# Create the backend project
composer create-project laravel/laravel backend

# Enter the backend directory
cd backend

# Install API scaffolding (optional but recommended for API auth)
composer require laravel/sanctum
```

### Configure Environment
1.  Open `backend/.env` file.
2.  Update the database connection settings:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=sims_db
    DB_USERNAME=root
    DB_PASSWORD=
    ```

3.  Run migrations (detailed migration files are provided in `DATABASE_SCHEMA.md`):
    ```bash
    php artisan migrate
    ```

---

## 4. Frontend Setup (Next.js)

Open a new terminal in the root folder and run:

```bash
# Create Next.js app
npx create-next-app@latest frontend
```

**Prompts:**
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes** (Recommended)
- App Router: **Yes**
- Customize import alias: **No** (or default `@/*`)

---

## 5. Running the Application

**Terminal 1 (Backend):**
```bash
cd backend
php artisan serve
# Server running at http://127.0.0.1:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Server running at http://localhost:3000
```
