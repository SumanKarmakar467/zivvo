import { useState } from "react";
import CloudinaryImage from "../CloudinaryImage";

export function ProductGallery({ images = [], productName = "Product", badge = "HOT", wishlisted = false, onToggleWishlist }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];

  return (
    <section className="w-full">
      <div className="group relative mx-auto aspect-square max-h-[500px] max-w-[500px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg2)]">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#F43F5E] to-[#7C5CFC] px-3 py-1 text-xs font-black text-white">
          {badge}
        </span>
        <button
          type="button"
          onClick={onToggleWishlist}
          className={`absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 backdrop-blur transition ${wishlisted ? "bg-[#7C5CFC] text-white" : "bg-black/35 text-white hover:bg-[#7C5CFC]"}`}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? "♥" : "♡"}
        </button>
        <CloudinaryImage
          src={activeImage}
          alt={productName}
          width={800}
          height={800}
          crop="fill"
          eager
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.08]"
        />
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-[var(--bg2)] p-1 transition ${activeIndex === index ? "border-[#7C5CFC] ring-2 ring-[#7C5CFC]/25" : "border-[var(--border)] hover:border-[#A78BFA]"}`}
            aria-label={`View image ${index + 1}`}
          >
            <CloudinaryImage src={image} alt={`${productName} thumbnail ${index + 1}`} width={600} height={600} crop="fill" className="h-full w-full rounded-lg object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default ProductGallery;
