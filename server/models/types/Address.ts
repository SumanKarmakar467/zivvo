export interface IAddress {
  _id: string;
  user: string;
  label: "home" | "work" | "other";
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
