import { useSelector } from "react-redux";
export default function useCart() { return useSelector((s) => s.cart); }
