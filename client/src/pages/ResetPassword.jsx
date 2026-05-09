import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/authApi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
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
          <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="New Password" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
          <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm Password" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
          <button disabled={isLoading} className="w-full rounded-lg bg-[#ef9f27] px-4 py-2 font-semibold text-black">{isLoading ? "Resetting..." : "Reset Password"}</button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {msg && <p className="mt-3 text-sm text-green-400">{msg}</p>}
        <Link to="/login" className="mt-4 block text-sm text-[#ef9f27]">Back to Login</Link>
      </div>
    </main>
  );
}
