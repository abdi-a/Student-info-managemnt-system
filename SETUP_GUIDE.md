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

The backend has been initialized for you with Laravel 10.
The following configurations have been applied:
- Database connection in `.env`
- **Migrations** created for Users, Students, Instructors, Departments, Courses, etc.
- **Models** created in `app/Models/`.
- **API Routes** defined in `routes/api.php` with role-based middleware.
- **Controllers** created in `app/Http/Controllers/`.
- **Seeder** added to `database/seeders/DatabaseSeeder.php`.

### Next Steps for Backend:
1.  Open your terminal in `Student-info-managemnt-system/backend`:
    ```bash
    cd backend
    ```
2.  Run the migrations to create the database tables:
    ```bash
    php artisan migrate
    ```
3.  Seed the database with test data (Admin, Departments, etc.):
    ```bash
    php artisan db:seed
    ```
4.  Start the server:
    ```bash
    php artisan serve
    ```
    Your API will be available at `http://127.0.0.1:8000/api`.

---

## 4. Frontend Setup (Next.js)

The frontend has been initialized.
The following files have been created for you:
- `src/lib/axios.ts`: Axios instance configured for API requests.
- `src/app/login/page.tsx`: Login page connected to the backend.
- `src/app/dashboard/page.tsx`: Dashboard overview.
- `src/app/dashboard/layout.tsx`: Sidebar layout.

### Next Steps for Frontend:
1.  Open a new terminal in `Student-info-managemnt-system/frontend`:
    ```bash
    cd frontend
    ```
2.  Install Axios (required for API calls):
    ```bash
    npm install axios
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000/login` to test the login.

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
