export interface IReviewSellerResponse {
  text: string;
  respondedAt?: Date;
}

export interface IReview {
  _id: string;
  product: string;
  buyer: string;
  order: string;
  rating: number;
  title?: string;
  body?: string;
  images: string[];
  verifiedPurchase: boolean;
  sellerResponse: IReviewSellerResponse;
  helpfulVotes: number;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}
