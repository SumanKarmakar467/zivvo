import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters")
});

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register, googleLogin, loading } = useAuthContext();
  const { register: field, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const submit = async (values) => {
    try {
      if (isRegister) await register(values);
      else await login(values);
      toast.success("Welcome to Zivvo");
      navigate("/home");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Authentication failed");
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center bg-[var(--bg)] px-4 py-10 text-[var(--cream)]">
      <motion.section initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 22 }} className="zivvo-card w-full max-w-md rounded-lg p-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Firebase Authentication</p>
        <h1 className="mt-2 text-3xl font-black">{isRegister ? "Create account" : "Sign in"}</h1>
        <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4">
          {isRegister && <Field label="Name" error={errors.name?.message}><input {...field("name")} className="input" /></Field>}
          <Field label="Email" error={errors.email?.message}><input {...field("email")} type="email" className="input" /></Field>
          <Field label="Password" error={errors.password?.message}><input {...field("password")} type="password" className="input" /></Field>
          <button disabled={loading} className="rounded-md bg-[#C9A84C] px-5 py-3 font-black text-black disabled:opacity-60">{loading ? "Please wait..." : isRegister ? "Register" : "Login"}</button>
        </form>
        <button type="button" onClick={googleLogin} className="mt-3 w-full rounded-md border border-[var(--border)] px-5 py-3 font-bold">Continue with Google</button>
        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link className="font-bold text-[#C9A84C]" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create one"}</Link>
        </p>
      </motion.section>
    </main>
  );
}

function Field({ label, error, children }) {
  return <label className="grid gap-2 text-sm font-bold">{label}{children}{error && <span className="text-xs text-red-400">{error}</span>}</label>;
}
