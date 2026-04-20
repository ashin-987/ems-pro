# EMS Pro — Enterprise Employee Management System

A production-grade full-stack Employee Management System rebuilt from the ground up.
**Java Spring Boot** backend · **React + Tailwind CSS** frontend · **MySQL** database.

---

## What changed from the original

| Issue in Original | How it's fixed |
|---|---|
| SQL Injection via string concatenation | Spring Data JPA / JPQL parameterized queries — zero raw SQL |
| Plain-text password in DB | BCrypt (strength 12) via Spring Security |
| Hardcoded DB credentials in source code | `application.properties` with env-var overrides (`DB_URL`, `DB_PASSWORD`) |
| No architecture — UI + DB in same class | Layered: Controller → Service → Repository → Entity |
| New DB connection on every operation | HikariCP connection pool (built-in to Spring Boot) |
| Random, collision-prone employee IDs | UUID v4 primary keys + sequential `EMP-YY-XXXX` display codes |
| No input validation | Bean Validation (`@Email`, `@NotBlank`, `@Pattern`, `@Size`) on every DTO |
| No error handling (just `printStackTrace`) | `@RestControllerAdvice` global handler — clean JSON errors always |
| Entity objects sent to the client | DTO pattern — entities never leave the service layer |
| Swing UI (absolute-positioned, no responsive) | React 18 + Vite + Tailwind CSS — modern, responsive, accessible |
| No authentication/authorization | JWT stateless auth + Spring Security role-based access (`ADMIN`, `HR`, `MANAGER`, `VIEWER`) |
| No search or pagination | Full-text JPQL search + server-side pagination + sorting |
| No dashboard | Live dashboard with stats cards, bar chart, and department donut chart |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                  │
│  Login → Dashboard → Employee List → Add/Edit Forms     │
│  React Router v6 · React Hook Form · Recharts · Axios   │
└─────────────────────┬───────────────────────────────────┘
                      │  REST API  (JSON / HTTP)
                      │  Authorization: Bearer <JWT>
┌─────────────────────▼───────────────────────────────────┐
│               Spring Boot 3 Backend                      │
│                                                          │
│  AuthController   EmployeeController   DashboardCtrl    │
│       │                  │                   │           │
│  AuthService         EmployeeService    DashboardSvc    │
│       │                  │                   │           │
│  UserRepository    EmployeeRepository  ───────────┘      │
│       │                  │                               │
│  Spring Security    Spring Data JPA (Hibernate)          │
│  JWT Filter         HikariCP Connection Pool             │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 MySQL 8 Database                         │
│   ems_db.users          ems_db.employees                 │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
ems-pro/
├── backend/                          ← Spring Boot Maven project
│   ├── pom.xml
│   └── src/main/java/com/ems/
│       ├── EmsApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java   ← JWT, CORS, role rules
│       │   └── DataInitializer.java  ← Seeds default admin on startup
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── EmployeeController.java
│       │   └── DashboardController.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── EmployeeService.java
│       │   └── DashboardService.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── EmployeeRepository.java   ← custom JPQL search
│       ├── entity/
│       │   ├── Employee.java
│       │   └── User.java
│       ├── dto/
│       │   ├── request/  (LoginRequest, EmployeeRequest)
│       │   └── response/ (ApiResponse, AuthResponse, EmployeeResponse, DashboardResponse)
│       ├── security/
│       │   ├── JwtTokenProvider.java
│       │   ├── JwtAuthenticationFilter.java
│       │   └── CustomUserDetailsService.java
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           └── ResourceNotFoundException.java
│
├── frontend/                         ← React + Vite + Tailwind
│   ├── src/
│   │   ├── api/axiosInstance.js      ← JWT interceptor + auto-logout
│   │   ├── context/AuthContext.jsx   ← Global auth state
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui/index.jsx          ← Reusable FormField, Modal, StatusBadge…
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       └── employees/
│   │           ├── EmployeeList.jsx  ← Search, filter, paginate, delete
│   │           ├── EmployeeForm.jsx  ← Shared validated form
│   │           ├── AddEmployee.jsx
│   │           └── EditEmployee.jsx
│   └── package.json
│
├── database/
│   └── schema.sql                    ← One-time DB creation script
└── README.md
```

---

## Setup & Running

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

### 1 — Database

```bash
mysql -u root -p < database/schema.sql
```

---

### 2 — Backend

```bash
cd backend

# Set your DB password (or edit application.properties)
export DB_PASSWORD=your_mysql_password

mvn spring-boot:run
```

The server starts on **http://localhost:8080**.

On first run, Hibernate auto-creates the tables and `DataInitializer` seeds:
```
Username: admin
Password: Admin@123   ← change this immediately
```

**Environment variables** (override `application.properties`):

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/ems_db?...` | Full JDBC URL |
| `DB_USERNAME` | `root` | DB user |
| `DB_PASSWORD` | *(must set)* | DB password |
| `JWT_SECRET` | *(change in prod)* | HMAC secret for JWT signing |

---

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:5173**. Vite proxies all `/api/*` calls to the Spring Boot backend automatically.

---

## API Reference

### Auth
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | `{ username, password }` | Returns JWT token |

### Employees  *(requires Bearer token)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | Search + paginate. Params: `search`, `status`, `department`, `page`, `size`, `sortBy`, `sortDir` |
| `POST` | `/api/employees` | Create employee (ADMIN, HR) |
| `GET` | `/api/employees/{id}` | Get by ID |
| `PUT` | `/api/employees/{id}` | Update (ADMIN, HR) |
| `DELETE` | `/api/employees/{id}` | Delete (ADMIN only) |

### Dashboard  *(requires Bearer token)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Stats, department breakdown, monthly joinings |

---

## Security Model

| Role | View | Add / Edit | Delete | Dashboard |
|---|---|---|---|---|
| `ADMIN` | ✅ | ✅ | ✅ | ✅ |
| `HR` | ✅ | ✅ | ❌ | ✅ |
| `MANAGER` | ✅ | ❌ | ❌ | ✅ |
| `VIEWER` | ✅ | ❌ | ❌ | ❌ |

---

## Building for Production

```bash
# Frontend build
cd frontend && npm run build
# Static files appear in frontend/dist/

# Backend JAR
cd backend && mvn clean package -DskipTests
java -jar target/employee-management-system-1.0.0.jar \
     --DB_PASSWORD=secret \
     --JWT_SECRET=your-super-long-random-secret
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language (backend) | Java 17 |
| Framework | Spring Boot 3.2 |
| Security | Spring Security 6 + JJWT 0.11 |
| ORM | Spring Data JPA / Hibernate 6 |
| DB | MySQL 8 + HikariCP |
| Validation | Jakarta Bean Validation |
| Language (frontend) | JavaScript (ES2022) |
| UI Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Forms | React Hook Form 7 |
| HTTP client | Axios 1.6 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Notifications | React Hot Toast |
