import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, hasFirebaseConfig } from "../config/firebase";
import { setCredentials } from "../store/slices/authSlice";
import { useGoogleLoginMutation, useLoginMutation } from "../services/authApi";

const getAuthErrorMessage = (err, fallback) => {
  if (err?.data?.message) return err.data.message;
  if (err?.error) return err.error;
  if (err?.code === "auth/popup-closed-by-user") return "Google sign-in was cancelled";
  if (err?.code === "auth/popup-blocked") return "Allow popups for this site to continue with Google";
  if (err?.message) return err.message;
  return fallback;
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Login failed"));
    }
  };

  const onGoogle = async () => {
    setError("");
    if (!hasFirebaseConfig || !auth || !googleProvider) {
      setError("Google login is not configured. Add VITE_FIREBASE_* keys in client/.env");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await googleLogin({ idToken }).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Google sign-in failed"));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#19120b] px-4 py-10 text-[#efe0d3]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#1f1a14] p-7 shadow-2xl">
        <p className="mb-2 text-center text-2xl font-black text-[#ef9f27]">Zivvo</p>
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 pr-16" required />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-zinc-800 px-2 py-1 text-xs">{showPassword ? "Hide" : "Show"}</button>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-[#ef9f27]">Forgot Password?</Link>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button disabled={isLoading} className="w-full rounded-lg bg-[#ef9f27] px-4 py-2 font-semibold text-black disabled:opacity-70">{isLoading ? "Signing in..." : "Sign In"}</button>
        </form>

        <div className="my-5 text-center text-sm text-zinc-400">or continue with</div>

        <button onClick={onGoogle} disabled={googleLoading || !hasFirebaseConfig} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 font-semibold text-zinc-900 disabled:opacity-70">
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-zinc-300">
          Don't have an account? <Link to="/register" className="text-[#ef9f27]">Register</Link>
        </p>
      </div>
    </main>
  );
}
