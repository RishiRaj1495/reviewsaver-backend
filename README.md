<div align="center"><h1>🛡️ ReviewSaverAPI</h1><br/><strong>Robust RESTful backend API for ReviewSaver - Product review management system</strong><br/><br/><img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white"><img src="https://img.shields.io/badge/Java-17%2B-007396?style=for-the-badge&logo=java&logoColor=white"><img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white"></div><h2>✨ <b>Key Features</b></h2><ul><li>🔐 JWT Authentication & Authorization</li><li>💾 PostgreSQL with JPA/Hibernate</li><li>📝 Full CRUD for Products/Reviews</li><li>🛡️ Input Validation & Error Handling</li><li>📊 REST API + Swagger Docs</li><li>🧪 Unit & Integration Tests</li></ul><h2>🛠️ <b>Tech Stack</b></h2><table><thead><tr><th>Backend</th><th>Database</th><th>Security</th><th>Tools</th></tr></thead><tbody><tr><td>Spring Boot 3.x</td><td>PostgreSQL</td><td>JWT + Spring Security</td><td>Maven/Postman</td></tr><tr><td>Spring Data JPA</td><td>Hibernate</td><td>BCrypt</td><td>VS Code/IntelliJ</td></tr></tbody></table><h2>🚀 <b>Quick Start</b></h2><h3>📥 <b>Prerequisites</b></h3><ul><li>Java 17+</li><li>Maven 3.8+</li><li>PostgreSQL</li></ul><h3>🛠️ <b>Setup Commands</b></h3><pre><code># Clone & Build
git clone https://github.com/RishiRaj1495/reviewsaver-backend.git
cd reviewsaver-backend
mvn clean install

# Configure DB (application.yml)
spring.datasource.url=jdbc:postgresql://localhost:5432/reviewsaver

# Run
mvn spring-boot:run
✅ http://localhost:8080 | Swagger: /swagger-ui.html</code></pre><h2>📡 <b>API Endpoints</b></h2><table><thead><tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr></thead><tbody><tr><td>POST</td><td>/api/auth/register</td><td>-</td><td>Register user</td></tr><tr><td>POST</td><td>/api/auth/login</td><td>-</td><td>Get JWT</td></tr><tr><td>GET</td><td>/api/products</td><td>✓</td><td>List products</td></tr><tr><td>POST</td><td>/api/products/{id}/reviews</td><td>✓</td><td>Add review</td></tr><tr><td>GET</td><td>/api/products/{id}/reviews</td><td>✓</td><td>View reviews</td></tr></tbody></table><h2>🔐 <b>Auth Example</b></h2><pre><code>curl -X POST http://localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"test","password":"password"}'</code></pre><h2>📁 <b>Project Structure</b></h2><pre><code>reviewsaver-backend/
├── src/main/java/com/reviewsaver/
│   ├── controller/    # REST APIs
│   ├── service/       # Business Logic
│   ├── repository/    # JPA Repos
│   ├── entity/        # Models
│   └── security/      # JWT Auth
├── src/main/resources/application.yml
├── src/test/
├── pom.xml
└── README.md</code></pre><h2>🧪 <b>Testing & Deployment</b></h2><pre><code># Tests
mvn test

# Docker
docker build -t reviewsaver .
docker run -p 8080:8080 reviewsaver</code></pre><h2>🐛 <b>Troubleshooting</b></h2><table><thead><tr><th>Problem</th><th>Solution</th></tr></thead><tbody><tr><td>Port 8080 busy</td><td>Change server.port=8081</td></tr><tr><td>DB Error</td><td>Check application.yml</td></tr><tr><td>401 Unauthorized</td><td>Add Bearer token</td></tr></tbody></table><h2>👥 <b>Team Credits</b></h2><div align="center"><table><tr><td><b>1. Rishi Raj</b><br/>24BCE10149<br/>Backend + UI/UX + Frontend</td><td><b>2. Arnab Kumar</b><br/>24BCE11017<br/>Backend + Database + API</td></tr><tr><td><b>3. Abhilash Singh</b><br/>24BCE10706<br/>Design + Testing</td><td><b>4. Brotodeep Pal</b><br/>24BC10477<br/>Security + Deployment</td></tr></table><p><strong>🌍 India | 🏫 Computer Science Engineering</strong></p><a href="https://github.com/RishiRaj1495"><img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white"></a></div><hr/><div align="center"><strong>🛡️ ReviewSaver Backend</strong><br/>⭐ Star if helpful! \| 📊 <a href="http://localhost:8080/swagger-ui.html">Swagger Docs</a><br/><img src="https://img.shields.io/badge/Setup-2min-brightgreen"></div>
