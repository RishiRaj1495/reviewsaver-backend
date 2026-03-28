<div align="center">

# 🛡️ ReviewSaver Backend API

**RESTful backend API for ReviewSaver — a community-driven product review platform**

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.11-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/Java-17%2B-007396?style=for-the-badge&logo=java&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

<small>Updated March 2026 | Team Project</small>

</div>

## ✨ Core Features

- 🔑 **Device-Hash Authentication** — passwordless login via email + device fingerprint
- 💾 **PostgreSQL** with JPA/Hibernate and Flyway migrations
- 📝 **Reviews CRUD** — create, read, upvote, downvote reviews
- 🔍 **Search & Pagination** — search by product name, paginate and sort results
- 👤 **User Profiles & Stats** — per-user review counts, upvotes, downvotes
- 📂 **Category Filtering** — browse reviews by product category
- 🐳 **Docker-ready** — multi-stage Dockerfile with Java 21 runtime

## 🛠️ Tech Stack

| Backend | Database | Migrations | Tools |
|---------|----------|------------|-------|
| Spring Boot 3.5.11 | PostgreSQL 15 | Flyway | Maven 3.9 |
| Spring Data JPA | Hibernate 6.x | — | Docker |
| Java 17 (source) / 21 (runtime) | HikariCP connection pool | — | Postman |

## 🚀 Local Setup

### Prerequisites

```
Java 17+ | Maven 3.8+ | PostgreSQL 15+
IntelliJ IDEA / VS Code
```

### Quick Start

```bash
git clone https://github.com/RishiRaj1495/reviewsaver-backend.git
cd reviewsaver-backend/backend

# Edit src/main/resources/application.properties (DB credentials if needed)
# Default: host=localhost, db=reviewdb, user=postgres, password=postgres

mvn clean install
mvn spring-boot:run
# ✅ API available at http://localhost:8080
```

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login or register via email + device hash |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit a new review |
| GET | `/api/reviews` | Get all reviews |
| GET | `/api/reviews/paged` | Get all reviews (paginated, sortable) |
| GET | `/api/reviews/category/{category}` | Get reviews by category |
| GET | `/api/reviews/category/{category}/paged` | Get reviews by category (paginated) |
| GET | `/api/reviews/user/{userId}` | Get reviews by user |
| GET | `/api/reviews/user/{userId}/paged` | Get user reviews (paginated) |
| GET | `/api/reviews/user/{userId}/sorted` | Get user reviews (paginated + sorted) |
| GET | `/api/reviews/search?q={term}` | Search reviews by product name |
| PUT | `/api/reviews/{id}/upvote` | Upvote a review |
| PUT | `/api/reviews/{id}/downvote` | Downvote a review |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{userId}` | Get user profile |
| GET | `/api/users/{userId}/stats` | Get user stats (reviews, upvotes, downvotes) |

### Pagination Query Params

| Param | Default | Description |
|-------|---------|-------------|
| `page` | `0` | Page number (0-indexed) |
| `size` | `10` | Items per page |
| `sortBy` | `createdAt` | Sort field |
| `sortDir` | `desc` | Sort direction (`asc` / `desc`) |

## 🔑 Auth Flow

Authentication is passwordless — users are identified by their **email + device hash** combination.

```bash
# Login / auto-register (new device creates a new account)
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","deviceHash":"abc123xyz"}'

# Response
{"userId": 1, "message": "Login successful (new device)"}
```

## 📁 Project Structure

```
reviewsaver-backend/
├── backend/
│   ├── src/main/java/com/reviewsaver/backend/
│   │   ├── controller/        # REST endpoints (Auth, Review, User)
│   │   ├── model/             # JPA entities (User, Review)
│   │   └── repository/        # Spring Data JPA repositories
│   ├── src/main/resources/
│   │   ├── application.properties       # Dev config (local PostgreSQL)
│   │   ├── application-prod.properties  # Prod config (env vars)
│   │   └── db/migration/
│   │       └── V1__create_initial_tables.sql
│   ├── Dockerfile
│   └── pom.xml
├── dataset/
│   └── synthetic_reviews.csv  # Sample data
├── scripts/
│   └── import_csv.py          # Data import utility
└── README.md
```

## 🗄️ Database

Database name: **`reviewdb`**

Schema is managed by **Flyway** migrations (`src/main/resources/db/migration/`).

```sql
-- Core tables
users   (id, email, device_hash, created_at)
reviews (id, user_id, product_name, category, rating, review_text, upvotes, downvotes, created_at)
```

## 🧪 Testing & Build

```bash
# Run tests
mvn test

# Build JAR
mvn clean package

# Docker build (uses Java 21 runtime)
docker build -t reviewsaver-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host:5432/reviewdb \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  reviewsaver-backend
```

## 📦 Data Import

To seed the database with sample data:

```bash
cd scripts
pip install pandas psycopg2-binary
python import_csv.py
```

The script reads `dataset/synthetic_reviews.csv` and imports users and reviews into the local PostgreSQL instance.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 conflict | Add `server.port=8081` to `application.properties` |
| DB connection error | Verify credentials in `application.properties` |
| Flyway migration error | Check `spring.flyway.*` settings; ensure `reviewdb` database exists |
| Maven out of memory | Run `export MAVEN_OPTS="-Xmx2g"` before `mvn` |

## 👥 Development Team

<div align="center">

| | |
|---|---|
| **1. Rishi Raj** · 24BCE10149 · Backend Lead + Frontend | **2. Arnab Kumar** · 24BCE11017 · API + Database |
| **3. Abhilash Singh** · 24BCE10706 · Design + Testing | **4. Brotodeep Pal** · 24BC10477 · Security + Deploy |

🌍 India &nbsp;|&nbsp; 🏫 Computer Science Engineering

</div>

---

<div align="center">

**🛡️ ReviewSaver Backend API** | March 2026
⭐ Star if helpful!

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.11-6DB33F)
![Java](https://img.shields.io/badge/Java-17%2F21-orange)

</div>

