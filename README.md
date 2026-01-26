# skipline
# HomeManager

A comprehensive home inspection and property management platform built with Next.js (frontend) and Spring Boot (backend).

## Project Overview

HomeManager helps homeowners track, inspect, and maintain their properties. Features include:

- Property search and registration
- Home inspection booking and management
- Property inventory tracking with QR codes
- Subscription-based maintenance plans
- Stripe payment integration
- Google OAuth authentication

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Payments:** Stripe

### Backend
- **Framework:** Spring Boot 4.0
- **Language:** Java 17
- **Build Tool:** Maven
- **Database:** (configured in application.properties)

---

## Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- Java 17+ (for backend)
- Maven 3.8+ (for backend)
- npm or yarn

---

## Frontend Installation

### 1. Navigate to the frontend directory

```bash
cd homemanagementui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# NextAuth.js Configuration
AUTH_SECRET=your-auth-secret-here  # Generate with: openssl rand -base64 32

# Google OAuth (get from https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Smarty Streets API (for address autocomplete)
NEXT_PUBLIC_SMARTY_KEY=your-smarty-key
```

### 4. Run the development server

```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm start
```

---

## Backend Installation

### 1. Navigate to the backend directory

```bash
cd homemanagementapi
```

### 2. Configure application properties

Edit `src/main/resources/application.properties`:

```properties
server.port=8080

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/homemanagement
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Build the project

```bash
mvn clean install
```

### 4. Run the application

```bash
mvn spring-boot:run
```

Or run the packaged WAR file:

```bash
java -jar target/homemanagementapi-0.0.1-SNAPSHOT.war
```

The backend API will be available at [http://localhost:8080](http://localhost:8080)

---

## API Endpoints

### Home Controller (`/home`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/home/fetchall` | Fetch all saved homes |
| GET | `/home/details/{assessorId}` | Get home details by assessor ID |
| POST | `/home/property` | Get property data by address |
| POST | `/home/save` | Save a home to inventory |
| GET | `/home/dummyproperty` | Get sample property data |

### Barcode Controller (`/barcodes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/barcodes/home/{text}` | Generate QR code image |

---

## Project Structure

### Frontend (`homemanagementui/`)

```
app/
├── api/                    # API routes
│   ├── auth/              # NextAuth.js routes
│   └── create-checkout-session/
├── components/            # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── about/                 # About page
├── inventory/             # Property inventory
├── login/                 # Login page
├── signup/                # Signup page
├── property/              # Property details
├── search/                # Property search
├── subscription/          # Pricing plans
│   └── success/          # Payment success
├── types/                 # TypeScript types
├── layout.tsx            # Root layout
├── page.tsx              # Home page
└── providers.tsx         # Context providers
```

### Backend (`homemanagementapi/`)

```
src/main/java/com/java/homemanagementapi/
├── controllers/
│   ├── HomeDetailsController.java
│   └── BarcodesController.java
├── model/
│   ├── Home.java
│   ├── Features.java
│   ├── Owner.java
│   └── MailingAddress.java
├── repository/
│   └── HomeRepository.java
├── service/
│   └── BarcodeService.java
└── config/
    └── SpringConfig.java
```

---

## Running Both Services

For the full application to work, both services need to be running:

### Terminal 1 - Backend
```bash
cd homemanagementapi
mvn spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd homemanagementui
npm run dev
```

---

## Environment Setup for OAuth

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### Stripe Setup

1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers > API keys
3. Copy Publishable key and Secret key to `.env.local`

---

## Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `mvn clean install` | Build the project |
| `mvn spring-boot:run` | Run development server |
| `mvn test` | Run tests |
| `mvn package` | Package as WAR |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private and proprietary.
