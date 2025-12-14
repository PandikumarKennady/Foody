# Foody Backend API

A NestJS-based backend service for the Foody food ordering platform.

## Features

- 🔐 **JWT Authentication** - Secure authentication for consumers and restaurant admins
- 📦 **Order Management** - Complete order lifecycle with status tracking
- 🏪 **Restaurant Admin Panel** - Dashboard and order management for restaurants
- 📧 **Email Notifications** - Automated order confirmation and status updates
- 🎁 **Offers & Discounts** - Promotional codes with category/restaurant targeting
- 🔌 **Contentstack Integration** - CMS-driven content and offers

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp env.example.txt .env
```

2. Update `.env` with your configuration:
```env
PORT=4000
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-token
```

### Running the Server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The server will start at `http://localhost:4000`

API Documentation: `http://localhost:4000/api/docs`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register consumer account |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register-restaurant-admin` | Register restaurant admin |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user profile |
| PATCH | `/api/users/profile` | Update profile |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/my-orders` | Get user's orders |
| GET | `/api/orders/track/:orderId` | Track order status |

### Restaurant Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/restaurant/dashboard` | Get dashboard stats |
| GET | `/api/orders/restaurant/all` | Get all restaurant orders |
| GET | `/api/orders/restaurant/today` | Get today's orders |
| GET | `/api/orders/restaurant/by-status` | Filter by status |
| PATCH | `/api/orders/restaurant/:id/status` | Update order status |

### Offers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/offers` | Get all active offers |
| GET | `/api/offers/validate/:code` | Validate offer code |
| GET | `/api/offers/by-restaurant/:uid` | Get restaurant offers |
| GET | `/api/offers/by-category` | Get category offers |

## User Roles

| Role | Description |
|------|-------------|
| `consumer` | Regular customer (default) |
| `restaurant_admin` | Restaurant owner/manager |
| `super_admin` | Platform administrator |

## Order Status Flow

```
pending → confirmed → preparing → ready → out_for_delivery → delivered
                                                           ↓
                                                       cancelled
```

## Contentstack Setup

### Required Content Types

1. **foods** - Already exists, contains dish information
2. **restaurants** - Already exists, contains restaurant information
3. **offers** - NEW - Create using the schema in `src/contentstack/offers.content-model.json`

### Creating Offers Content Type

1. Go to Contentstack → Content Types
2. Click "Create Content Type"
3. Use the schema from `offers.content-model.json`
4. Required fields:
   - `title` - Offer name
   - `code` - Unique promo code
   - `description` - Offer details
   - `discount_type` - "percentage" or "fixed"
   - `discount_value` - Amount/percentage
   - `is_active` - Toggle on/off

### Sample Offers

After creating the content type, add some sample offers:

```
Title: Welcome Discount
Code: WELCOME20
Description: Get 20% off on your first order!
Discount Type: percentage
Discount Value: 20
Max Discount: 100
Is Active: true
```

```
Title: Flat ₹50 Off
Code: FLAT50
Description: Flat ₹50 off on orders above ₹200
Discount Type: fixed
Discount Value: 50
Min Order Value: 200
Is Active: true
```

## Database

The backend uses **MongoDB** for data storage.

### Local Development

1. Install MongoDB locally or use Docker:
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Set the MongoDB URI in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/foody
```

### MongoDB Atlas (Cloud)

For production, use MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foody
```

## Email Configuration

For Gmail SMTP:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use the app password in `SMTP_PASS`

## Development

```bash
# Run with hot reload
npm run start:dev

# Format code
npm run format

# Lint
npm run lint
```

## Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   │   ├── guards/     # JWT & Role guards
│   │   ├── strategies/ # Passport strategies
│   │   └── decorators/ # Custom decorators
│   ├── users/          # User management
│   ├── orders/         # Order management
│   ├── email/          # Email service
│   ├── contentstack/   # CMS integration
│   ├── app.module.ts   # Root module
│   └── main.ts         # Entry point
├── package.json
└── tsconfig.json
```

## License

MIT

