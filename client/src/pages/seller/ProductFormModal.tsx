import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ui/ImageUploader";
import { api } from "@/utils/api";
import type { Product, ProductVariant, Specification } from "@/types";

interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const categories = ["Home Decor", "Clothing", "Jewellery", "Beauty", "Food", "Art", "Bags", "Spiritual"];

export default function ProductFormModal({ product, onClose, onSaved }: ProductFormModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "variants">("basic");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: typeof product?.category === "string" ? product.category : "",
    subcategory: product?.subcategory || "",
    description: product?.description || "",
    mrp: String(product?.mrp || ""),
    price: String(product?.price || ""),
    stock: String(product?.stock || "0"),
    sku: "",
    tags: product?.tags?.join(", ") || "",
    images: product?.images || [],
    variants: product?.variants || [],
    specifications: product?.specifications || []
  });

  const discount = useMemo(() => {
    const mrp = Number(form.mrp);
    const price = Number(form.price);
    return mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  }, [form.mrp, form.price]);

  const setField = (field: keyof typeof form, value: string | string[] | ProductVariant[] | Specification[]) => setForm((current) => ({ ...current, [field]: value }));

  const save = async (status: "paused" | "active") => {
    if (!form.name || !form.brand || !form.category || !form.description || !form.mrp || !form.price || form.stock === "") {
      toast.error("Please fill all required fields.");
      return;
    }
    if (form.description.length < 50) {
      toast.error("Description must be at least 50 characters.");
      return;
    }
    if (Number(form.price) >= Number(form.mrp)) {
      toast.error("Selling price must be lower than MRP.");
      return;
    }
    if (Number(form.stock) < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        subcategory: form.subcategory,
        description: form.description,
        mrp: Number(form.mrp),
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags,
        images: form.images,
        variants: form.variants,
        specifications: form.specifications,
        status
      };
      if (product?._id) await api.put<Product>(`/seller/products/${product._id}`, payload);
      else await api.post<Product>("/seller/products", payload);
      toast.success(status === "active" ? "Product published" : "Draft saved");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto grid max-w-6xl gap-6 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-5 text-[var(--cream)] lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">{product ? "Edit Product" : "Add Product"}</h2>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)]">x</button>
          </div>
          <ImageUploader images={form.images} onChange={(urls) => setField("images", urls)} />
        </section>

        <section className="space-y-4">
          <div className="flex rounded-full border border-[var(--border)] p-1 text-sm">
            {[
              ["basic", "Basic Info"],
              ["pricing", "Pricing & Stock"],
              ["variants", "Variants & Specs"]
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setActiveTab(id as "basic" | "pricing" | "variants")} className={`flex-1 rounded-full px-3 py-2 ${activeTab === id ? "bg-[#7C5CFC] text-white" : "text-[var(--muted)]"}`}>{label}</button>
            ))}
          </div>

          {activeTab === "basic" && (
            <div className="grid gap-3">
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Name*" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <input value={form.brand} onChange={(e) => setField("brand", e.target.value)} placeholder="Brand*" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <select value={form.category} onChange={(e) => setField("category", e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-3">
                <option value="">Category*</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <input value={form.subcategory} onChange={(e) => setField("subcategory", e.target.value)} placeholder="Subcategory" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Description*" rows={7} className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <p className="text-right text-xs text-[var(--muted)]">{form.description.length}/50</p>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="grid gap-3">
              <input type="number" value={form.mrp} onChange={(e) => setField("mrp", e.target.value)} placeholder="MRP*" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="Selling Price*" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <div className="rounded-lg border border-[var(--border)] p-3 text-sm text-emerald-400">{discount}% off</div>
              <input type="number" value={form.stock} onChange={(e) => setField("stock", e.target.value)} placeholder="Stock*" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
              <input value={form.sku} onChange={(e) => setField("sku", e.target.value)} placeholder="SKU" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
            </div>
          )}

          {activeTab === "variants" && (
            <div className="space-y-3">
              <button type="button" onClick={() => setField("variants", [...form.variants, { name: "", options: [] }])} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Add variant type</button>
              {form.variants.map((variant, index) => (
                <div key={index} className="grid gap-2 rounded-lg border border-[var(--border)] p-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input value={variant.name} onChange={(e) => {
                    const next = [...form.variants];
                    next[index] = { ...variant, name: e.target.value };
                    setField("variants", next);
                  }} placeholder="Type name" className="rounded-lg border border-[var(--border)] bg-transparent p-2" />
                  <input value={(variant.options || []).join(",")} onChange={(e) => {
                    const next = [...form.variants];
                    next[index] = { ...variant, options: e.target.value.split(",").map((option) => option.trim()).filter(Boolean) };
                    setField("variants", next);
                  }} placeholder="S,M,L" className="rounded-lg border border-[var(--border)] bg-transparent p-2" />
                  <button type="button" onClick={() => setField("variants", form.variants.filter((_, current) => current !== index))} className="rounded-lg border border-rose-500/30 px-3 text-rose-300">Remove</button>
                </div>
              ))}
              <input value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="Tags, comma separated" className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3" />
            </div>
          )}

          <footer className="flex justify-end gap-3 pt-4">
            <button type="button" disabled={saving} onClick={() => void save("paused")} className="rounded-full border border-[var(--border)] px-5 py-3 text-sm">Save as Draft</button>
            <button type="button" disabled={saving} onClick={() => void save("active")} className="rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] px-5 py-3 text-sm font-semibold text-white">{saving ? "Saving..." : "Publish"}</button>
          </footer>
        </section>
      </motion.div>
    </div>
  );
}
