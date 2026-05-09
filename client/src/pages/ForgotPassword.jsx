import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../services/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await forgotPassword({ email }).unwrap();
    setMsg(res.message || "Reset email sent");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#19120b] px-4 text-[#efe0d3]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#1f1a14] p-7">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-sm text-zinc-400">Enter your email to receive a reset link.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
          <button disabled={isLoading} className="w-full rounded-lg bg-[#ef9f27] px-4 py-2 font-semibold text-black">{isLoading ? "Sending..." : "Send Reset Email"}</button>
        </form>

        {msg && <p className="mt-3 text-sm text-green-400">{msg}</p>}
        <Link to="/login" className="mt-4 block text-sm text-[#ef9f27]">Back to Login</Link>
      </div>
    </main>
  );
}
