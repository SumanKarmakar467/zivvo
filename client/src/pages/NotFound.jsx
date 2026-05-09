import { Link } from "react-router-dom";
export default function NotFound() { return <div className="py-24 text-center"><h1 className="text-4xl font-extrabold">404</h1><p className="mt-2">Page not found.</p><Link to="/" className="mt-4 inline-block rounded bg-shoppop-amber-400 px-4 py-2 font-semibold text-black">Go Home</Link></div>; }
