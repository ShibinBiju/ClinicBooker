# Clinic Appointment Booking System

## Current Status
✅ **Laravel 11 Backend Only** - All backend logic runs exclusively in Laravel
✅ **Full-Stack Functional** - React frontend + Laravel API on port 5000
✅ **Database** - MySQL (not PostgreSQL) with migrations and models
✅ **Features** - Patient booking, admin dashboard, staff management
✅ **Fixed** - Startup script now builds React and deploys to Laravel properly

## Running the System

### Automatic Startup (Recommended)
The app automatically builds React and starts Laravel when you click "Run":
```bash
npm run dev
```

### Manual Build & Start
```bash
./dev-start.sh
```

This script:
1. Installs React dependencies
2. Builds React frontend to `dist/`
3. Copies built files to `backend-laravel/public/`
4. Starts Laravel PHP server on port 5000

## Project Structure
- `/backend-laravel/` - Laravel 11 application (exclusive backend)
  - `/app/Models/` - Eloquent models
  - `/app/Http/Controllers/` - API controllers
  - `/routes/api.php` - API routes
  - `/public/` - Frontend assets served here
  
- `/client/` - React frontend (Vite + TypeScript)
- `/shared/` - Shared data models and schemas

## Architecture
- **Backend**: Laravel 11 running on port 5000
  - RESTful API for appointments and doctors
  - Admin authentication
  - Staff dashboard for making appointments
  
- **Frontend**: React + Vite (built and served by Laravel)
  - Patient booking interface
  - Admin login and management
  - Staff appointment creation

## Credentials
- Admin Login: `admin` / `admin123`
- Staff Login: `staff` / `staff123`

## Technology Stack
- **Backend**: Laravel 11 (PHP)
- **Frontend**: React 19 + TypeScript + Vite
- **Database**: PostgreSQL (Neon)
- **ORM**: Eloquent (Laravel)
