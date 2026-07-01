# BarberShop Booking System

A full-stack barber shop appointment booking system with role-based dashboards, real-time slot availability, and a modern responsive UI built with Angular 17 and Spring Boot.

---

## Live Demo

**Demo:** _[Add demo URL here]_

---

## Screenshots

### Homepage
> Hero section with "Fresh Cuts. Sharp Style." tagline, guest/login booking CTAs, and info cards for location, phone, and opening hours.

![Homepage](screenshots/homepage.png)

### Booking — Service Selection
> Clients choose from available services (Coupe Homme, Coloration Homme, Coupe + Barbe, Soin Capillaire), each showing duration and price in TND.

![Booking - Service Selection](screenshots/booking-services.png)

### Booking — Barber & Time Slot Selection
> After picking a service, clients select a barber and a date. Available 30-minute time slots appear dynamically — already-booked slots are greyed out.

![Booking - Time Slots](screenshots/booking-timeslots.png)

### Barber Dashboard
> Barbers see their appointments grouped by date with client info, service, and time. A confirmation modal shows full appointment details before confirming.

![Barber Dashboard](screenshots/barber-dashboard.png)

### Admin Dashboard
> Admins get a full overview: KPI cards (total, pending, confirmed, cancelled), a pending appointments queue with one-click confirm, a full filterable appointments table, top barbers list, a status donut chart, and popular services breakdown.

![Admin Dashboard](screenshots/admin-dashboard.png)

---

## Features

- **Public Booking** — Guests can book without creating an account
- **JWT Authentication** — Secure login/signup with role-based redirects
- **Role-Based Dashboards**
  - **Admin** — Full appointment management, KPI overview, barber/service analytics
  - **Barber** — Personal appointment list grouped by date, confirm/cancel flow
  - **Client** — Book appointments, view and manage personal bookings
- **Real-Time Slot Blocking** — Booked slots are grayed out dynamically per barber and date
- **Conflict Detection** — Backend prevents double-booking via overlap checks
- **Responsive Design** — Mobile-first UI with Tailwind CSS
- **Docker Ready** — Containerized frontend (Nginx) and backend for easy deployment

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 17, Tailwind CSS, TypeScript |
| **Backend** | Spring Boot 4.1, Java 21 |
| **Database** | MySQL 8.x |
| **Auth** | JWT (jjwt 0.11.5), Spring Security |
| **ORM** | Spring Data JPA / Hibernate |
| **Build** | Maven 3.9, npm |
| **Container** | Docker, Nginx |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 21+ |
| Node.js | 22+ |
| npm | 10+ |
| MySQL | 8.x |
| Docker | 24+ _(optional)_ |

---

## Project Structure

```
.
├── backend/
│   ├── src/main/java/com/barbershop/barber_booking_system/
│   │   ├── config/            # SecurityConfig, CorsConfig
│   │   ├── controllers/       # REST endpoints
│   │   ├── dto/               # Request/response DTOs
│   │   ├── entities/          # JPA entities (Appointment, Barber, User, HaircutType)
│   │   ├── repositories/      # Spring Data JPA repositories
│   │   └── services/          # Business logic + JwtService
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── homepage/
│   │   │   │   ├── booking/
│   │   │   │   ├── admin-dashboard/
│   │   │   │   ├── barber-dashboard/
│   │   │   │   └── authentification/
│   │   │   ├── guards/        # authGuard
│   │   │   ├── services/      # HTTP services
│   │   │   └── models/        # TypeScript interfaces
│   │   ├── assets/
│   │   └── environments/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
│
└── README.md
```

---

## Database Setup

### 1. Start MySQL and Create the Database

```sql
CREATE DATABASE barber_shop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optional: create a dedicated user instead of using root
CREATE USER 'barber_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON barber_shop_db.* TO 'barber_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure the Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/barber_shop_db
spring.datasource.username=barber_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your_super_secret_key_at_least_32_characters_long
jwt.expiration=86400000
```

