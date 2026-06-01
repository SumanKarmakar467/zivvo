import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Gift, LogIn, Sparkles } from "lucide-react";
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
  const [showCoupon, setShowCoupon] = useState(false);
  const { register: field, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const completeLogin = () => {
    localStorage.setItem("zivvo_first_login_coupon", "shown");
    setShowCoupon(true);
    window.setTimeout(() => navigate("/?welcome=1"), 2600);
  };

  const submit = async (values) => {
    try {
      if (isRegister) await register(values);
      else await login(values);
      toast.success(isRegister ? "Account created" : "Welcome back to Zivvo");
      completeLogin();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Authentication failed");
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Welcome to Zivvo");
      completeLogin();
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <main className="cosmic-container grid min-h-[calc(100vh-5rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
      <section>
        <p className="text-label-caps font-bold uppercase tracking-[0.18em] text-neon-cyan">Member Access</p>
        <h1 className="cosmic-title mt-4 text-5xl leading-tight md:text-7xl">
          Login to unlock <span className="gradient-text">cosmic rewards.</span>
        </h1>
        <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
          First-time members receive an animated welcome coupon, saved cart access, profile controls, and faster checkout.
        </p>
        <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
          {["ZIVVO10", "Free delivery", "Elite drops"].map((item) => (
            <div key={item} className="glass-card rounded-2xl p-4 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-stellar-gold" />
              <p className="mt-3 font-bold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 22 }} className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{isRegister ? "Create Account" : "Sign In"}</p>
            <h2 className="cosmic-title mt-2 text-4xl">{isRegister ? "Join ZIVVO" : "Welcome Back"}</h2>
          </div>
          <LogIn className="h-8 w-8 text-primary" />
        </div>

        <form onSubmit={handleSubmit(submit)} className="grid gap-4">
          {isRegister && <Field label="Name" error={errors.name?.message}><input {...field("name")} className="input-cosmic px-4" /></Field>}
          <Field label="Email" error={errors.email?.message}><input {...field("email")} type="email" className="input-cosmic px-4" /></Field>
          <Field label="Password" error={errors.password?.message}><input {...field("password")} type="password" className="input-cosmic px-4" /></Field>
          <button disabled={loading || showCoupon} className="btn-primary w-full px-5 disabled:opacity-60">
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        <button type="button" onClick={handleGoogle} className="btn-ghost mt-3 w-full px-5">
          Continue with Google
        </button>
        <p className="mt-5 text-center text-sm text-on-surface-variant">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link className="font-bold text-neon-cyan" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create one"}</Link>
        </p>
      </motion.section>

      {showCoupon && <CouponCelebration />}
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      {children}
      {error && <span className="text-xs text-error">{error}</span>}
    </label>
  );
}

function CouponCelebration() {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-cosmic-black/80 p-4 backdrop-blur-xl">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} className="firework" style={{ "--x": `${(index % 6) * 18 - 45}vw`, "--y": `${Math.floor(index / 6) * 18 - 24}vh`, "--d": `${index * 0.08}s` }} />
      ))}
      <motion.div initial={{ scale: 0.7, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} className="glass-modal relative max-w-md rounded-[2rem] p-8 text-center shadow-cyan">
        <Gift className="mx-auto h-16 w-16 text-stellar-gold" />
        <p className="mt-5 text-label-caps font-bold uppercase tracking-[0.18em] text-neon-cyan">Welcome Coupon Unlocked</p>
        <h2 className="cosmic-title mt-3 text-5xl">ZIVVO10</h2>
        <p className="mt-3 text-on-surface-variant">10% off your first premium order. The coupon is already waiting in your cart.</p>
      </motion.div>
      <style>{`
        .firework {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #06b6d4;
          animation: zivvoFirework 1.35s ease-out var(--d) infinite;
          box-shadow: 0 0 18px #06b6d4;
        }
        .firework:nth-child(3n) { background: #7c3aed; box-shadow: 0 0 18px #7c3aed; }
        .firework:nth-child(4n) { background: #f59e0b; box-shadow: 0 0 18px #f59e0b; }
        @keyframes zivvoFirework {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
          22% { opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(1.35); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
