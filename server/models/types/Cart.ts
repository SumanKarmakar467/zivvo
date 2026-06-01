export interface ICartItem {
  _id: string;
  product: string;
  quantity: number;
  price: number;
  variantSku: string;
  variantAttributes: Record<string, string>;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  coupon: string;
  createdAt: Date;
  updatedAt: Date;
}