> `ddl-auto=update` creates all tables automatically on first startup.

### 3. Database Schema

| Table | Key Columns |
|-------|-------------|
| `users` | `id`, `username`, `email`, `password` (BCrypt), `role` (ADMIN/BARBER/CLIENT) |
| `barbers` | `id`, `name`, `phone`, `active`, `user_id` (FK → users) |
| `haircut_types` | `id`, `name`, `price` (decimal), `duration` (minutes) |
| `appointments` | `id`, `client_name`, `client_phone`, `barber_id`, `haircut_type_id`, `appointment_date`, `start_time`, `end_time`, `status` |

Unique constraint on `(barber_id, appointment_date, start_time)` prevents double-bookings at the DB level.

### 4. Seed Data (Optional)

Run after first startup so JPA has created the tables:

```sql
-- Haircut services
INSERT INTO haircut_types (name, price, duration) VALUES
('Coupe Homme',    20.00, 45),
('Coloration Homme', 40.00, 60),
('Coupe + Barbe',  25.00, 60),
('Soin Capillaire', 50.00, 50);

-- Admin user  (use the /api/users endpoint or BCrypt a password manually)
-- Password below is BCrypt of "admin123"
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@barbershop.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN');

-- Barber user  (password: "barber123")
INSERT INTO users (username, email, password, role) VALUES
('barber1', 'barber1@barbershop.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'BARBER');

-- Barber profile linked to the barber user
INSERT INTO barbers (name, phone, active, user_id) VALUES
('Aymen Kefi', '+216 22 000 000', true, 2);
```

---

## Running the App

### Option 1 — Development

#### Backend

```bash
cd backend

# Run directly
./mvnw spring-boot:run

# Or build a JAR first
./mvnw clean package -DskipTests
java -jar target/barber_booking_system-0.0.1-SNAPSHOT.jar
```

Backend runs at `http://localhost:8080`

#### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:4200`

---

### Option 2 — Docker Compose

Create a `docker-compose.yml` at the project root:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: admin
      MYSQL_DATABASE: barber_shop_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/barber_shop_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: admin
      JWT_SECRET: your_super_secret_key_at_least_32_characters_long
      JWT_EXPIRATION: 86400000

  frontend:
    build:
      context: ./frontend
      args:
        API_URL: http://localhost:8080/api
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

```bash
docker-compose up -d
```

App available at `http://localhost`

---

## API Reference

**Base URL:** `http://localhost:8080/api`

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | `{ username, password }` | Login, returns JWT + user |
| `POST` | `/users` | `{ username, email, password, role }` | Register new user |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/appointments` | Get all appointments |
| `GET` | `/appointments/{id}` | Get appointment by ID |
| `POST` | `/appointments` | Create booking |
| `PUT` | `/appointments/{id}` | Update appointment |
| `DELETE` | `/appointments/{id}` | Delete appointment |
| `PATCH` | `/appointments/{id}/confirm` | Confirm appointment |
| `PATCH` | `/appointments/{id}/cancel` | Cancel appointment |
| `GET` | `/appointments/blocked-slots?date=YYYY-MM-DD&barberId={id}` | Get blocked time slots for a barber on a date |

### Barbers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/barbers` | All barbers |
| `GET` | `/barbers/active` | Active barbers only |
| `GET` | `/barbers/{id}` | Barber by ID |
| `GET` | `/barbers/{id}/name` | Barber name string |
| `GET` | `/barbers/{id}/appointments` | All appointments for a barber |
| `POST` | `/barbers` | Create barber |
| `PUT` | `/barbers/{id}` | Update barber |
| `DELETE` | `/barbers/{id}` | Delete barber |
| `PATCH` | `/barbers/{id}/activate` | Set barber active |
| `PATCH` | `/barbers/{id}/deactivate` | Set barber inactive |

