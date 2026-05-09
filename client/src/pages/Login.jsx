import { Link } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";

export default function Login() {
  return <PageTransition><div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-shoppop-surface md:grid-cols-2"><div className="hidden bg-shoppop-bg p-8 md:block"><h2 className="text-3xl font-extrabold">ShopPop</h2><p className="mt-2 text-shoppop-text-secondary">India's Smartest Marketplace</p></div><div className="p-8"><h1 className="text-2xl font-bold">Welcome back</h1><p className="mb-4 text-sm text-shoppop-text-muted">Sign in to your ShopPop account</p><input className="mb-3 w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Email" /><input type="password" className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Password" /><button className="mt-4 w-full rounded-xl bg-amber-gradient p-2 font-semibold text-black">Sign In</button><p className="mt-4 text-sm">New to ShopPop? <Link to="/register" className="text-shoppop-amber-300">Register</Link></p></div></div></PageTransition>;
}
