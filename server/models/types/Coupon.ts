export interface ICoupon {
  _id: string;
  code: string;
  type: "flat" | "percent";
  value: number;
  maxDiscount: number | null;
  minOrderValue: number;
  scope: "platform" | "seller";
  seller: string | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
  applicableCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}
