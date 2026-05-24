import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import type { Product } from "@/types";
import ProductFormModal from "./ProductFormModal";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    return params.toString();
  }, [page, search, status]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<ProductsResponse>(`/seller/products?${query}`);
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [query]);

  const toggle = async (id: string) => {
    await api.patch<{ status: string }>(`/seller/products/${id}/toggle`, {});
    toast.success("Product status updated");
    void load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remove this product?")) return;
    await api.delete<{ message: string }>(`/seller/products/${id}`);
    toast.success("Product removed");
    void load();
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] p-4 text-[var(--cream)] md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">My Products</h1>
        <div className="flex flex-wrap gap-2">
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] px-3 py-2 text-sm">
            <option value="">All status</option><option value="active">Active</option><option value="paused">Paused</option><option value="deleted">Deleted</option>
          </select>
          <button type="button" onClick={() => { setEditing(null); setModalOpen(true); }} className="rounded-full bg-[#7C5CFC] px-4 py-2 text-sm font-semibold text-white">Add Product</button>
        </div>
      </div>

      {selected.length > 0 && <div className="mb-3 rounded-lg border border-[#7C5CFC]/40 bg-[#7C5CFC]/10 p-3 text-sm">{selected.length} selected <button className="ml-3 text-[#A78BFA]" type="button">Pause all</button><button className="ml-3 text-[#A78BFA]" type="button">Activate all</button><button className="ml-3 text-rose-300" type="button">Delete all</button></div>}

      <section className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg2)]">
        {loading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-[var(--muted)]"><tr><th className="p-3"><input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={(e) => setSelected(e.target.checked ? products.map((p) => p._id) : [])} /></th><th>Image</th><th>Name & Brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-[var(--border)]">
                    <td className="p-3"><input type="checkbox" checked={selected.includes(product._id)} onChange={(e) => setSelected(e.target.checked ? [...selected, product._id] : selected.filter((id) => id !== product._id))} /></td>
                    <td><img src={product.images[0]} alt={product.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover" /></td>
                    <td><p className="font-medium">{product.name}</p><p className="text-xs text-[var(--muted)]">{product.brand}</p></td>
                    <td>₹{product.price.toLocaleString("en-IN")} <span className="text-xs text-[var(--muted)] line-through">₹{product.mrp.toLocaleString("en-IN")}</span> <span className="text-xs text-emerald-400">{product.discount}%</span></td>
                    <td className={product.stock <= 5 ? "text-rose-400" : ""}>{product.stock}</td>
                    <td><span className="rounded-full border border-[var(--border)] px-2 py-1 text-xs">{product.status}</span></td>
                    <td className="space-x-2"><button type="button" onClick={() => { setEditing(product); setModalOpen(true); }} className="text-[#A78BFA]">Edit</button><button type="button" onClick={() => void toggle(product._id)} className="text-amber-300">Toggle</button><button type="button" onClick={() => void remove(product._id)} className="text-rose-300">Trash</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-4 flex justify-center gap-2">{Array.from({ length: totalPages }).map((_, index) => <button key={index} type="button" onClick={() => setPage(index + 1)} className={`h-9 w-9 rounded-full ${page === index + 1 ? "bg-[#7C5CFC] text-white" : "border border-[var(--border)]"}`}>{index + 1}</button>)}</div>
      {modalOpen && <ProductFormModal product={editing} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); void load(); }} />}
    </main>
  );
}