### Services (Haircut Types)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/haircuts/services` | All services |
| `GET` | `/haircuts/{id}` | Service by ID |
| `POST` | `/haircuts` | Create service |
| `PUT` | `/haircuts/{id}` | Update service |
| `DELETE` | `/haircuts/{id}` | Delete service |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | All users |
| `GET` | `/users/{id}` | User by ID |
| `POST` | `/users` | Create user |
| `PUT` | `/users/{id}` | Update user |
| `DELETE` | `/users/{id}` | Delete user |

---

### Request / Response Examples

#### POST `/api/appointments`

```json
{
  "clientName": "Yesser Saidani",
  "clientPhone": "29337633",
  "clientEmail": "yesser@example.com",
  "barberId": 1,
  "haircutTypeId": 1,
  "date": "2026-07-01",
  "startTime": "09:00"
}
```

Response `201 Created`:

```json
{
  "id": 21,
  "clientName": "Yesser Saidani",
  "clientPhone": "29337633",
  "barberId": 1,
  "barberName": "Aymen Kefi",
  "haircutTypeId": 1,
  "haircutTypeName": "Coupe Homme",
  "date": "2026-07-01",
  "startTime": "09:00",
  "status": "PENDING"
}
```

#### POST `/api/auth/login`

```json
{ "username": "admin", "password": "admin123" }
```

Response `200 OK`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@barbershop.com",
    "role": "ADMIN",
    "barberId": null
  }
}
```

#### GET `/api/appointments/blocked-slots?date=2026-07-01&barberId=1`

Response `200 OK`:

```json
{
  "bookedSlots": [
    { "startTime": "09:00", "duration": 45 },
    { "startTime": "14:30", "duration": 60 }
  ]
}
```

---

## Appointment Status Flow

```
PENDING  ──► CONFIRMED ──► COMPLETED
   │
   └──────────────────────► CANCELLED
```

| Status | Description |
|--------|-------------|
| `PENDING` | Newly created, awaiting barber/admin confirmation |
| `CONFIRMED` | Confirmed by barber or admin |
| `COMPLETED` | Service delivered |
| `CANCELLED` | Cancelled by any party |

---

## User Roles & Access

| Role | Login Redirect | Capabilities |
|------|---------------|--------------|
| `ADMIN` | `/admin` | Full dashboard, confirm/cancel any appointment, view analytics |
| `BARBER` | `/barber` | Personal appointment list, confirm own bookings |
| `CLIENT` | `/booking` | Book appointments (with or without account) |

Guests (not logged in) can book via `/booking` as well — they provide their name, phone, and optional email directly in the form.

---

## Environment Configuration

### Backend — `application.properties`

| Property | Default | Notes |
|----------|---------|-------|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/barber_shop_db` | |
| `spring.datasource.username` | `root` | |
| `spring.datasource.password` | `admin` | Change in production |
| `jwt.secret` | `your_super_secret_key_...` | Must be ≥ 32 characters |
| `jwt.expiration` | `86400000` | Milliseconds — 24 hours |
| `server.port` | `8080` | |

### Frontend — `src/environments/environment.ts`

| Property | Default |
|----------|---------|
| `apiUrl` | `http://localhost:8080/api` |

---

## Production Checklist

- [ ] Replace `jwt.secret` with a securely generated key (≥ 256-bit)
- [ ] Use environment variables instead of hardcoding credentials
- [ ] Enable HTTPS on both frontend and backend
- [ ] Update CORS origins in `CorsConfig.java` to your production domain
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`) in production
- [ ] Use a strong MySQL password and restrict remote access

---

## Troubleshooting

**`Communications link failure` on startup**
MySQL is not running or the JDBC URL is wrong. Verify with:
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

**`CORS error` in browser**
The backend allows `http://localhost:4200` by default. Update `CorsConfig.java` with your actual frontend origin.

**`JWT signature does not match`**
All backend instances must use the same `jwt.secret` value.

**`Barber is already booked` conflict error**
The overlap check in `AppointmentService` is working correctly. The selected time range overlaps an existing non-cancelled booking.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

For support or inquiries: _[Add contact email]_
