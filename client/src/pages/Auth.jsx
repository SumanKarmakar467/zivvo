import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, Gift, KeyRound, LogIn, Sparkles, Wand2 } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, "Use 8+ characters with 1 uppercase letter and 1 number")
});

const createPassword = () => {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  const seed = ["Z", "7", "!"];
  while (seed.length < 14) seed.push(chars[Math.floor(Math.random() * chars.length)]);
  return seed.sort(() => Math.random() - 0.5).join("");
};

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register, googleLogin, loading } = useAuthContext();
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register: field, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const completeLogin = () => {
    localStorage.setItem("zivvo_first_login_coupon", "shown");
    setShowCoupon(false);
    navigate("/profile", { replace: true });
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
    <main className="auth-page cosmic-container grid min-h-[calc(100vh-5rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
      <section className="auth-copy">
        <p className="text-label-caps font-bold uppercase tracking-[0.18em] text-neon-cyan">Member Access</p>
        <h1 className="cosmic-title mt-4 text-5xl leading-tight md:text-7xl">
          {isRegister ? "Create your" : "Open your"} <span className="gradient-text">ZIVVO vault.</span>
        </h1>
        <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
          {isRegister
            ? "Create your key to ZIVVO rewards, saved carts, profile controls, and faster checkout."
            : "Use your key to open ZIVVO rewards, saved cart access, profile controls, and faster checkout."}
        </p>
        <AuthAnimation mode={mode} />
        <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
          {["ZIVVO10", "Free delivery", "Elite drops"].map((item) => (
            <div key={item} className="glass-card rounded-2xl p-4 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-stellar-gold" />
              <p className="mt-3 font-bold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 22 }} className="auth-form-card glass-card rounded-[2rem] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{isRegister ? "Create Account" : "Sign In"}</p>
            <h2 className="cosmic-title mt-2 text-4xl">{isRegister ? "Join ZIVVO" : "Welcome Back"}</h2>
          </div>
          {isRegister ? <KeyRound className="h-8 w-8 text-primary" /> : <LogIn className="h-8 w-8 text-primary" />}
        </div>

        <form onSubmit={handleSubmit(submit)} className="grid gap-4">
          {isRegister && <Field label="Name" error={errors.name?.message}><input {...field("name")} className="input-cosmic px-4" /></Field>}
          <Field label="Email" error={errors.email?.message}><input {...field("email")} type="email" className="input-cosmic px-4" /></Field>
          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <input {...field("password")} type={showPassword ? "text" : "password"} className="input-cosmic w-full px-4 pr-24" autoComplete={isRegister ? "new-password" : "current-password"} />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/10 hover:text-neon-cyan"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {isRegister && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("password", createPassword(), { shouldDirty: true, shouldValidate: true });
                    setShowPassword(true);
                  }}
                  className="absolute right-14 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/10 hover:text-stellar-gold"
                  aria-label="Create strong password"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <span className="text-xs font-medium text-on-surface-variant">Use at least 8 characters, 1 uppercase letter, and 1 number.</span>
          </Field>
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

function AuthAnimation({ mode }) {
  const isRegister = mode === "register";
  return (
    <div className={`auth-anim-card ${isRegister ? "auth-anim-register" : "auth-anim-login"}`} aria-hidden="true">
      <div className="auth-anim-grid" />
      <div className="auth-vault-ring auth-vault-ring-one" />
      <div className="auth-vault-ring auth-vault-ring-two" />
      <div className="auth-energy-beam" />
      <div className="auth-gate">
        <span className="auth-gate-light" />
        <span className="auth-gate-lock" />
      </div>
      <div className="auth-key">
        <span className="auth-key-ring" />
        <span className="auth-key-stem" />
        <span className="auth-key-tooth auth-key-tooth-one" />
        <span className="auth-key-tooth auth-key-tooth-two" />
      </div>
      <div className="auth-human">
        <span className="auth-human-head" />
        <span className="auth-human-body" />
        <span className="auth-human-arm auth-human-arm-left" />
        <span className="auth-human-arm auth-human-arm-right" />
        <span className="auth-human-leg auth-human-leg-left" />
        <span className="auth-human-leg auth-human-leg-right" />
      </div>
      <div className="auth-sparks">
        {Array.from({ length: 8 }).map((_, index) => <span key={index} style={{ "--spark": index }} />)}
      </div>
      <div className="auth-floating-chip auth-floating-chip-one">{isRegister ? "Key Forge" : "Access Scan"}</div>
      <div className="auth-floating-chip auth-floating-chip-two">{isRegister ? "Profile Ready" : "Cart Restored"}</div>
      <p className="auth-anim-caption">{isRegister ? "Crafting your access key" : "Opening your reward gate"}</p>
    </div>
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
