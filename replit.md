# Clinic Appointment Booking System

## Current Status
✅ **Laravel 11 Backend Only** - All backend logic runs exclusively in Laravel
✅ **Full-Stack Functional** - React frontend + Laravel API on port 5000
✅ **Database** - PostgreSQL (Neon) with migrations and models
✅ **Features** - Patient booking, admin dashboard, staff management

## Running the System

### Build Frontend & Start Laravel
```bash
npm run build
cp -r dist/public/* backend-laravel/public/
cd backend-laravel
php -S 0.0.0.0:5000 -t public
```

Or use the startup script:
```bash
cd backend-laravel
./dev-start.sh
```

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
