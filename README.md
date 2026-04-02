<div align="center"><h1>🛡️ ReviewSaverAPI</h1><br/><strong>Robust RESTful backend API for ReviewSaver - Product review management system</strong><br/><br/><img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white"><img src="https://img.shields.io/badge/Java-17%2B-007396?style=for-the-badge&logo=java&logoColor=white"><img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white">
<br/><small>Updated March 23, 2026 | Team Project</small></div><h2>✨ <b>Core Features</b></h2><ul><li>🔐 <b>JWT Authentication</b> + Role-Based Access (User/Admin)</li><li>💾 <b>PostgreSQL ORM</b> (JPA/Hibernate)</li><li>📝 <b>Full CRUD</b> Products/Users/Reviews</li><li>🛡️ <b>Input Validation</b> + Global Error Handling</li><li>📊 <b>Swagger API Docs</b> + OpenAPI 3.0</li><li>🧪 <b>85%+ Test Coverage</b> (JUnit + Testcontainers)</li></ul><h2>🛠️ <b>Tech Stack</b></h2><table><thead><tr><th>Backend</th><th>Database</th><th>Security</th><th>Tools</th></tr></thead><tbody><tr><td>Spring Boot 3.2+</td><td>PostgreSQL 15</td><td>Spring Security + JWT</td><td>Maven 3.9</td></tr><tr><td>Spring Data JPA</td><td>Hibernate 6.x</td><td>BCrypt + OAuth2</td><td>Postman/Swagger</td></tr></tbody></table><h2>🚀 <b>Production Setup</b></h2><h3>Prerequisites</h3><pre><code>Java 17+ | Maven 3.8+ | PostgreSQL 15+
IntelliJ IDEA / VS Code + Extension Pack</code></pre><h3>Quick Start</h3><pre><code>git clone https://github.com/RishiRaj1495/reviewsaver-backend.git
cd reviewsaver-backend
mvn clean install
# Edit application.yml (DB config)
mvn spring-boot:run
✅ API: http://localhost:8080
✅ Swagger: http://localhost:8080/swagger-ui.html</code></pre><h2>📡 <b>API Reference</b></h2><table><thead><tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Response</th></tr></thead><tbody><tr><td>POST</td><td>/api/auth/register</td><td>-</td><td>201 Created</td></tr><tr><td>POST</td><td>/api/auth/login</td><td>-</td><td>200 {token}</td></tr><tr><td>GET</td><td>/api/products</td><td>JWT</td><td>200 Array[Product]</td></tr><tr><td>POST</td><td>/api/products/{id}/reviews</td><td>JWT</td><td>201 Review</td></tr><tr><td>GET</td><td>/api/products/{id}/reviews</td><td>-</td><td>200 Array[Review]</td></tr></tbody></table><h2>🔐 <b>Auth Flow</b></h2><pre><code># Register
curl -X POST localhost:8080/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"user","email":"user@test.com","password":"pass123"}'

# Login (get JWT)
curl -X POST localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"user","password":"pass123"}'

# Protected endpoint
curl -X GET localhost:8080/api/products \
-H "Authorization: Bearer YOUR_JWT_TOKEN"</code></pre><h2>📁 <b>Project Structure</b></h2><pre><code>reviewsaver-backend/
├── src/main/java/com/reviewsaver/
│   ├── controller/     # REST endpoints
│   ├── dto/           # Request/Response
│   ├── entity/        # JPA models
│   ├── repository/    # Spring Data JPA
│   ├── security/      # JWT filters
│   └── service/       # Business logic
├── src/main/resources/
│   └── application.yml
├── src/test/          # 85%+ coverage
├── pom.xml
└── README.md</code></pre><h2>🧪 <b>Testing & Build</b></h2><pre><code># Unit + Integration Tests
mvn test

# Coverage Report
mvn jacoco:report

# Docker Build
docker build -t reviewsaver-backend .
docker run -p 8080:8080 reviewsaver-backend</code></pre><h2>☁️ <b>Production Deployment</b></h2><pre><code># Docker Compose (Dev + Prod)
services:
  app:
    image: reviewsaver-backend:latest
    ports: ["8080:8080"]
    depends_on: [postgres]
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: reviewsaver</code></pre><h2>🐛 <b>Troubleshooting</b></h2><table><thead><tr><th>Issue</th><th>Solution</th></tr></thead><tbody><tr><td>Port 8080 conflict</td><td><code>server.port=8081</code> in yml</td></tr><tr><td>DB connection</td><td>Check <code>application.yml</code></td></tr><tr><td>401 JWT error</td><td><code>Authorization: Bearer &lt;token&gt;</code></td></tr><tr><td>Maven OOM</td><td><code>mvn -Xmx2g clean install</code></td></tr></tbody></table><h2>👥 <b>Development Team</b></h2><div align="center"><table><tr><td><b>1. Rishi Raj</b><br/>24BCE10149<br/>Frontend Lead + backend</td><td><b>2. Arnab Kumar</b><br/>24BCE11017<br/>Backend Lead + API + Database</td></tr><tr><td><b>3. Abhilash Singh</b><br/>24BCE10706<br/>Design + Testing</td><td><b>4. Brotodeep Pal</b><br/>24BC10477<br/>Security + Deploy</td></tr></table><p><strong>🌍 India | 🏫 Computer Science Engineering</strong></p></div><hr/><div align="center"><strong>🛡️ ReviewSaver Backend API</strong> | <b>March 2026 Update</b><br/>⭐ <b>Star if helpful!</b> | 📊 <a href="http://localhost:8080/swagger-ui.html">Live Swagger Docs</a><br/><img src="https://img.shields.io/badge/Status-Live-brightgreen"><img src="https://img.shields.io/badge/Coverage-85%2B-orange"><img src="https://img.shields.io/badge/Response-&lt;50ms-blue"></div>

