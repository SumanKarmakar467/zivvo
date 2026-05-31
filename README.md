# ZIVVO - India's Premium E-Commrce Platform

<div align="center">
  <img src="./client/public/zivvo-banner.png" alt="Zivvo Banner" width="100%" />
  <br /><br />

  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwind-css)
  ![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-0055FF?style=flat&logo=framer)
  ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=flat&logo=redux)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat)

  **[Live Demo](https://zivvo-six.vercel.app)** ·
  **[Source Code](https://github.com/SumanKarmakar467/zivvo)** ·
  **[Report Bug](https://github.com/SumanKarmakar467/zivvo/issues)**
</div>

---

## Overview

Zivvo is a full-stack e-commerce web application built for the Indian market, connecting 800+ verified artisan sellers with conscious shoppers across India. Built with a modern React frontend and a scalable Node.js backend, it covers the complete shopping lifecycle from discovery to delivery.

---

## Screenshots

| Landing Page | Product Detail |
|---|---|
| ![Landing](./docs/screenshots/landing.png) | ![Product](./docs/screenshots/product.png) |

| Cart & Checkout | Seller Dashboard |
|---|---|
| ![Cart](./docs/screenshots/cart.png) | ![Seller](./docs/screenshots/seller.png) |

---

## Features

### Buyer Features
- JWT-secured authentication with access and refresh tokens
- Full-text product search with live autocomplete and debouncing
- Advanced filters by category, brand, price, rating, and discount
- Product detail page with image gallery, reviews, and delivery checks
- Wishlist with persistent server sync on login
- Cart management with quantity updates and coupon application
- Razorpay-powered checkout for UPI, card, net banking, wallet, and COD
- Order tracking with status timeline from placed to delivered
- Star ratings and verified-buyer review system
- Email notifications for order confirmation and status updates
- Zivvo rewards-ready data model for purchase incentives

### Seller Features
- Dedicated seller dashboard with revenue and order analytics
- Product management for listings, pricing, stock, variants, and images
- Cloudinary-ready image upload flow
- Variant builder for size/color combinations with individual stock
- Order management with shipping updates and tracking IDs
- Low-stock inventory visibility

### Technical Highlights
- Dark/light theme with CSS variables and persisted preference
- Framer Motion scroll-reveal animations and page transitions
- Skeleton loading and polished async UI states
- Mobile-first responsive design from 375px to desktop
- Redux Toolkit for global state and Zustand for UI state
- Express rate limiting, Helmet security headers, and Mongo sanitization
- Mongoose schemas and indexes for search, auth, products, and orders

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion |
| State | Redux Toolkit, Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT access + refresh tokens, bcrypt |
| Payments | Razorpay orders API + server-side signature verification |
| Media | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| Deployment | Vercel frontend, Railway/Render backend |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Razorpay test account
- Cloudinary account
- Gmail account or SMTP provider

### Environment Variables

Create `client/.env`:

```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/zivvo
JWT_SECRET=replace_with_strong_secret
JWT_REFRESH_SECRET=replace_with_strong_refresh_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Installation

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### Run Locally

```bash
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to the backend on `http://localhost:5000`.

### Seed Demo Data

```bash
npm run seed --prefix server
```

Seed credentials:

| Role | Email | Password |
|---|---|---|
| Buyer | buyer@zivvo.com | Test@1234 |
| Seller | seller@zivvo.com | Test@1234 |
| Seller 2 | seller2@zivvo.com | Test@1234 |
| Admin | admin@zivvo.com | Test@1234 |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a buyer account |
| POST | `/api/auth/login` | Login and issue refresh cookie |
| POST | `/api/auth/refresh` | Rotate refresh token and return access token |
| GET | `/api/products` | List products with filters/search |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/cart` | Authenticated user cart |
| POST | `/api/cart/add` | Add item to cart |
| POST | `/api/payment/create-order` | Create Razorpay or COD order |
| POST | `/api/payment/verify` | Verify Razorpay signature server-side |
| GET | `/api/orders/my` | Paginated user order history |
| GET | `/api/orders/:id` | Secure order detail |
| PATCH | `/api/orders/:id/status` | Seller/admin status update |

---

## Security Notes

- Razorpay secret is used only on the backend.
- Payment signatures are verified server-side before stock or cart mutations.
- Refresh tokens are stored in HTTP-only cookies and rotated on refresh.
- Helmet, rate limiting, and Mongo sanitization protect the API surface.
- Users can only access their own orders unless they are admins.

---

## Project Structure

```text
zivvo/
  client/            React + Vite frontend
  server/            Express API, models, routes, sockets
  docs/screenshots/  README screenshots
  .github/           PR template and GitHub workflow docs
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional messages: `git commit -m "feat: add wishlist sync"`
4. Push and open a Pull Request

---

## License

MIT © 2024 Suman Karmakar
