const svgDataUri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const isRemotePlaceholderImage = (src) => {
  if (!src || typeof src !== "string") return true;
  return /\/\/(via\.placeholder\.com|placehold\.co|picsum\.photos)\b/i.test(src);
};

export const getUsableImage = (src, fallback) => {
  return isRemotePlaceholderImage(src) ? fallback : src;
};

export const getUsableImages = (images, fallback) => {
  const usable = (Array.isArray(images) ? images : []).filter((src) => !isRemotePlaceholderImage(src));
  return usable.length ? usable : [fallback];
};

export const productImageFallback = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="#1f1a14"/>
  <rect x="150" y="170" width="300" height="260" rx="28" fill="#2b241b" stroke="#ef9f27" stroke-width="8"/>
  <path d="M220 250h160l-28 120H248l-28-120Z" fill="#ef9f27"/>
  <circle cx="265" cy="395" r="18" fill="#efe0d3"/>
  <circle cx="345" cy="395" r="18" fill="#efe0d3"/>
  <text x="300" y="485" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#efe0d3">Zivvo</text>
</svg>
`);

export const avatarImageFallback = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <rect width="80" height="80" rx="40" fill="#2b241b"/>
  <circle cx="40" cy="31" r="13" fill="#ef9f27"/>
  <path d="M18 69c3-15 14-24 22-24s19 9 22 24" fill="#efe0d3"/>
</svg>
`);

export const thumbnailImageFallback = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <rect width="80" height="80" rx="10" fill="#1f1a14"/>
  <path d="M22 24h36v32H22z" fill="#2b241b" stroke="#ef9f27" stroke-width="4"/>
  <path d="M29 49l9-11 7 8 5-6 8 9H29z" fill="#efe0d3"/>
</svg>
`);
