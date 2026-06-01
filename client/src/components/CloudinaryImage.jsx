import { useState } from "react";
import { cloudinaryUrl } from "../utils/cloudinary";

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  crop = "fill",
  gravity = "auto",
  className = "",
  fallback = "/placeholder-product.svg",
  eager = false,
  ...props
}) {
  const [error, setError] = useState(false);
  const optimizedSrc = src ? cloudinaryUrl(src, { width, height, crop, gravity }) : fallback;
  const srcSet = src && width
    ? [0.5, 1, 1.5, 2]
        .map((dpr) =>
          `${cloudinaryUrl(src, {
            width: Math.round(width * dpr),
            height: height ? Math.round(height * dpr) : undefined,
            crop,
            gravity
          })} ${dpr}x`
        )
        .join(", ")
    : undefined;

  return (
    <img
      src={error ? fallback : optimizedSrc}
      srcSet={!error ? srcSet : undefined}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
