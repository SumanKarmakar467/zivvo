export interface AuthUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: "user" | "buyer" | "seller" | "admin";
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDemoSession: boolean;
}

export interface SetCredentialsPayload {
  user?: AuthUser | null;
  accessToken?: string | null;
  isDemoSession?: boolean;
}

export type SetLoadingPayload = boolean;
