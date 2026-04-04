# 📝 REVIEWSAVER — Backend API

> **Authentication + Reviews + AI Recommendations**  
> A secure, full-stack review platform built with Spring Boot, PostgreSQL, and a three-tier AI recommendation engine.

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.11-brightgreen?style=flat-square&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?style=flat-square&logo=postgresql)
![React](https://img.shields.io/badge/Frontend-React%2018.3-61DAFB?style=flat-square&logo=react)
![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)
![Frontend on Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=flat-square&logo=netlify)

---

## 🔗 Live Demo

| Layer | URL |
|---|---|
| Frontend | [authreview-reviewsaver-ari-cc660f.netlify.app](https://authreview-reviewsaver-ari-cc660f.netlify.app) |
| Backend API | Hosted on Render |

---

## 📖 Project Report

The full academic project report is available here:  
📄 **[Project Report (GROUP-129).pdf](https://github.com/user-attachments/files/26483637/Project.Report.GROUP-129.pdf)**

> _Submitted to VIT Bhopal University, School of Computing Science and Engineering, April 2026._

---

## 📐 System Diagrams

### Use Case Diagram
> Illustrates all interactions between Guest users, Authenticated users, and the System.

<img width="760" height="800" alt="3_Use_Case_Diagram" src="https://github.com/user-attachments/assets/54dfbd48-6919-4fe7-a828-d2500f1de863" />

### Data Flow Diagram
> Shows the authentication flow (JWT + OTP) and the review + AI recommendation pipeline.

<img width="760" height="800" alt="4_Data_Flow_Diagram" src="https://github.com/user-attachments/assets/b5153e5a-f3f5-4f06-91e3-9d492bf0a0ec" />
---


## 📋 Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [AI Recommendation Engine](#-ai-recommendation-engine)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Performance](#-performance)
- [Team](#-team)

---

## 🧠 About

**REVIEWSAVER** is a full-stack web application that solves a real problem: existing review platforms suffer from fake reviews, poor authentication, and generic recommendations. REVIEWSAVER addresses all three by combining:

- **Multi-factor authentication** (JWT + OTP via Gmail SMTP) to ensure only verified users submit reviews
- **Full review management** (CRUD, search, filtering, voting) across 5 categories
- **A three-tier AI recommendation engine** that personalizes suggestions based on user engagement level

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.5.11, Spring Security, Spring Data JPA, Hibernate |
| Frontend | React 18.3, React Router 6.30 |
| Database | PostgreSQL 17 |
| Authentication | JWT (JSON Web Tokens), BCrypt, Gmail SMTP (OTP) |
| Deployment | Netlify (frontend), Render (backend), GitHub (version control) |
| Language | Java 17+ (backend), JavaScript ES6+ (frontend) |

---

## ✨ Features

### 🔐 Authentication & User Management
- OTP-based email verification on registration (6-digit, 10-min expiry)
- Stateless JWT token issuance on login
- BCrypt password hashing
- Password reset via OTP email flow
- Profile management (username, bio, location, DOB)

### 📝 Review Management
- Full **CRUD** operations on reviews
- 5 review categories: **Electronics, Movies, Restaurants, Cafes, Food**
- **Upvote / Downvote** system
- Keyword **search**, category **filter**, and multi-field **sorting** (date, rating, upvotes)
- **Pagination** support for large datasets
- Dashboard stats (total reviews, upvotes/downvotes received)

### 🤖 AI Recommendations
- Three-tier progressive recommendation engine (see [below](#-ai-recommendation-engine))
- **"Find Your Perfect Match"** mood-based wizard (multi-step preference quiz)
- Real-time ranked recommendations on the user dashboard
- Trending algorithm based on upvote counts and recency scoring

### 🔒 Security
- JWT authentication enforced on all protected routes
- CORS policy configuration
- 401 Unauthorized returned on all invalid/expired token attempts

---

## 🏗 System Architecture

REVIEWSAVER follows a three-tier MVC architecture:

```
┌──────────────────────────────────────────────┐
│          Presentation Layer                  │
│    React 18.3 Frontend  →  Netlify           │
└─────────────────────┬────────────────────────┘
                      │ REST API (JSON)
┌─────────────────────▼────────────────────────┐
│          Application Logic Layer             │
│    Spring Boot 3.5.11 Backend  →  Render     │
│  ┌───────────┐ ┌──────────┐ ┌─────────────┐  │
│  │Auth Module│ │Review    │ │ AI Engine   │  │
│  │JWT + OTP  │ │CRUD Svc  │ │ 3-Tier Reco │  │
│  └───────────┘ └──────────┘ └─────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ Spring Data JPA / Hibernate
┌─────────────────────▼────────────────────────┐
│              Data Layer                      │
│         PostgreSQL 17 (Cloud-hosted)         │
│   [Users Table] [Reviews Table] [Interactions Table] │
└──────────────────────────────────────────────┘
```

---

## 🤖 AI Recommendation Engine

The recommendation engine adapts based on how much a user has interacted with the platform:

| Tier | Trigger | Strategy |
|---|---|---|
| **Tier 1** | < 5 interactions | Category & keyword-based filtering |
| **Tier 2** | 5–15 interactions | NLP-powered full-text analysis |
| **Tier 3** | 15+ interactions | Collaborative filtering (interaction pattern matching) |
| **Trending** | All users | Upvote count + recency scoring |

> Users with more than 5 recorded interactions receive measurably more relevant recommendations — validated during performance testing.

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/verify-otp` | Verify OTP to activate account | ❌ |
| POST | `/api/auth/login` | Login, returns JWT | ❌ |
| POST | `/api/auth/forgot-password` | Send OTP for password reset | ❌ |
| POST | `/api/auth/reset-password` | Reset password with OTP | ❌ |

### Reviews
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/reviews` | List all reviews (paginated, filterable) | ❌ |
| POST | `/api/reviews` | Create a new review | ✅ |
| PUT | `/api/reviews/{id}` | Update your review | ✅ |
| DELETE | `/api/reviews/{id}` | Delete your review | ✅ |
| POST | `/api/reviews/{id}/upvote` | Upvote a review | ✅ |
| POST | `/api/reviews/{id}/downvote` | Downvote a review | ✅ |

### Recommendations
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/recommendations` | Get personalized recommendations | ✅ |
| POST | `/api/recommendations/match` | "Find Your Perfect Match" query | ✅ |

### User
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/user/profile` | Get current user profile | ✅ |
| PUT | `/api/user/profile` | Update profile | ✅ |
| GET | `/api/user/dashboard` | Dashboard stats | ✅ |

---

## 🗄 Database Schema

Three core tables power the platform:

```sql
-- Users Table
users (id, email, password_hash, is_verified, otp, otp_expiry,
       username, phone, location, dob, bio, created_at)

-- Reviews Table  
reviews (id, product_name, category, content, rating,
         upvotes, downvotes, author_id [FK→users], created_at, updated_at)

-- Interactions Table
interactions (id, user_id [FK→users], review_id [FK→reviews],
              interaction_type [VIEW|VOTE|SUBMIT], created_at)
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 17
- Node.js 18+ (for frontend)

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/RishiRaj1495/reviewsaver-backend.git
cd reviewsaver-backend

# 2. Configure environment variables (see below)
cp src/main/resources/application.properties.example src/main/resources/application.properties

# 3. Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`.

### Frontend Setup

```bash
# Clone the frontend repo and install dependencies
git clone https://github.com/RishiRaj1495/reviewsaver-frontend.git
cd reviewsaver-frontend
npm install
npm start
```

The frontend will start at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Create `src/main/resources/application.properties` with the following:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/reviewsaver
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000

# Gmail SMTP (for OTP emails)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# CORS
cors.allowed-origins=http://localhost:3000
```

> ⚠️ Never commit real credentials. Use environment variables or a secrets manager in production.

---

## 📁 Project Structure

```
reviewsaver-backend/
├── src/
│   └── main/
│       ├── java/com/reviewsaver/
│       │   ├── auth/               # JWT, OTP, BCrypt logic
│       │   ├── user/               # User entity, service, controller
│       │   ├── review/             # Review CRUD, voting, search
│       │   ├── recommendation/     # 3-tier AI engine
│       │   ├── interaction/        # Interaction tracking
│       │   └── config/             # Security, CORS configuration
│       └── resources/
│           └── application.properties
├── docs/
│   ├── Project_Report_GROUP-129.pdf    ← Upload report here
│   └── diagrams/
│       ├── Use_Case_Diagram.png        ← Upload UCD image here
│       └── Data_Flow_Diagram.png       ← Upload DFD image here
├── pom.xml
└── README.md
```

---

## 📊 Performance

| Operation | Avg Response Time |
|---|---|
| Login / Register | < 150ms |
| Review CRUD | < 200ms |
| Search & Pagination | < 180ms |
| AI Recommendations | < 500ms |
| OTP Email Dispatch | 2–3 seconds (Gmail SMTP) |

Security validation confirmed: all unauthorized requests to protected endpoints return `401 Unauthorized`.

---

## 👥 Team

**GROUP-129 — VIT Bhopal University, B.Tech CSE, 2028**

| Name | Roll Number |
|---|---|
| Rishi Raj | 24BCE10149 |
| Abhilash Singh | 24BCE10706 |
| Arnab Kumar | 24BCE11017 |
| Brotodeep Pal | 24BCE10477 |
| Anjistha Sharma | 24BCE10037 |

**Project Guide:** Dr. Sasmita Padhy, School of Computer Science and Engineering, VIT Bhopal University  
**Program Chair:** Dr. Vikas Panthi

---

## 📄 License

This project was developed as an academic submission for VIT Bhopal University. All rights reserved by the authors.
