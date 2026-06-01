import { createContext, useContext, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { auth, googleProvider, hasFirebaseConfig } from "../config/firebase";
import { logout as logoutAction, setCredentials } from "../store/slices/authSlice";

const AuthContext = createContext(null);
const useFirebaseAuth = hasFirebaseConfig && import.meta.env.VITE_ENABLE_FIREBASE_AUTH === "true";

const getDisplayNameFromEmail = (email) => {
  const name = String(email || "").split("@")[0].replace(/[._-]+/g, " ").trim();
  return name ? name.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Zivvo Member";
};

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const persistUser = (authUser, accessToken = null) => {
    const isDemoSession = !accessToken;
    setUser(authUser);
    if (isDemoSession) localStorage.setItem("zivvo-demo-user", JSON.stringify(authUser));
    else localStorage.removeItem("zivvo-demo-user");
    dispatch(setCredentials({ user: authUser, accessToken, isDemoSession }));
    return authUser;
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      if (useFirebaseAuth) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(credential.user, { displayName: name });
        } catch (error) {
          console.warn("Firebase email registration skipped:", error.code || error.message);
        }
      }
      try {
        const { data } = await api.post("/auth/register", { name, email, password });
        return persistUser(data.user, data.accessToken);
      } catch {
        const demoUser = { name: name || "Zivvo Member", email, role: "user" };
        return persistUser(demoUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      if (useFirebaseAuth) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          console.warn("Firebase email login skipped:", error.code || error.message);
        }
      }
      try {
        const { data } = await api.post("/auth/login", { email, password });
        return persistUser(data.user, data.accessToken);
      } catch {
        const demoUser = { name: getDisplayNameFromEmail(email), email, role: "user" };
        return persistUser(demoUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      if (!useFirebaseAuth) {
        return persistUser({ name: "Google Demo User", email: "google.demo@zivvo.local", role: "user" });
      }
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      const { data } = await api.post("/auth/google", { idToken });
      return persistUser(data.user, data.accessToken);
    } catch (error) {
      console.warn("Google login using local demo fallback:", error.code || error.message);
      return persistUser({ name: "Google Demo User", email: "google.demo@zivvo.local", role: "user" });
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout").catch(() => null);
    } finally {
      setUser(null);
      dispatch(logoutAction());
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ user, loading, register, login, googleLogin, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};
