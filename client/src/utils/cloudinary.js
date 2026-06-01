const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const BASE = CLOUD_NAME ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload` : "";

export function cloudinaryUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return "";
  if (!CLOUD_NAME && !publicIdOrUrl.includes("res.cloudinary.com")) return publicIdOrUrl;

  const {
    width,
    height,
    crop = "fill",
    gravity = "auto",
    quality = "auto",
    format = "auto",
    lazy = false
  } = options;

  let publicId = publicIdOrUrl;
  let base = BASE;
  if (publicIdOrUrl.includes("res.cloudinary.com")) {
    const [urlBase, path] = publicIdOrUrl.split("/upload/");
    base = `${urlBase}/upload`;
    publicId = path?.replace(/^v\d+\//, "") ?? publicIdOrUrl;
  }

  if (!base || publicId === publicIdOrUrl && /^https?:\/\//.test(publicIdOrUrl)) return publicIdOrUrl;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    (width || height) && `c_${crop}`,
    (width || height) && `g_${gravity}`,
    lazy && "fl_progressive"
  ]
    .filter(Boolean)
    .join(",");

  return `${base}/${transforms}/${publicId}`;
}

export const productCardImage = (url) =>
  cloudinaryUrl(url, { width: 400, height: 400, crop: "fill", gravity: "auto" });

export const productThumbnail = (url) =>
  cloudinaryUrl(url, { width: 80, height: 80, crop: "thumb", gravity: "auto" });

export const productHeroImage = (url) =>
  cloudinaryUrl(url, { width: 800, height: 800, crop: "fill", gravity: "auto" });

export const productGalleryImage = (url) =>
  cloudinaryUrl(url, { width: 600, height: 600, crop: "fill", gravity: "auto" });

export const avatarImage = (url) =>
  cloudinaryUrl(url, { width: 96, height: 96, crop: "thumb", gravity: "face" });

export const categoryBannerImage = (url) =>
  cloudinaryUrl(url, { width: 1200, height: 400, crop: "fill", gravity: "auto" });
