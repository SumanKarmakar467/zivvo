import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Wand2 } from "lucide-react";
import { useResetPasswordMutation } from "../services/authApi";

const createPassword = () => {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  const seed = ["Z", "7", "!"];
  while (seed.length < 14) seed.push(chars[Math.floor(Math.random() * chars.length)]);
  return seed.sort(() => Math.random() - 0.5).join("");
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({ token, newPassword: form.newPassword }).unwrap();
      setMsg(res.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.data?.message || "Reset failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#19120b] px-4 text-[#efe0d3]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#1f1a14] p-7">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="mt-2 text-sm text-zinc-400">Set a new password for your account.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="New Password" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 pr-24" autoComplete="new-password" required />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => {
                const password = createPassword();
                setForm({ newPassword: password, confirmPassword: password });
                setShowPassword(true);
              }} className="absolute right-12 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-[#ef9f27]" aria-label="Create strong password">
                <Wand2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-400">Use at least 8 characters, 1 uppercase letter, and 1 number.</p>
          </div>
          <input type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm Password" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" autoComplete="new-password" required />
          <button disabled={isLoading} className="w-full rounded-lg bg-[#ef9f27] px-4 py-2 font-semibold text-black">{isLoading ? "Resetting..." : "Reset Password"}</button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {msg && <p className="mt-3 text-sm text-green-400">{msg}</p>}
        <Link to="/login" className="mt-4 block text-sm text-[#ef9f27]">Back to Login</Link>
      </div>
    </main>
  );
}
