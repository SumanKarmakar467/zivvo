# ShopPop - India's Smartest Marketplace

## Tech Stack
React 18 · Vite · Redux Toolkit · Node.js · Express · MongoDB · Mongoose  
Tailwind CSS · Framer Motion · Swiper.js · Firebase Auth · Razorpay · Cloudinary

## Quick Start
npm run dev

### Prerequisites
Node.js 18+ · MongoDB (local/Atlas) · Cloudinary · Razorpay test account

### Installation
```bash
# Install client
cd client && npm install

# Install server
cd ../server && npm install

# Configure env files
cp .env.example .env

# Seed database
npm run seed

# Run backend
npm run dev

# Run frontend (new terminal)
cd ../client && npm run dev
```

## Credentials (after seed)
- Admin: `admin@shoppop.com / Admin@123`
- Seller 1: `seller1@shoppop.com / Seller@123`
- Seller 2: `seller2@shoppop.com / Seller@123`

## Deployment
- Frontend: Netlify (`npm run build`, publish `dist`)
- Backend: Render (`node server.js`)
