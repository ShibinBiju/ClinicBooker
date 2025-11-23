# Clinic Appointment Booking System

## Current Status
✅ **Laravel 11 Backend Only** - All backend logic runs exclusively in Laravel
✅ **Full-Stack Functional** - React frontend + Laravel API on port 5000
✅ **Database** - PostgreSQL (Neon) with migrations and models
✅ **Features** - Patient booking, admin dashboard, staff management

## Running the System

### Start Laravel Backend
```bash
cd backend-laravel
php -S 0.0.0.0:5000 -t public
```

Or use the startup script:
```bash
./start-dev.sh  # Starts Laravel on port 5000
```

## Project Structure
- `/backend-laravel/` - Laravel 11 application (models, controllers, routes)
- `/client/` - React frontend (Vite + TypeScript)
- `/shared/` - Shared data models and schemas
- `/server/` - Express proxy configuration (frontend only, no API logic)

## Architecture
- **Backend**: Laravel 11 running on port 5000
  - RESTful API for appointments and doctors
  - Admin authentication (username: admin, password: admin123)
  - Staff dashboard for making appointments
  
- **Frontend**: React + Vite (served by Laravel)
  - Patient booking interface
  - Admin login and management
  - Staff appointment creation

## Recent Changes
- Switched to Laravel 11 as exclusive backend (no Express API logic)
- Laravel serves both static frontend assets and API endpoints
- Simplified deployment by removing Express middleware complexity
- PHP built-in server for development

## Previous Architecture (Legacy)
- Express.js with direct database handlers (replaced by Laravel)
- Can be found in older code branches
