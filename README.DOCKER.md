# Docker Setup for Clinic Appointment Booking System

## Option 1: Docker Compose (Recommended - Separate Services)

This setup runs frontend builder, backend, and MySQL in separate containers.

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Start

```bash
docker-compose up --build
```

### Access

- **App**: http://localhost:8000
- **MySQL**: localhost:3306

### Login Credentials
- Admin: `admin` / `admin123`
- Staff: `john@clinic.com` / `staff123`

### Stop

```bash
docker-compose down
```

### Database Management

```bash
# View logs
docker-compose logs -f backend

# Access MySQL
docker-compose exec mysql mysql -uroot -proot clinic

# Reset database
docker-compose down -v
docker-compose up --build
```

---

## Option 2: All-in-One Container

Single container with Node.js, PHP, Apache, and everything bundled.

### Build

```bash
docker build -f Dockerfile.all-in-one -t clinic-app .
```

### Run

```bash
docker run -it -p 8000:80 -e DB_HOST=host.docker.internal clinic-app
```

**Note:** For MySQL on host machine, use `DB_HOST=host.docker.internal` (Mac/Windows) or `DB_HOST=172.17.0.1` (Linux)

### Access

- **App**: http://localhost:8000

---

## Option 3: Individual Dockerfiles

For more control, build and run separately.

### Build Images

```bash
# Backend
docker build -f Dockerfile.backend -t clinic-backend .

# Frontend (optional)
docker build -f Dockerfile.frontend -t clinic-frontend .
```

### Run Backend

```bash
docker run -it \
  -p 8000:8000 \
  -e DB_HOST=mysql \
  -e DB_DATABASE=clinic \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=root \
  clinic-backend
```

---

## Environment Variables

Configure in `docker-compose.yml`:

```yaml
environment:
  DB_CONNECTION: mysql
  DB_HOST: mysql          # Service name in compose
  DB_DATABASE: clinic
  DB_USERNAME: clinic_user
  DB_PASSWORD: clinic_pass
  APP_DEBUG: "true"
```

---

## Troubleshooting

**Container exits immediately:**
```bash
docker-compose logs backend
```

**Database connection error:**
```bash
# Ensure MySQL is healthy
docker-compose ps
# Wait for MySQL to be ready (HEALTHCHECK)
```

**Frontend not loading:**
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up
```

**Permission denied errors:**
```bash
# Fix permissions
docker-compose exec backend chown -R www-data:www-data /app
```

---

## Production Deployment

For production, use:
- Nginx instead of Apache
- Separate database container
- Environment-specific .env files
- Health checks
- Restart policies

Example production compose file available on request.
