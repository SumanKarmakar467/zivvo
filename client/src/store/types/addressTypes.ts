export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface Address {
  _id?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  [key: string]: unknown;
}

export interface AddressState {
  addresses: Address[];
  defaultAddress: Address | null;
  status: AsyncStatus;
  error: string | null;
}

export type AddressPayload = Partial<Address>;
export interface UpdateAddressPayload {
  id: string;
  data: AddressPayload;
}
