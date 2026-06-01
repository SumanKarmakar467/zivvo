# How to add screenshots to Zivvo README

## Recommended screenshots to capture (in order):
1. **Homepage / Hero** - full page, desktop (1440px wide)
2. **Product Listing** - with search bar and pagination visible
3. **Product Detail** - with image gallery, price, reviews section
4. **Cart Drawer** - open on desktop and mobile side by side
5. **Checkout Page** - form + Razorpay button
6. **Order Tracking** - status timeline with steps
7. **Seller Dashboard** - product management table
8. **Mobile view** - product listing on 390px width

## Tools to capture:
- Chrome DevTools -> Ctrl+Shift+P -> "Capture full size screenshot"
- For GIF: use LICEcap (Windows/Mac) or Peek (Linux)
- Recommended GIF: 30-second walkthrough of: Home -> Product -> Cart -> Checkout

## Naming convention:
- Static: docs/screenshots/01-homepage.png
- Mobile: docs/screenshots/08-mobile-listing.png
- Demo GIF: docs/demo/zivvo-demo.gif

## After adding files, update README.md Screenshots section with:

### Desktop
| Home | Products | Product Detail |
|------|----------|----------------|
| ![Home](docs/screenshots/01-homepage.png) | ![Products](docs/screenshots/02-products.png) | ![Detail](docs/screenshots/03-product-detail.png) |

| Cart | Checkout | Order Tracking |
|------|----------|----------------|
| ![Cart](docs/screenshots/04-cart.png) | ![Checkout](docs/screenshots/05-checkout.png) | ![Orders](docs/screenshots/06-orders.png) |

### Mobile
| Cart Drawer | Product Listing |
|-------------|-----------------|
| ![Cart Mobile](docs/screenshots/07-cart-mobile.png) | ![Mobile](docs/screenshots/08-mobile-listing.png) |

### Demo
![Zivvo Demo](docs/demo/zivvo-demo.gif)
