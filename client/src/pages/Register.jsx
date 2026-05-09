import { Link } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";

export default function Register() {
  return <PageTransition><div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-shoppop-surface p-8"><h1 className="text-2xl font-bold">Create your account</h1><div className="mt-4 space-y-3"><input className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Name" /><input className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Email" /><input type="password" className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Password" /></div><button className="mt-4 w-full rounded-xl bg-amber-gradient p-2 font-semibold text-black">Create Account</button><p className="mt-4 text-sm">Already have account? <Link to="/login" className="text-shoppop-amber-300">Login</Link></p></div></PageTransition>;
}
