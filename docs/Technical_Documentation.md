# Technical Documentation

## Development of a Multi-Branch Coffee Shop Management Web Application

**Project:** CoffeeHub  
**Student:** Diana Mamytova | Group: COM22  
**Adviser:** Nargiza Zhumalieva  
**Date:** April 2026  
**Production URL:** https://coffee-shop-diana.com

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [Authentication & Security](#7-authentication--security)
8. [API Reference](#8-api-reference)
9. [QR Code Ecosystem](#9-qr-code-ecosystem)
10. [Deployment & DevOps](#10-deployment--devops)
11. [Testing](#11-testing)
12. [Project Statistics](#12-project-statistics)

---

## 1. Project Overview

CoffeeHub is a full-stack web application designed for managing multi-branch coffee shop operations. The system provides centralized management of branches, menu items, table reservations, customer reviews, and analytics — all accessible through a modern responsive web interface.

### Core Functional Modules

| Module | Description |
|--------|-------------|
| **Authentication** | Email/password registration, JWT tokens, Google OAuth2 login |
| **Branch Management** | CRUD operations for coffee shop locations (SuperAdmin) |
| **Menu & Categories** | Category-based menu management with images, pricing, discounts |
| **Reservation Engine** | Anti-overlap table booking with time-slot validation |
| **Review System** | Customer reviews with star ratings and admin moderation |
| **Analytics Dashboard** | Reservation statistics, branch performance, rating distribution |
| **QR Code Ecosystem** | QR generation for tables, branches, and review submission |
| **File Upload** | Image upload and storage for branches and menu items |

### User Roles

| Role | Permissions |
|------|------------|
| **Guest** | Browse menu, view branches, view approved reviews |
| **User** | Register, login, make reservations, submit reviews, view dashboard |
| **Admin** | Manage menu, moderate reviews, manage reservations, view analytics |
| **SuperAdmin** | All Admin permissions + manage branches, manage administrators |

---

## 2. Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Programming language |
| Spring Boot | 3.4.1 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | Database access (Hibernate ORM) |
| PostgreSQL | 16 | Relational database |
| JWT (jjwt) | 0.12.5 | Stateless token authentication |
| OAuth2 Client | Spring Security | Google login integration |
| ZXing | 3.5.3 | QR code generation |
| Springdoc OpenAPI | 2.3.0 | Swagger API documentation |
| Lombok | 1.18.38 | Boilerplate code reduction |
| Maven | 3.9 | Build tool |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI framework |
| React Router | 6.22 | Client-side routing |
| Axios | 1.6.7 | HTTP client |
| Chart.js | 4.4.1 | Analytics charts |
| React Toastify | 10.0.4 | Toast notifications |

### DevOps & Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy, SSL termination, static file serving |
| Let's Encrypt | SSL/TLS certificates |
| Cloudflare | DNS management |
| Ubuntu 24.04 (VPS) | Production server |

---

## 3. System Architecture

### Architectural Pattern: Layered (N-Tier) Architecture

```
┌──────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                    │
│                  React SPA + Axios                     │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS
┌──────────────────────┴───────────────────────────────┐
│                  NGINX (Reverse Proxy)                 │
│  - SSL termination (Let's Encrypt)                    │
│  - Static file serving (React build)                  │
│  - API proxying (/api/* → backend:8081)               │
│  - OAuth2 proxying (/oauth2/*, /login/oauth2/*)       │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP (internal)
┌──────────────────────┴───────────────────────────────┐
│              SPRING BOOT APPLICATION                   │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │           Controller Layer (REST API)            │  │
│  │  AuthController, BranchController,               │  │
│  │  MenuItemController, ReservationController,      │  │
│  │  ReviewController, AnalyticsController,          │  │
│  │  QrCodeController, FileUploadController          │  │
│  └──────────────────────┬──────────────────────────┘  │
│  ┌──────────────────────┴──────────────────────────┐  │
│  │             Service Layer (Business Logic)       │  │
│  │  AuthService, BranchService, MenuItemService,    │  │
│  │  ReservationService, ReviewService,              │  │
│  │  AnalyticsService, QrCodeService                 │  │
│  └──────────────────────┬──────────────────────────┘  │
│  ┌──────────────────────┴──────────────────────────┐  │
│  │          Security Layer (JWT + OAuth2)           │  │
│  │  JwtTokenProvider, JwtAuthenticationFilter,      │  │
│  │  CustomUserDetails, SecurityConfig               │  │
│  └──────────────────────┬──────────────────────────┘  │
│  ┌──────────────────────┴──────────────────────────┐  │
│  │      Repository Layer (Spring Data JPA)          │  │
│  │  UserRepository, BranchRepository,               │  │
│  │  ReservationRepository, ReviewRepository, etc.   │  │
│  └──────────────────────┬──────────────────────────┘  │
└──────────────────────────┤───────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────┐
│                  PostgreSQL Database                    │
│  Tables: users, branches, coffee_tables, reservations, │
│          categories, menu_items, reviews               │
└──────────────────────────────────────────────────────┘
```

### Docker Architecture

```
┌─────────────────────────────────────────┐
│           docker-compose.prod.yml        │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ frontend │  │ backend  │  │postgres││
│  │ (nginx)  │  │(spring)  │  │  (db)  ││
│  │ :80/:443 │→ │ :8081    │→ │ :5432  ││
│  └──────────┘  └──────────┘  └────────┘│
│       ↓              ↓            ↓     │
│  /etc/letsencrypt  /app/uploads  pgdata │
└─────────────────────────────────────────┘
```

---

## 4. Database Design

### Entity-Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  users   │     │ branches │     │ coffee_tables│
├──────────┤     ├──────────┤     ├──────────────┤
│ id (PK)  │     │ id (PK)  │←────│ branch_id(FK)│
│ name     │     │ name     │     │ id (PK)      │
│ email(UQ)│     │ address  │     │ table_number │
│ password │     │ city     │     │ capacity     │
│ role     │     │ phone    │     │ is_available │
│ provider │     │ description│    └──────┬───────┘
│ created_at│    │ image_url │           │
└────┬─────┘     │ is_active │           │
     │           │ created_at│           │
     │           └─────┬─────┘           │
     │                 │                 │
     │    ┌────────────┤                 │
     │    │            │                 │
     │    ▼            ▼                 ▼
     │ ┌──────────┐ ┌──────────┐ ┌──────────────┐
     │ │categories│ │ reviews  │ │ reservations │
     │ ├──────────┤ ├──────────┤ ├──────────────┤
     │ │ id (PK)  │ │ id (PK)  │ │ id (PK)      │
     │ │ name     │ │ user_id  │←┤ user_id (FK) │
     │ │ descript.│ │ branch_id│ │ table_id (FK)│
     │ │branch_id │ │ rating   │ │ reserv._date │
     │ └────┬─────┘ │ comment  │ │ start_time   │
     │      │       │is_approved│ │ end_time     │
     │      ▼       │created_at│ │ guests_count │
     │ ┌──────────┐ └──────────┘ │ status       │
     │ │menu_items│              │ comment      │
     │ ├──────────┤              │ created_at   │
     │ │ id (PK)  │              └──────────────┘
     │ │ name     │
     │ │ descript.│   Status: PENDING | CONFIRMED
     │ │ price    │           CANCELLED | COMPLETED
     │ │ image_url│
     │ │is_available│
     │ │ discount │
     │ │category_id│
     │ │created_at│
     │ └──────────┘
     │
     └──→ Role: USER | ADMIN | SUPER_ADMIN
          Provider: local | google
```

### Table Definitions

#### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' |
| provider | VARCHAR(20) | NOT NULL, DEFAULT 'local' |
| provider_id | VARCHAR(255) | NULLABLE |
| created_at | TIMESTAMP | NOT NULL |

#### branches
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| address | VARCHAR(255) | NOT NULL |
| city | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | NULLABLE |
| description | TEXT | NULLABLE |
| image_url | VARCHAR(255) | NULLABLE |
| is_active | BOOLEAN | NOT NULL, DEFAULT true |
| created_at | TIMESTAMP | NOT NULL |

#### coffee_tables
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| table_number | INTEGER | NOT NULL |
| capacity | INTEGER | NOT NULL |
| is_available | BOOLEAN | NOT NULL, DEFAULT true |
| branch_id | BIGINT | FOREIGN KEY → branches(id) |

#### reservations
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| user_id | BIGINT | FOREIGN KEY → users(id) |
| coffee_table_id | BIGINT | FOREIGN KEY → coffee_tables(id) |
| reservation_date | DATE | NOT NULL |
| start_time | TIME | NOT NULL |
| end_time | TIME | NOT NULL |
| guests_count | INTEGER | NOT NULL |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' |
| comment | TEXT | NULLABLE |
| created_at | TIMESTAMP | NOT NULL |

#### categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| branch_id | BIGINT | FOREIGN KEY → branches(id) |

#### menu_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| price | DECIMAL(10,2) | NOT NULL |
| image_url | VARCHAR(255) | NULLABLE |
| is_available | BOOLEAN | NOT NULL, DEFAULT true |
| discount | DOUBLE | DEFAULT 0 |
| category_id | BIGINT | FOREIGN KEY → categories(id) |
| created_at | TIMESTAMP | NOT NULL |

#### reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| user_id | BIGINT | FOREIGN KEY → users(id) |
| branch_id | BIGINT | FOREIGN KEY → branches(id) |
| rating | INTEGER | NOT NULL (1-5) |
| comment | TEXT | NULLABLE |
| is_approved | BOOLEAN | NOT NULL, DEFAULT false |
| created_at | TIMESTAMP | NOT NULL |

---

## 5. Backend Implementation

### Package Structure

```
com.diana.coffee/
├── CoffeeShopApplication.java          # Main application entry point
├── config/
│   └── SwaggerConfig.java              # OpenAPI/Swagger configuration
├── controller/
│   ├── AuthController.java             # Authentication endpoints
│   ├── BranchController.java           # Branch CRUD
│   ├── CategoryController.java         # Category CRUD
│   ├── MenuItemController.java         # Menu item CRUD
│   ├── ReservationController.java      # Reservation management
│   ├── ReviewController.java           # Review management
│   ├── AnalyticsController.java        # Analytics endpoints
│   ├── QrCodeController.java           # QR code generation
│   ├── TableController.java            # Table management
│   └── FileUploadController.java       # Image upload
├── dto/
│   ├── request/                        # 10 request DTOs with validation
│   └── response/                       # 10 response DTOs
├── exception/
│   ├── GlobalExceptionHandler.java     # Centralized error handling
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── ReservationConflictException.java
├── model/
│   ├── User.java
│   ├── Branch.java
│   ├── CoffeeTable.java
│   ├── Reservation.java
│   ├── Category.java
│   ├── MenuItem.java
│   ├── Review.java
│   └── enums/
│       ├── Role.java                   # USER, ADMIN, SUPER_ADMIN
│       └── ReservationStatus.java      # PENDING, CONFIRMED, CANCELLED, COMPLETED
├── repository/                         # 7 JPA repository interfaces
├── security/
│   ├── SecurityConfig.java             # Spring Security configuration
│   ├── JwtTokenProvider.java           # JWT generation & validation
│   ├── JwtAuthenticationFilter.java    # JWT request filter
│   ├── CustomUserDetails.java          # UserDetails implementation
│   ├── CustomUserDetailsService.java   # UserDetailsService implementation
│   └── OAuth2AuthenticationSuccessHandler.java  # Google OAuth handler
└── service/                            # 9 service classes
```

### Key Implementation Details

#### Reservation Anti-Overlap Algorithm

The reservation system prevents double-booking through a custom JPQL query:

```java
@Query("SELECT r FROM Reservation r WHERE r.coffeeTable.id = :tableId " +
       "AND r.reservationDate = :date " +
       "AND r.status = :status " +
       "AND r.startTime < :endTime " +
       "AND r.endTime > :startTime")
List<Reservation> findOverlapping(
    @Param("tableId") Long tableId,
    @Param("date") LocalDate date,
    @Param("startTime") LocalTime startTime,
    @Param("endTime") LocalTime endTime,
    @Param("status") ReservationStatus status
);
```

This query checks for any existing CONFIRMED reservations that overlap with the requested time slot. The overlap condition `(existing.start < new.end AND existing.end > new.start)` covers all possible overlap scenarios.

#### Global Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Handles: MethodArgumentNotValidException → 400
    //          ResourceNotFoundException → 404
    //          BadRequestException → 400
    //          ReservationConflictException → 409
    //          AccessDeniedException → 403
    //          AuthenticationException → 401
    //          Exception (generic) → 500
}
```

---

## 6. Frontend Implementation

### Component Architecture

```
src/
├── App.js                      # Root component with routing
├── App.css                     # Global styles (2185 lines)
├── api/
│   └── axios.js                # Axios instance with JWT interceptor
├── context/
│   └── AuthContext.js           # Authentication state management
├── components/
│   ├── Navbar.js                # Responsive navigation (hamburger on mobile)
│   ├── Footer.js                # Site footer
│   ├── AdminLayout.js           # Admin sidebar wrapper
│   ├── PrivateRoute.js          # Auth-protected route guard
│   └── AdminRoute.js            # Admin-only route guard
└── pages/
    ├── HomePage.js              # Landing page with hero, branches, ritual
    ├── MenuPage.js              # Menu browsing with category filters
    ├── BranchPage.js            # Branch detail with reviews
    ├── BranchesPage.js          # All branches listing
    ├── LoginPage.js             # Login with Google OAuth
    ├── RegisterPage.js          # Registration with Google OAuth
    ├── ReservationPage.js       # Table booking form
    ├── UserDashboard.js         # User's reservations and reviews
    ├── ReviewPage.js            # Review submission form
    ├── OAuth2Redirect.js        # OAuth2 callback handler
    ├── NotFoundPage.js          # 404 page
    ├── AdminPanel.js            # Admin dashboard with stats
    ├── AdminMenuPage.js         # Menu CRUD management
    ├── AdminReservationsPage.js # Reservation management
    ├── AdminReviewsPage.js      # Review moderation
    ├── AdminAnalyticsPage.js    # Analytics with charts
    ├── AdminBranchesPage.js     # Branch management
    └── AdminQrPage.js           # QR code generation & download
```

### Routing Structure

| Path | Component | Access |
|------|-----------|--------|
| `/` | HomePage | Public |
| `/menu` | MenuPage | Public |
| `/menu/:branchId` | MenuPage | Public |
| `/branches` | BranchesPage | Public |
| `/branch/:branchId` | BranchPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/reservation` | ReservationPage | Authenticated |
| `/dashboard` | UserDashboard | Authenticated |
| `/review` | ReviewPage | Authenticated |
| `/oauth2/redirect` | OAuth2Redirect | Public |
| `/admin` | AdminPanel | Admin/SuperAdmin |
| `/admin/menu` | AdminMenuPage | Admin/SuperAdmin |
| `/admin/reservations` | AdminReservationsPage | Admin/SuperAdmin |
| `/admin/reviews` | AdminReviewsPage | Admin/SuperAdmin |
| `/admin/analytics` | AdminAnalyticsPage | Admin/SuperAdmin |
| `/admin/branches` | AdminBranchesPage | Admin/SuperAdmin |
| `/admin/qr` | AdminQrPage | Admin/SuperAdmin |
| `*` | NotFoundPage | Public |

### Design System

The UI follows a warm coffee-shop aesthetic derived from Figma mockups:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FFF8F6` | Page background |
| Primary | `#6F4E37` | Buttons, headings, accents |
| Sidebar | `#422B22` | Admin sidebar |
| Accent | `#D4A574` | Stars, highlights, borders |
| Cream | `#FFF1EC` | Footer, sections |
| Text | `#1c1917` | Primary text |
| Text Secondary | `#78716c` | Descriptions |
| Border | `#e7e5e4` | Input borders, dividers |
| Card Radius | `24px` | Card components |
| Button Radius | `12px` | Buttons, inputs |

---

## 7. Authentication & Security

### JWT Authentication Flow

```
1. User submits credentials (POST /api/auth/login)
2. Server validates credentials via AuthenticationManager
3. Server generates JWT token (HS256, 24h expiry)
4. Client stores token in localStorage
5. Axios interceptor attaches "Authorization: Bearer <token>" to all requests
6. JwtAuthenticationFilter validates token on each request
7. SecurityContext populated with user details
```

### Google OAuth2 Flow

```
1. User clicks "Sign in with Google" → redirected to /oauth2/authorization/google
2. Nginx proxies to Spring Boot → redirects to Google accounts
3. User authorizes → Google redirects to /login/oauth2/code/google
4. Spring exchanges code for user info (email, name)
5. User created/found in database (provider="google")
6. JWT token generated → redirect to /oauth2/redirect?token=...
7. React saves token → navigates to dashboard
```

### Security Configuration

```java
// Public endpoints (no auth required):
/api/auth/**, /api/menu/**, /api/categories/**,
/api/branches/**, /api/tables/**, /api/reviews/branch/**,
/api/qr/**, /api/upload/**, /swagger-ui/**, /v3/api-docs/**

// Admin endpoints (ADMIN or SUPER_ADMIN role):
/api/admin/**

// SuperAdmin endpoints:
/api/super-admin/**

// All other endpoints: authenticated
```

### CORS Configuration

Allowed origins: `localhost:*`, `coffee-shop-diana.com`  
Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS  
Credentials: enabled  
Max age: 3600 seconds

---

## 8. API Reference

### Authentication

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password}` | No | Register new user |
| POST | `/api/auth/login` | `{email, password}` | No | Login, returns JWT |
| GET | `/api/auth/me` | — | Yes | Get current user profile |

### Branches

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/branches` | No | List all active branches |
| GET | `/api/branches/{id}` | No | Get branch details |
| POST | `/api/branches` | SuperAdmin | Create branch |
| PUT | `/api/branches/{id}` | SuperAdmin | Update branch |
| DELETE | `/api/branches/{id}` | SuperAdmin | Soft-delete branch |

### Tables

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tables/branch/{branchId}` | No | List tables by branch |
| GET | `/api/tables/branch/{branchId}/available` | No | List available tables |
| POST | `/api/tables` | Admin | Create table |
| PUT | `/api/tables/{id}` | Admin | Update table |
| DELETE | `/api/tables/{id}` | Admin | Delete table |

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | No | List all categories |
| GET | `/api/categories/branch/{branchId}` | No | Categories by branch |
| GET | `/api/categories/{id}` | No | Get category |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/{id}` | Admin | Update category |
| DELETE | `/api/categories/{id}` | Admin | Delete category |

### Menu Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/menu` | No | List all menu items |
| GET | `/api/menu/branch/{branchId}` | No | Items by branch |
| GET | `/api/menu/category/{categoryId}` | No | Items by category |
| GET | `/api/menu/{id}` | No | Get item details |
| POST | `/api/menu` | Admin | Create item |
| PUT | `/api/menu/{id}` | Admin | Update item |
| DELETE | `/api/menu/{id}` | Admin | Delete item |

### Reservations

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/reservations` | `{coffeeTableId, reservationDate, startTime, endTime, guestsCount, comment}` | User | Create reservation |
| GET | `/api/reservations/my` | — | User | My reservations |
| GET | `/api/reservations` | — | Admin | All reservations |
| GET | `/api/reservations/branch/{branchId}` | — | Admin | By branch |
| PUT | `/api/reservations/{id}/status` | `{status}` | Admin | Update status |
| PUT | `/api/reservations/{id}/cancel` | — | User | Cancel reservation |
| DELETE | `/api/reservations/{id}` | — | Admin | Delete reservation |

### Reviews

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/reviews` | `{branchId, rating, comment}` | User | Submit review |
| GET | `/api/reviews/branch/{branchId}` | — | No | Approved reviews |
| GET | `/api/reviews/my` | — | User | My reviews |
| GET | `/api/reviews/pending` | — | Admin | Pending reviews |
| PUT | `/api/reviews/{id}/moderate` | `{approved}` | Admin | Approve/reject |
| DELETE | `/api/reviews/{id}` | — | Admin | Delete review |

### Analytics

| Method | Endpoint | Params | Auth | Description |
|--------|----------|--------|------|-------------|
| GET | `/api/analytics/branch/{branchId}` | `from`, `to` (dates) | Admin | Branch analytics |
| GET | `/api/analytics/branch/{branchId}/daily` | `date` | Admin | Daily count |

### QR Codes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/qr/table/{tableId}` | No | QR → menu page |
| GET | `/api/qr/branch/{branchId}` | No | QR → branch page |
| GET | `/api/qr/review/{branchId}` | No | QR → review form |

### File Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | No | Upload image file |
| GET | `/api/upload/files/{filename}` | No | Serve uploaded file |

**Total: 46 API endpoints**

---

## 9. QR Code Ecosystem

The QR code module generates PNG images using the ZXing library. Each QR code encodes a URL that directs users to specific pages:

| QR Type | URL Pattern | Use Case |
|---------|-------------|----------|
| Table QR | `https://coffee-shop-diana.com/menu?table={id}` | Placed on each table for direct menu access |
| Branch QR | `https://coffee-shop-diana.com/branch/{id}` | Marketing materials, storefronts |
| Review QR | `https://coffee-shop-diana.com/review?branch={id}` | Receipts, table tents for feedback |

The admin panel provides a dedicated QR Management page (`/admin/qr`) where administrators can:
- Select a branch
- View and download QR codes for the branch landing page and review submission
- View and download QR codes for each individual table
- Batch download all table QR codes

---

## 10. Deployment & DevOps

### Production Infrastructure

| Component | Specification |
|-----------|--------------|
| VPS | Ubuntu 24.04, 8GB RAM, 145GB SSD |
| IP | 161.97.88.1 |
| Domain | coffee-shop-diana.com |
| DNS | Cloudflare (Free plan) |
| SSL | Let's Encrypt (auto-renewal via Certbot) |

### Docker Compose Services

```yaml
services:
  postgres:     # PostgreSQL 16 Alpine
  backend:      # Spring Boot (JDK 21), port 8081 internal
  frontend:     # Nginx + React build, ports 80/443
```

### Nginx Configuration

- HTTP → HTTPS redirect (301)
- SSL termination with Let's Encrypt certificates
- Reverse proxy: `/api/*` → backend:8081
- OAuth2 proxy: `/oauth2/*`, `/login/oauth2/*` → backend:8081
- SPA fallback: all other routes → `index.html`
- Static asset caching: 1 year with immutable header

### Deployment Process

```bash
# 1. Upload code
rsync -avz --checksum --exclude='node_modules,build,target,.git' \
  . root@161.97.88.1:/root/coffeehub/

# 2. Build and deploy
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# 3. SSL certificate renewal
certbot renew --quiet
```

---

## 11. Testing

### Validation Strategy

**Schema Validation (DTO Layer)**
- Jakarta Bean Validation annotations: `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Max`, `@NotNull`, `@DecimalMin`, `@Future`
- Global exception handler returns structured error responses for validation failures

**Business Logic Validation (Service Layer)**
- Email uniqueness check on registration
- Reservation time overlap detection
- Guest count vs table capacity validation
- Start time must be before end time
- Reservation date must be in the future

**Database Constraints**
- NOT NULL, UNIQUE, FOREIGN KEY constraints
- TEXT column types for long descriptions
- Enum types for roles and reservation statuses

**Frontend Validation**
- Required field validation
- Character limits with visual counters
- Phone format validation
- Real-time error display on blur

### API Integration Testing

All 46 API endpoints were tested through automated curl-based test scripts covering:
- User registration and login flow
- CRUD operations for all entities
- CORS preflight requests (OPTIONS)
- Admin role-based access control
- Reservation creation with conflict detection
- Review submission and moderation workflow
- Analytics data retrieval
- QR code generation
- File upload

---

## 12. Project Statistics

| Metric | Count |
|--------|-------|
| **Backend Java files** | 67 |
| **Frontend JS files** | 27 |
| **Total Java lines** | 2,838 |
| **Total JavaScript lines** | 6,146 |
| **Total CSS lines** | 2,185 |
| **API endpoints** | 46 |
| **Database tables** | 7 |
| **JPA entities** | 7 |
| **REST controllers** | 10 |
| **Service classes** | 9 |
| **Repository interfaces** | 7 |
| **Request DTOs** | 10 |
| **Response DTOs** | 10 |
| **React pages** | 18 |
| **React components** | 5 |
| **User roles** | 3 |
| **Figma design screens** | 16+ |

---

*Document generated for the diploma project: "Development of a Multi-Branch Coffee Shop Management Web Application Using Spring Boot and REST Architecture"*

*© 2026 Diana Mamytova, Ala-Too International University*
