import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useRegisterMutation } from "../services/authApi";

const strengthLabel = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return "weak";
  if (score <= 3) return "medium";
  return "strong";
};

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const strength = useMemo(() => strengthLabel(form.password), [form.password]);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) e.password = "Password must be 8+ chars with uppercase and number";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await register({ name: form.name.trim(), email: form.email.toLowerCase(), password: form.password }).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setErrors({ api: err?.data?.message || "Registration failed" });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#19120b] px-4 py-10 text-[#efe0d3]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#1f1a14] p-7 shadow-2xl">
        <p className="mb-2 text-center text-2xl font-black text-[#ef9f27]">Zivvo</p>
        <h1 className="text-center text-2xl font-bold">Create account</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
            <div className="mt-1 text-xs">Strength: <span className={strength === "strong" ? "text-green-400" : strength === "medium" ? "text-yellow-400" : "text-red-400"}>{strength}</span></div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" required />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
          </div>

          {errors.api && <p className="text-sm text-red-400">{errors.api}</p>}
          <button disabled={isLoading} className="w-full rounded-lg bg-[#ef9f27] px-4 py-2 font-semibold text-black disabled:opacity-70">{isLoading ? "Creating..." : "Register"}</button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-300">
          Already have an account? <Link to="/login" className="text-[#ef9f27]">Login</Link>
        </p>
      </div>
    </main>
  );
}
