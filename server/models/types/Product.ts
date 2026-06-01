export interface IProductVariant {
  sku: string;
  attributes: Record<string, string>;
  stock: number;
  priceDelta: number;
  images: string[];
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp?: number;
  discount: number;
  images: string[];
  imagePublicIds: string[];
  category: string;
  brand: string;
  seller: string;
  stock: number;
  sold: number;
  weight: number;
  rating: number;
  numReviews: number;
  averageRating: number;
  reviewCount: number;
  specs: Record<string, string>;
  tags: string[];
  variants: IProductVariant[];
  hasVariants: boolean;
  attributeOptions: Record<string, string[]>;
  isFeatured: boolean;
  isActive: boolean;
  status: "active" | "paused" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}
