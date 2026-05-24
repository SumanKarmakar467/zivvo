import { createContext, useContext, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import api from "../api/axios";
import { auth, googleProvider, hasFirebaseConfig } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      if (hasFirebaseConfig) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
      }
      const { data } = await api.post("/auth/register", { name, email, password });
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      if (hasFirebaseConfig) await signInWithEmailAndPassword(auth, email, password);
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    if (!hasFirebaseConfig) throw new Error("Firebase is not configured");
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      const { data } = await api.post("/auth/google", { idToken });
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ user, loading, register, login, googleLogin, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};
