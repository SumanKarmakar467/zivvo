# Zivvo - Premium E-Commerce Experience

![Zivvo](https://img.shields.io/badge/Zivvo-E--Commerce-7C3AED?style=for-the-badge&logo=shopify&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

> A full-stack e-commerce marketplace with cosmic violet aesthetics, real-time cart,
> Razorpay payments, Firebase Auth, Cloudinary media, and a multi-role seller/admin system.

**Live Demo:** [zivvo-six.vercel.app](https://zivvo-six.vercel.app)
**Repository:** [github.com/SumanKarmakar467/zivvo](https://github.com/SumanKarmakar467/zivvo)

## Features

- Multi-role system: Buyer, Seller, Admin
- Firebase Authentication (email/password + social)
- Product listings with debounced search and pagination
- Cart with redux-persist (survives page refresh)
- Razorpay payment integration with webhook order tracking
- Order status timeline: Payment Confirmed -> Processing -> Shipped -> Delivered
- Product reviews and star ratings
- Cloudinary image optimization with automatic transforms
- Fully responsive: mobile, tablet, desktop
- Dark cosmic violet/cyan theme with Framer Motion animations
- SEO meta tags and JSON-LD structured data per page
- Code-split bundle with lazy-loaded routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Redux Toolkit, React Router v6 |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | Firebase Authentication |
| Payments | Razorpay |
| Media | Cloudinary |
| Deployment | Vercel (client), Render (server) |

## Project Structure

```text
zivvo/
|-- client/                 # React 18 + Vite frontend
|   |-- src/
|   |   |-- components/     # Reusable UI components
|   |   |-- pages/          # Route-level page components
|   |   |-- store/          # Redux Toolkit slices + selectors
|   |   |-- hooks/          # Custom React hooks
|   |   |-- utils/          # Helpers (cloudinary, formatters)
|   |   `-- App.jsx         # Router + lazy route definitions
|   |-- public/
|   `-- index.html
|-- server/                 # Node.js + Express backend
|   |-- controllers/        # Route handler logic
|   |-- models/             # Mongoose schemas
|   |-- routes/             # Express routers
|   |-- middleware/         # Auth, error handling
|   |-- webhooks/           # Razorpay webhook handler
|   `-- server.js           # Entry point
|-- package.json            # Root monorepo scripts
`-- README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB
- Firebase project
- Razorpay test account
- Cloudinary account

### Installation

```bash
npm run install:all
npm run dev
```

The client runs on `http://localhost:5173` and the server runs on `http://localhost:5000`.

### Build

```bash
npm run build
npm start
```

## Environment Variables

Create `client/.env` from `client/.env.example`:

```env
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_SITE_URL=
```

Create `server/.env` from `server/.env.example`:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
CLIENT_URL=
SEED_ADMIN_PASSWORD=
```

## Database Seeding

```bash
npm run seed --prefix server
```

After seeding, use the credentials printed by the seed script. Keep real credentials in local `.env` files only.

## Deployment

- Deploy the client from `client/` to Vercel.
- Deploy the server from `server/` to Render.
- Configure the client API base URL to point at the deployed backend.
- Add MongoDB, Firebase, Cloudinary, Razorpay, and email secrets to the server host.
- Keep Razorpay secrets and webhook secret on the backend only.

## Screenshots

<!-- Screenshots will be added here. See docs/screenshots/README.md. -->
> Screenshots and demo GIF coming soon - see the [live demo](https://zivvo-six.vercel.app)

### Desktop
| Home | Products | Product Detail |
|------|----------|----------------|
| <!-- ![Home](docs/screenshots/01-homepage.png) --> | <!-- ![Products](docs/screenshots/02-products.png) --> | <!-- ![Detail](docs/screenshots/03-product-detail.png) --> |

| Cart | Checkout | Order Tracking |
|------|----------|----------------|
| <!-- ![Cart](docs/screenshots/04-cart.png) --> | <!-- ![Checkout](docs/screenshots/05-checkout.png) --> | <!-- ![Orders](docs/screenshots/06-orders.png) --> |

### Mobile
| Cart Drawer | Product Listing |
|-------------|-----------------|
| <!-- ![Cart Mobile](docs/screenshots/07-cart-mobile.png) --> | <!-- ![Mobile](docs/screenshots/08-mobile-listing.png) --> |

### Demo
> Add `docs/demo/zivvo-demo.gif` to see the full walkthrough here.

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit with a conventional message: `git commit -m "feat: add wishlist sync"`.
4. Push and open a pull request.

## License

MIT (c) [Suman Karmakar](https://github.com/SumanKarmakar467)
