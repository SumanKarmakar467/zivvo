import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  useAddSellerProductMutation,
  useDeleteSellerProductMutation,
  useGetSellerOrdersQuery,
  useGetSellerProductsQuery,
  useGetSellerStatsQuery,
  useUpdateSellerProductMutation
} from "../store/api/sellerApi";
import { useGetReviewsQuery, useRespondToReviewMutation } from "../services/productApi";
import { useGetCategoriesQuery } from "../store/api/productsApi";
import useAuth from "../hooks/useAuth";
import { updateOrderStatus } from "../features/orders/ordersSlice";
import { notifyError, notifySuccess } from "../components/common/Toast";

const sections = ["overview", "products", "orders", "add"];

const emptyForm = {
  name: "",
  category: "",
  brand: "",
  description: "",
  mrp: "",
  price: "",
  stock: "",
  hasVariants: false,
  attributeOptions: [{ name: "", values: "" }],
  variants: [],
  tags: "",
  specs: [{ key: "", value: "" }],
  images: []
};

function ProductForm({ value, categories, onChange, onSubmit, submitting, submitLabel = "Save Product" }) {
  const discount = useMemo(() => {
    const mrp = Number(value.mrp || 0);
    const price = Number(value.price || 0);
    if (!mrp || mrp <= 0 || price > mrp) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  }, [value.mrp, value.price]);

  const updateSpec = (index, field, nextVal) => {
    const nextSpecs = value.specs.map((spec, i) => (i === index ? { ...spec, [field]: nextVal } : spec));
    onChange({ ...value, specs: nextSpecs });
  };

  const updateAttr = (index, field, nextVal) => {
    const next = value.attributeOptions.map((row, i) => (i === index ? { ...row, [field]: nextVal } : row));
    onChange({ ...value, attributeOptions: next });
  };

  const generateCombinations = () => {
    const attrs = value.attributeOptions
      .map((row) => ({
        name: row.name.trim(),
        values: row.values.split(",").map((v) => v.trim()).filter(Boolean)
      }))
      .filter((row) => row.name && row.values.length);

    if (!attrs.length) return;
    const combos = attrs.reduce((acc, attr) => {
      if (!acc.length) return attr.values.map((val) => ({ [attr.name]: val }));
      return acc.flatMap((combo) => attr.values.map((val) => ({ ...combo, [attr.name]: val })));
    }, []);

    const nextVariants = combos.map((attributes, idx) => {
      const existing = (value.variants || []).find((variant) =>
        Object.entries(attributes).every(([k, v]) => String(variant.attributes?.[k] || "") === String(v))
      );
      return existing || {
        sku: "",
        attributes,
        stock: 0,
        priceDelta: 0,
        isActive: true
      };
    });

    onChange({ ...value, variants: nextVariants });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-[#1f1a14] p-5">
      <div>
        <label className="mb-1 block text-sm text-zinc-300">Product Name</label>
        <input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Category</label>
          <select value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" required>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Brand</label>
          <input value={value.brand} onChange={(e) => onChange({ ...value, brand: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-zinc-300">Description</label>
        <textarea value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} className="h-28 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-zinc-300">MRP</label>
          <input type="number" min="0" value={value.mrp} onChange={(e) => onChange({ ...value, mrp: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Selling Price</label>
          <input type="number" min="0" value={value.price} onChange={(e) => onChange({ ...value, price: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" required />
        </div>
      </div>

      <p className="text-sm text-[#ef9f27]">Discount: {discount}%</p>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={Boolean(value.hasVariants)} onChange={(e) => onChange({ ...value, hasVariants: e.target.checked })} />
        This product has variants
      </label>

      {!value.hasVariants ? (
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Stock</label>
          <input type="number" min="0" value={value.stock} onChange={(e) => onChange({ ...value, stock: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-200">Attribute Builder</p>
            <button type="button" onClick={() => onChange({ ...value, attributeOptions: [...value.attributeOptions, { name: "", values: "" }] })} className="text-xs text-[#ef9f27]">Add attribute</button>
          </div>
          {value.attributeOptions.map((row, index) => (
            <div key={`${index}-${row.name}`} className="grid gap-2 md:grid-cols-[1fr,2fr,auto]">
              <input value={row.name} onChange={(e) => updateAttr(index, "name", e.target.value)} placeholder="Attribute name (e.g. Color)" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input value={row.values} onChange={(e) => updateAttr(index, "values", e.target.value)} placeholder="Values comma-separated (e.g. Red, Blue)" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <button type="button" onClick={() => onChange({ ...value, attributeOptions: value.attributeOptions.filter((_, i) => i !== index) })} className="rounded bg-zinc-800 px-2 py-1 text-xs">Remove</button>
            </div>
          ))}
          <button type="button" onClick={generateCombinations} className="rounded bg-[#ef9f27] px-3 py-2 text-xs font-semibold text-black">Generate all combinations</button>

          {value.variants.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-zinc-400">
                    <th className="py-2">Combination</th><th>SKU</th><th>Stock</th><th>Price Delta</th><th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {value.variants.map((variant, index) => (
                    <tr key={`${index}-${JSON.stringify(variant.attributes)}`} className="border-t border-zinc-800">
                      <td className="py-2">{Object.entries(variant.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(" · ")}</td>
                      <td><input value={variant.sku || ""} onChange={(e) => onChange({ ...value, variants: value.variants.map((v, i) => (i === index ? { ...v, sku: e.target.value.toUpperCase() } : v)) })} className="w-32 rounded border border-zinc-700 bg-zinc-900 px-2 py-1" /></td>
                      <td><input type="number" min="0" value={variant.stock} onChange={(e) => onChange({ ...value, variants: value.variants.map((v, i) => (i === index ? { ...v, stock: Number(e.target.value || 0) } : v)) })} className="w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1" /></td>
                      <td><input type="number" value={variant.priceDelta} onChange={(e) => onChange({ ...value, variants: value.variants.map((v, i) => (i === index ? { ...v, priceDelta: Number(e.target.value || 0) } : v)) })} className="w-24 rounded border border-zinc-700 bg-zinc-900 px-2 py-1" /></td>
                      <td><input type="checkbox" checked={variant.isActive !== false} onChange={(e) => onChange({ ...value, variants: value.variants.map((v, i) => (i === index ? { ...v, isActive: e.target.checked } : v)) })} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm text-zinc-300">Specifications</label>
          <button type="button" onClick={() => onChange({ ...value, specs: [...value.specs, { key: "", value: "" }] })} className="text-xs font-semibold text-[#ef9f27]">Add Spec</button>
        </div>
        {value.specs.map((spec, index) => (
          <div key={`${index}-${spec.key}`} className="grid gap-2 md:grid-cols-2">
            <input placeholder="Key" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
            <input placeholder="Value" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
          </div>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm text-zinc-300">Tags (comma-separated)</label>
        <input value={value.tags} onChange={(e) => onChange({ ...value, tags: e.target.value })} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
      </div>

      <div>
        <label className="mb-1 block text-sm text-zinc-300">Images (max 8)</label>
        <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-600 bg-zinc-900 px-4 py-8 text-sm text-zinc-400">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onChange({ ...value, images: Array.from(e.target.files || []).slice(0, 8) })}
          />
          Drag-drop or click to upload
        </label>
        {value.images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {value.images.map((img, idx) => (
              <img key={`${img.name}-${idx}`} src={URL.createObjectURL(img)} alt="preview" className="h-16 w-full rounded object-cover" />
            ))}
          </div>
        )}
      </div>

      <button disabled={submitting} className="w-full rounded-md bg-[#ef9f27] px-4 py-2 font-semibold text-black disabled:opacity-60">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function SellerReviewResponder({ order, onClose }) {
  const [selectedProduct, setSelectedProduct] = useState(order?.items?.[0]?.product || "");
  const [responseText, setResponseText] = useState({});
  const { data, isLoading } = useGetReviewsQuery(
    { product: selectedProduct, page: 1, limit: 50, sort: "most_recent" },
    { skip: !selectedProduct }
  );
  const [respondToReview, { isLoading: responding }] = useRespondToReviewMutation();

  const reviews = (data?.reviews || []).filter((review) => String(review.order) === String(order?._id));

  const submitResponse = async (reviewId) => {
    const text = (responseText[reviewId] || "").trim();
    if (!text) return;
    await respondToReview({ id: reviewId, text }).unwrap();
    setResponseText((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-zinc-700 bg-[#1f1a14] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Respond to Reviews (Order #{String(order._id).slice(-6)})</h3>
          <button type="button" onClick={onClose} className="rounded border border-zinc-700 px-2 py-1 text-sm">Close</button>
        </div>

        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="mb-4 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          {(order?.items || []).map((item) => (
            <option key={`${item.product}-${item.name}`} value={item.product}>{item.name}</option>
          ))}
        </select>

        {isLoading ? (
          <p className="text-sm text-zinc-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-zinc-400">No reviews yet for this order item.</p>
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                <p className="text-sm font-semibold">{review.buyer?.name || "Buyer"} • {review.rating}★</p>
                <p className="mt-1 text-sm text-zinc-300">{review.body}</p>
                {review.sellerResponse?.text && <p className="mt-2 rounded bg-zinc-800 p-2 text-xs text-zinc-300">Existing response: {review.sellerResponse.text}</p>}
                <textarea
                  value={responseText[review._id] || ""}
                  onChange={(e) => setResponseText((prev) => ({ ...prev, [review._id]: e.target.value }))}
                  placeholder="Write your response"
                  rows={3}
                  className="mt-2 w-full rounded-md border border-zinc-700 bg-[#1f1a14] px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={responding}
                  onClick={() => submitResponse(review._id)}
                  className="mt-2 rounded-md bg-[#ef9f27] px-3 py-1 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {responding ? "Submitting..." : "Submit response"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const statusPipeline = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

function SellerStatusUpdater({ order, onClose, onUpdated }) {
  const dispatch = useDispatch();
  // TODO: Replace with memoized selector from store/selectors.js
  const updateStatusState = useSelector((state) => state.orders);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [courierName, setCourierName] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  const currentIdx = statusPipeline.indexOf(order.orderStatus);
  const nextStatuses = statusPipeline.slice(Math.max(currentIdx + 1, 1));

  const submit = async () => {
    if (!status) return notifyError("Please select next status");
    try {
      await dispatch(updateOrderStatus({ orderId: order._id, status, note, awbNumber, courierName, estimatedDelivery })).unwrap();
      notifySuccess("Order status updated");
      onUpdated();
      onClose();
    } catch (error) {
      notifyError(error || "Failed to update status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-[#1f1a14] p-5">
        <h3 className="mb-3 text-lg font-semibold">Update Status</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          <option value="">Select next status</option>
          {nextStatuses.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
        </select>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Optional note" className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
        {status === "shipped" && (
          <div className="mt-3 space-y-2">
            <input value={awbNumber} onChange={(e) => setAwbNumber(e.target.value)} placeholder="AWB number" className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="Courier name" className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input type="date" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-md border border-zinc-700 py-2 text-sm">Close</button>
          <button type="button" onClick={submit} disabled={updateStatusState.status === "loading"} className="flex-1 rounded-md bg-[#ef9f27] py-2 text-sm font-semibold text-black disabled:opacity-60">
            {updateStatusState.status === "loading" ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [active, setActive] = useState("overview");
  const [productsPage, setProductsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [productSearch, setProductSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formState, setFormState] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState(null);
  const [responseOrder, setResponseOrder] = useState(null);
  const [statusOrder, setStatusOrder] = useState(null);

  const { data: stats, isLoading: statsLoading } = useGetSellerStatsQuery(undefined, { skip: !isAuthenticated });
  const { data: categoriesData = [] } = useGetCategoriesQuery();
  const { data: productsData, isLoading: productsLoading } = useGetSellerProductsQuery({ page: productsPage, limit: 10, search: productSearch }, { skip: !isAuthenticated });
  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetSellerOrdersQuery({ page: ordersPage, limit: 10, status: statusFilter || undefined }, { skip: !isAuthenticated });

  const [addProduct, { isLoading: isAdding }] = useAddSellerProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateSellerProductMutation();
  const [removeProduct, { isLoading: isDeleting }] = useDeleteSellerProductMutation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/" replace />;

  const submitForm = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formState.name);
    payload.append("category", formState.category);
    payload.append("brand", formState.brand);
    payload.append("description", formState.description);
    payload.append("mrp", formState.mrp);
    payload.append("price", formState.price);
    payload.append("stock", formState.stock || "0");
    payload.append("hasVariants", String(Boolean(formState.hasVariants)));
    payload.append("tags", formState.tags || "");
    if (formState.hasVariants) {
      const attrOptionsMap = formState.attributeOptions
        .filter((row) => row.name.trim())
        .reduce((acc, row) => ({
          ...acc,
          [row.name.trim()]: row.values.split(",").map((v) => v.trim()).filter(Boolean)
        }), {});
      payload.append("attributeOptions", JSON.stringify(attrOptionsMap));
      payload.append("variants", JSON.stringify(formState.variants));
    }

    const specsPayload = formState.specs
      .filter((spec) => spec.key && spec.value)
      .reduce((acc, spec) => ({ ...acc, [spec.key]: spec.value }), {});
    payload.append("specs", JSON.stringify(specsPayload));

    formState.images.forEach((file) => payload.append("images", file));

    if (editTarget) {
      await updateProduct({ id: editTarget._id, formData: payload }).unwrap();
      setEditTarget(null);
    } else {
      await addProduct(payload).unwrap();
    }

    setFormState(emptyForm);
    setActive("products");
  };

  const startEdit = (product) => {
    setEditTarget(product);
    setFormState({
      name: product.name || "",
      category: product.category?._id || "",
      brand: product.brand || "",
      description: product.description || "",
      mrp: product.mrp || "",
      price: product.price || "",
      stock: product.stock || "",
      hasVariants: Boolean(product.hasVariants),
      attributeOptions: product.attributeOptions
        ? Object.entries(product.attributeOptions).map(([name, values]) => ({ name, values: Array.isArray(values) ? values.join(", ") : "" }))
        : [{ name: "", values: "" }],
      variants: Array.isArray(product.variants) ? product.variants.map((v) => ({
        sku: v.sku || "",
        attributes: v.attributes || {},
        stock: Number(v.stock || 0),
        priceDelta: Number(v.priceDelta || 0),
        isActive: v.isActive !== false
      })) : [],
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      specs: Object.entries(product.specs || {}).length
        ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }],
      images: []
    });
    setActive("add");
  };

  const statCards = [
    { label: "Total Revenue", value: `Rs ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: "Rs" },
    { label: "Total Orders", value: String(stats?.totalOrders || 0), icon: "Bag" },
    { label: "Total Products", value: String(stats?.totalProducts || 0), icon: "Box" },
    { label: "Avg Rating", value: `${Number(stats?.avgRating || 0).toFixed(1)} ?`, icon: "Star" }
  ];

  return (
    <main className="min-h-screen bg-[#19120b] px-4 py-6 text-[#efe0d3] md:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-3">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActive(section)}
              className={`mb-2 w-full rounded-md px-3 py-2 text-left capitalize ${active === section ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zinc-200"}`}
            >
              {section === "add" ? "Add Product" : section === "overview" ? "Dashboard" : section}
            </button>
          ))}
        </aside>

        <section className="space-y-5">
          {active === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                  <div key={card.label} className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-400">{card.label}</p>
                    <p className="mt-2 text-2xl font-bold text-[#ef9f27]">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                <h3 className="mb-3 text-lg font-semibold">Revenue (Last 6 Months)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.revenueByMonth || []}>
                      <defs>
                        <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef9f27" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef9f27" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#3a3127" strokeDasharray="3 3" />
                      <XAxis dataKey="month" stroke="#bca892" />
                      <YAxis stroke="#bca892" />
                      <Tooltip
                        contentStyle={{ background: "#1f1a14", border: "1px solid #3a3127", color: "#efe0d3" }}
                        formatter={(value) => [`Rs ${Number(value).toLocaleString()}`, "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#ef9f27" fill="url(#amberGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                  <h3 className="mb-3 text-lg font-semibold">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-zinc-400">
                          <th className="py-2">Order</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(stats?.recentOrders || []).map((order) => (
                          <tr key={order._id} className="border-t border-zinc-800">
                            <td className="py-2">#{String(order._id).slice(-6)}</td>
                            <td>{order.customer?.name || "Customer"}</td>
                            <td>{order.items?.length || 0}</td>
                            <td>Rs {Number(order.total || 0).toLocaleString()}</td>
                            <td><span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">{order.orderStatus}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                  <h3 className="mb-3 text-lg font-semibold">Top Products</h3>
                  <div className="space-y-2">
                    {(stats?.topProducts || []).map((product, index) => (
                      <div key={product._id} className="flex items-center gap-3 rounded-md bg-zinc-900 p-2">
                        <span className="w-6 text-center text-sm font-semibold text-[#ef9f27]">{index + 1}</span>
                        <img src={product.images?.[0]} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-zinc-400">Sold: {product.sold || 0}</p>
                        </div>
                        <p className="text-sm font-semibold">Rs {Number((product.sold || 0) * (product.price || 0)).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {active === "products" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
                <button type="button" onClick={() => { setEditTarget(null); setFormState(emptyForm); setActive("add"); }} className="rounded-md bg-[#ef9f27] px-4 py-2 font-semibold text-black">Add Product</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400">
                      <th className="py-2">Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Sold</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(productsData?.products || []).map((product) => (
                      <tr key={product._id} className="border-t border-zinc-800">
                        <td className="py-2"><img src={product.images?.[0]} alt={product.name} className="h-10 w-10 rounded object-cover" /></td>
                        <td>{product.name}</td>
                        <td>Rs {Number(product.price).toLocaleString()}</td>
                        <td>{product.stock}</td>
                        <td>{product.sold}</td>
                        <td>
                          <button
                            type="button"
                            onClick={async () => {
                              const fd = new FormData();
                              fd.append("isActive", String(!product.isActive));
                              await updateProduct({ id: product._id, formData: fd });
                            }}
                            className={`rounded-full px-2 py-1 text-xs ${product.isActive ? "bg-green-900 text-green-300" : "bg-zinc-800 text-zinc-400"}`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => startEdit(product)} className="rounded bg-zinc-800 px-2 py-1 text-xs">Edit</button>
                            <button type="button" disabled={isDeleting} onClick={() => removeProduct(product._id)} className="rounded bg-red-900 px-2 py-1 text-xs text-red-200">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-2">
                {Array.from({ length: productsData?.pages || 0 }).map((_, idx) => {
                  const page = idx + 1;
                  return <button type="button" key={page} onClick={() => setProductsPage(page)} className={`rounded px-3 py-1 text-sm ${productsPage === page ? "bg-[#ef9f27] text-black" : "bg-zinc-800"}`}>{page}</button>;
                })}
              </div>
            </div>
          )}

          {active === "orders" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-4 flex items-center gap-3">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100">
                  <option value="">All Status</option>
                  <option value="placed">Placed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400">
                      <th className="py-2">Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(ordersData?.orders || []).map((order) => (
                      <tr key={order._id} className="border-t border-zinc-800">
                        <td className="py-2">#{String(order._id).slice(-6)}</td>
                        <td>{order.user?.name || "Customer"}</td>
                        <td>{order.items?.length || 0}</td>
                        <td>Rs {Number(order.sellerTotal || 0).toLocaleString()}</td>
                        <td><span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">{order.orderStatus}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setStatusOrder(order)} className="rounded bg-[#ef9f27] px-2 py-1 text-xs text-black">
                              Update status
                            </button>
                            <button type="button" onClick={() => setResponseOrder(order)} className="rounded bg-zinc-800 px-2 py-1 text-xs">
                              Respond to review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-2">
                {Array.from({ length: ordersData?.pages || 0 }).map((_, idx) => {
                  const page = idx + 1;
                  return <button type="button" key={page} onClick={() => setOrdersPage(page)} className={`rounded px-3 py-1 text-sm ${ordersPage === page ? "bg-[#ef9f27] text-black" : "bg-zinc-800"}`}>{page}</button>;
                })}
              </div>
            </div>
          )}

          {active === "add" && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">{editTarget ? "Edit Product" : "Add Product"}</h2>
              <ProductForm
                value={formState}
                categories={categoriesData}
                onChange={setFormState}
                onSubmit={submitForm}
                submitting={isAdding || isUpdating}
                submitLabel={editTarget ? "Update Product" : "Create Product"}
              />
            </div>
          )}

          {(statsLoading || productsLoading || ordersLoading) && <p className="text-sm text-zinc-400">Loading seller data...</p>}
        </section>
      </div>
      {responseOrder && <SellerReviewResponder order={responseOrder} onClose={() => setResponseOrder(null)} />}
      {statusOrder && <SellerStatusUpdater order={statusOrder} onClose={() => setStatusOrder(null)} onUpdated={refetchOrders} />}
    </main>
  );
}
