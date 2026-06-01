export interface IUserAddress {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface IUserVerificationDocuments {
  gstNumber: string;
  panNumber: string;
  aadhaarLast4: string;
  gstCertUrl: string;
  panCardUrl: string;
  bankProofUrl: string;
}

export interface IUserVerification {
  status: "unverified" | "pending" | "verified" | "rejected";
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionNote: string;
  documents: IUserVerificationDocuments;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatar: string | null;
  phone: string;
  addresses: IUserAddress[];
  wishlist: string[];
  role: "user" | "seller" | "admin";
  isActive: boolean;
  googleId: string | null;
  refreshTokens: string[];
  provider: "local" | "google";
  refreshToken: string | null;
  verification: IUserVerification;
  trustScore: number;
  isVerified: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
