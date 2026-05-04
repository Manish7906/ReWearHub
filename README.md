# 🌟 ReWear Hub — Fashion Rental Platform

> *Rent stylish outfits, wear celebrity looks, and donate unused clothes — all in one platform.*

---

## 📁 Project Structure

```
rewear-hub/
├── frontend/          # React.js (CRA)
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # React Context (Auth, Cart)
│       ├── pages/         # Route-level pages
│       └── utils/         # API client, mock data
│
└── backend/           # Spring Boot 3
    └── src/main/java/com/rewear/
        ├── config/        # Security, CORS, DataInitializer
        ├── controller/    # REST endpoints
        ├── dto/           # Request/Response objects
        ├── model/         # JPA entities
        ├── repository/    # Spring Data JPA repos
        ├── security/      # JWT filter & util
        └── service/       # Business logic
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Java** 17+
- **Maven** 3.8+
- (Optional) **MySQL 8** — app uses H2 in-memory by default

---

### 1. Backend (Spring Boot)

```bash
cd backend

# Build & run (H2 in-memory DB — no config needed)
mvn spring-boot:run

# Backend runs at: http://localhost:8080
# H2 Console at:   http://localhost:8080/h2-console
#   JDBC URL: jdbc:h2:mem:reweardb
#   Username: sa  |  Password: (empty)
```

**Demo credentials (auto-seeded):**
| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@rewear.com       | admin123   |
| User  | demo@rewear.com        | demo123    |

---

### 2. Frontend (React)

```bash
cd frontend

npm install
npm start

# App runs at: http://localhost:3000
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint               | Description         | Auth |
|--------|------------------------|---------------------|------|
| POST   | `/api/auth/register`   | Create account      | No   |
| POST   | `/api/auth/login`      | Login & get JWT     | No   |

### Products
| Method | Endpoint                      | Description              | Auth  |
|--------|-------------------------------|--------------------------|-------|
| GET    | `/api/products`               | List/search products     | No    |
| GET    | `/api/products/{id}`          | Get product details      | No    |
| GET    | `/api/products/trending`      | Trending products        | No    |
| GET    | `/api/products/celebrity`     | Celebrity collections    | No    |
| GET    | `/api/products/srk-looks`     | Shah Rukh Khan looks     | No    |
| POST   | `/api/products`               | Add product              | Admin |
| PATCH  | `/api/products/{id}`          | Update product           | Admin |
| DELETE | `/api/products/{id}`          | Remove product           | Admin |

### Rentals
| Method | Endpoint                      | Description              | Auth  |
|--------|-------------------------------|--------------------------|-------|
| GET    | `/api/rentals`                | My rentals               | User  |
| POST   | `/api/rentals`                | Create rental            | User  |
| GET    | `/api/rentals/availability`   | Check availability       | No    |
| POST   | `/api/rentals/{id}/return`    | Initiate return          | User  |

### Orders
| Method | Endpoint                          | Description              | Auth  |
|--------|-----------------------------------|--------------------------|-------|
| GET    | `/api/orders`                     | My orders                | User  |
| POST   | `/api/orders`                     | Place order              | User  |
| GET    | `/api/orders/{id}`                | Order details            | User  |
| GET    | `/api/orders/number/{orderNum}`   | Order by number          | User  |
| PATCH  | `/api/orders/{id}/status`         | Update status            | Admin |

### Reviews
| Method | Endpoint                          | Description              | Auth  |
|--------|-----------------------------------|--------------------------|-------|
| GET    | `/api/reviews/product/{id}`       | Product reviews          | No    |
| POST   | `/api/reviews`                    | Add review               | User  |
| PUT    | `/api/reviews/{id}`               | Update review            | User  |
| DELETE | `/api/reviews/{id}`               | Delete review            | User  |

### Donations
| Method | Endpoint                          | Description              | Auth  |
|--------|-----------------------------------|--------------------------|-------|
| POST   | `/api/donations`                  | Submit donation          | No/User|
| GET    | `/api/donations/my`               | My donations             | User  |
| GET    | `/api/donations`                  | All donations            | Admin |
| PATCH  | `/api/donations/{id}/status`      | Update status            | Admin |

### User
| Method | Endpoint                          | Description              | Auth  |
|--------|-----------------------------------|--------------------------|-------|
| GET    | `/api/users/me`                   | My profile               | User  |
| PUT    | `/api/users/me`                   | Update profile           | User  |
| GET    | `/api/users/me/rewards`           | Reward points info       | User  |
| POST   | `/api/users/me/change-password`   | Change password          | User  |

### Admin Dashboard
| Method | Endpoint                          | Description              | Auth  |
|--------|-----------------------------------|--------------------------|-------|
| GET    | `/api/admin/dashboard`            | Platform stats           | Admin |
| GET    | `/api/admin/orders`               | All orders               | Admin |
| GET    | `/api/admin/rentals`              | All rentals              | Admin |

---

## 🗄️ Database Schema

```
users          → id, name, email, password, phone, address, role, reward_points
products       → id, name, description, price_per_day, security_deposit, category, occasion, ...
rentals        → id, user_id, product_id, start_date, end_date, rental_days, status, ...
orders         → id, order_number, user_id, subtotal, deposit_total, grand_total, status, ...
payments       → id, order_id, user_id, amount, deposit_amount, transaction_id, status, ...
reviews        → id, user_id, product_id, rating, comment, created_at
donations      → id, user_id, donor_name, clothes_type, quantity, condition, status, ...
product_sizes  → product_id, size
product_images → product_id, image_url
```

---

## 🔑 Core Business Rules

| Rule                  | Detail                                                     |
|-----------------------|------------------------------------------------------------|
| Rental calculation    | `pricePerDay × days + securityDeposit`                     |
| Deposit               | Fully refundable on safe return                            |
| Reward points earned  | 10 pts/rental · 5 pts/review · 50 pts/donation · 100 pts/referral |
| Reward points value   | 1 pt = ₹0.50                                               |
| Tiers                 | Bronze (0–99) · Silver (100–499) · Gold (500–999) · Platinum (1000+) |
| JWT expiry            | 24 hours                                                   |

---

## ⚙️ Production Config

### Switch to MySQL
In `application.properties`, replace the H2 block:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rewear_hub?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

### Stripe Integration
Replace the mock in `PaymentService.processWithGateway()`:
```java
Stripe.apiKey = stripeApiKey;
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount(payment.getAmount().multiply(BigDecimal.valueOf(100)).longValue())
    .setCurrency("inr")
    .build();
PaymentIntent intent = PaymentIntent.create(params);
return intent.getId();
```

### Environment Variables (Production)
```
APP_JWT_SECRET=<256-bit-key>
STRIPE_API_KEY=sk_live_...
DB_URL=jdbc:mysql://...
DB_USER=...
DB_PASS=...
REACT_APP_API_URL=https://api.yoursite.com/api
```

---

## 🛠️ Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React 18, React Router 6, Axios, react-hot-toast    |
| Styling   | Custom CSS (design tokens, CSS variables)           |
| Backend   | Spring Boot 3.2, Spring Security, Spring Data JPA  |
| Auth      | JWT (jjwt 0.11)                                     |
| Database  | H2 (dev) / MySQL 8 (production)                     |
| Payments  | Stripe-ready (mock in dev)                          |
| Build     | Maven 3.8, Node.js 18+                              |

---

*Built with ❤️ — ReWear Hub © 2024*
