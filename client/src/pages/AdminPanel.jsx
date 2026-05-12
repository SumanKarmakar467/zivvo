import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import useAuth from "../hooks/useAuth";
import {
  useCreateCategoryMutation,
  useCreateCouponMutation,
  useDeleteCategoryMutation,
  useDeleteCouponMutation,
  useGetAllOrdersQuery,
  useGetAllProductsQuery,
  useGetAllUsersQuery,
  useGetCategoriesAdminQuery,
  useGetCouponsQuery,
  useGetDashboardStatsQuery,
  useToggleProductActiveMutation,
  useUpdateCategoryMutation,
  useUpdateCouponMutation,
  useUpdateOrderStatusMutation,
  useUpdateUserMutation
} from "../store/api/adminApi";

const sections = ["dashboard", "users", "products", "orders", "categories", "coupons"];
const pieColors = ["#ef9f27", "#f3b85e", "#d88713", "#8f5f1d", "#5a3d1a"];

const couponEmpty = {
  code: "",
  type: "percent",
  value: "",
  minOrder: "",
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true
};

const categoryEmpty = { name: "", icon: "", image: "" };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-[#1f1a14] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="rounded bg-zinc-800 px-2 py-1 text-xs">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [active, setActive] = useState("dashboard");

  const [userSearch, setUserSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState(categoryEmpty);
  const [editingCategory, setEditingCategory] = useState(null);

  const [couponModal, setCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState(couponEmpty);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { data: stats } = useGetDashboardStatsQuery(undefined, { skip: !isAuthenticated });
  const { data: usersData } = useGetAllUsersQuery({ page: 1, limit: 50, search: userSearch || undefined, role: userRole || undefined }, { skip: !isAuthenticated });
  const { data: categories = [] } = useGetCategoriesAdminQuery(undefined, { skip: !isAuthenticated });
  const { data: productsData } = useGetAllProductsQuery({ page: 1, limit: 50, search: productSearch || undefined, category: productCategory || undefined }, { skip: !isAuthenticated });
  const { data: ordersData } = useGetAllOrdersQuery({ page: 1, limit: 50, status: orderStatus || undefined, search: orderSearch || undefined }, { skip: !isAuthenticated });
  const { data: coupons = [] } = useGetCouponsQuery(undefined, { skip: !isAuthenticated });

  const [updateUser] = useUpdateUserMutation();
  const [toggleProductActive] = useToggleProductActiveMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  const ordersStatusData = useMemo(() => {
    const ob = stats?.ordersByStatus || {};
    return [
      { name: "Placed", value: ob.placed || 0 },
      { name: "Confirmed", value: ob.confirmed || 0 },
      { name: "Shipped", value: ob.shipped || 0 },
      { name: "Delivered", value: ob.delivered || 0 },
      { name: "Cancelled", value: ob.cancelled || 0 }
    ];
  }, [stats]);

  const statCards = [
    { label: "Revenue", value: `Rs ${Number(stats?.totalRevenue || 0).toLocaleString()}` },
    { label: "Orders", value: String(stats?.totalOrders || 0) },
    { label: "Users", value: String(stats?.totalUsers || 0) },
    { label: "Products", value: String(stats?.totalProducts || 0) },
    { label: "Sellers", value: String(stats?.totalSellers || 0) }
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
              {section}
            </button>
          ))}
        </aside>

        <section className="space-y-5">
          {active === "dashboard" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {statCards.map((card) => (
                  <div key={card.label} className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-400">{card.label}</p>
                    <p className="mt-2 text-xl font-bold text-[#ef9f27]">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                  <h3 className="mb-3 text-lg font-semibold">Revenue by Month (12)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.revenueByMonth || []}>
                        <XAxis dataKey="month" stroke="#bca892" />
                        <YAxis stroke="#bca892" />
                        <Tooltip contentStyle={{ background: "#1f1a14", border: "1px solid #3a3127" }} formatter={(v) => [`Rs ${Number(v).toLocaleString()}`, "Revenue"]} />
                        <Line type="monotone" dataKey="revenue" stroke="#ef9f27" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                  <h3 className="mb-3 text-lg font-semibold">Orders by Status</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ordersStatusData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>
                          {ordersStatusData.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#1f1a14", border: "1px solid #3a3127" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
                <h3 className="mb-3 text-lg font-semibold">Recent Orders</h3>
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
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentOrders || []).map((order) => (
                        <tr key={order._id} className="border-t border-zinc-800">
                          <td className="py-2">#{String(order._id).slice(-6)}</td>
                          <td>{order.user?.name || "User"}</td>
                          <td>{order.items?.length || 0}</td>
                          <td>Rs {Number(order.total || 0).toLocaleString()}</td>
                          <td><span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">{order.orderStatus}</span></td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {active === "users" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search name/email" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
                  <option value="">All roles</option>
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead><tr className="text-left text-zinc-400"><th className="py-2">User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {(usersData?.users || []).map((u) => (
                      <tr key={u._id} className="border-t border-zinc-800">
                        <td className="py-2 flex items-center gap-2"><img src={u.avatar || "https://placehold.co/40x40"} alt={u.name} className="h-8 w-8 rounded-full object-cover" />{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">{u.role}</span></td>
                        <td><span className={`rounded-full px-2 py-0.5 text-xs ${u.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-200"}`}>{u.isActive ? "Active" : "Banned"}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => updateUser({ id: u._id, body: { isActive: !u.isActive } })} className="rounded bg-zinc-800 px-2 py-1 text-xs">{u.isActive ? "Ban" : "Unban"}</button>
                            <select value={u.role} onChange={(e) => updateUser({ id: u._id, body: { role: e.target.value } })} className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs">
                              <option value="user">user</option><option value="seller">seller</option><option value="admin">admin</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "products" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search product" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
                  <option value="">All categories</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead><tr className="text-left text-zinc-400"><th className="py-2">Image</th><th>Name</th><th>Seller</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {(productsData?.products || []).map((p) => (
                      <tr key={p._id} className="border-t border-zinc-800">
                        <td className="py-2"><img src={p.images?.[0]} alt={p.name} className="h-10 w-10 rounded object-cover" /></td>
                        <td>{p.name}</td>
                        <td>{p.seller?.name || "-"}</td>
                        <td>{p.category?.name || "-"}</td>
                        <td>Rs {Number(p.price).toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td><span className={`rounded-full px-2 py-0.5 text-xs ${p.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-200"}`}>{p.isActive ? "Active" : "Inactive"}</span></td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => toggleProductActive(p._id)} className="rounded bg-zinc-800 px-2 py-1 text-xs">Toggle</button>
                            <a href={`/product/${p.slug}`} className="rounded bg-zinc-800 px-2 py-1 text-xs">View</a>
                            <button onClick={() => toggleProductActive(p._id)} className="rounded bg-red-900 px-2 py-1 text-xs text-red-200">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "orders" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search order/customer" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
                  <option value="">All statuses</option>
                  <option value="placed">placed</option><option value="confirmed">confirmed</option><option value="shipped">shipped</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead><tr className="text-left text-zinc-400"><th className="py-2">Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {(ordersData?.orders || []).map((o) => (
                      <>
                        <tr key={o._id} className="cursor-pointer border-t border-zinc-800" onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}>
                          <td className="py-2">#{String(o._id).slice(-6)}</td>
                          <td>{o.user?.name || "User"}</td>
                          <td>{o.items?.length || 0}</td>
                          <td>Rs {Number(o.total || 0).toLocaleString()}</td>
                          <td>{o.paymentStatus}</td>
                          <td>
                            <select value={o.orderStatus} onChange={(e) => updateOrderStatus({ id: o._id, status: e.target.value })} className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs" onClick={(e) => e.stopPropagation()}>
                              <option value="placed">placed</option><option value="confirmed">confirmed</option><option value="processing">processing</option><option value="shipped">shipped</option><option value="out_for_delivery">out_for_delivery</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option>
                            </select>
                          </td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                        {expandedOrder === o._id && (
                          <tr className="border-t border-zinc-800 bg-zinc-900/40">
                            <td colSpan="7" className="py-2">
                              <div className="space-y-1 text-xs text-zinc-300">
                                {(o.items || []).map((item, idx) => <p key={`${o._id}-${idx}`}>{item.name} x {item.quantity} = Rs {Number(item.price * item.quantity).toLocaleString()}</p>)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "categories" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-3 flex justify-end"><button onClick={() => { setEditingCategory(null); setCategoryForm(categoryEmpty); setCategoryModal(true); }} className="rounded bg-[#ef9f27] px-3 py-2 text-sm font-semibold text-black">Add Category</button></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => (
                  <div key={c._id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    <div className="mb-2 flex items-center gap-2"><span className="text-xl">{c.icon || "??"}</span><p className="font-semibold">{c.name}</p></div>
                    <p className="mb-3 text-xs text-zinc-400">Products: {(stats?.topCategories || []).find((x) => x.name === c.name)?.productCount || 0}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCategory(c); setCategoryForm({ name: c.name || "", icon: c.icon || "", image: c.image || "" }); setCategoryModal(true); }} className="rounded bg-zinc-800 px-2 py-1 text-xs">Edit</button>
                      <button onClick={() => deleteCategory(c._id)} className="rounded bg-red-900 px-2 py-1 text-xs text-red-200">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "coupons" && (
            <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
              <div className="mb-3 flex justify-end"><button onClick={() => { setEditingCoupon(null); setCouponForm(couponEmpty); setCouponModal(true); }} className="rounded bg-[#ef9f27] px-3 py-2 text-sm font-semibold text-black">Add Coupon</button></div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead><tr className="text-left text-zinc-400"><th className="py-2">Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Usage</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {coupons.map((cp) => (
                      <tr key={cp._id} className="border-t border-zinc-800">
                        <td className="py-2 font-semibold text-[#ef9f27]">{cp.code}</td>
                        <td>{cp.type}</td>
                        <td>{cp.value}</td>
                        <td>{cp.minOrder || 0}</td>
                        <td>{cp.usedCount || 0}/{cp.usageLimit ?? "8"}</td>
                        <td>{cp.expiresAt ? new Date(cp.expiresAt).toLocaleDateString() : "-"}</td>
                        <td><span className={`rounded-full px-2 py-0.5 text-xs ${cp.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-200"}`}>{cp.isActive ? "Active" : "Inactive"}</span></td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingCoupon(cp); setCouponForm({ ...couponEmpty, ...cp, expiresAt: cp.expiresAt ? new Date(cp.expiresAt).toISOString().slice(0, 10) : "" }); setCouponModal(true); }} className="rounded bg-zinc-800 px-2 py-1 text-xs">Edit</button>
                            <button onClick={() => deleteCoupon(cp._id)} className="rounded bg-red-900 px-2 py-1 text-xs text-red-200">Delete</button>
                            <button onClick={() => updateCoupon({ id: cp._id, body: { isActive: !cp.isActive } })} className="rounded bg-zinc-800 px-2 py-1 text-xs">Toggle</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {categoryModal && (
        <Modal title={editingCategory ? "Edit Category" : "Add Category"} onClose={() => setCategoryModal(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (editingCategory) await updateCategory({ id: editingCategory._id, body: categoryForm });
              else await createCategory(categoryForm);
              setCategoryModal(false);
            }}
            className="space-y-3"
          >
            <input placeholder="Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" required />
            <input placeholder="Icon emoji" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input placeholder="Image URL" value={categoryForm.image} onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <button className="w-full rounded bg-[#ef9f27] py-2 font-semibold text-black">Save</button>
          </form>
        </Modal>
      )}

      {couponModal && (
        <Modal title={editingCoupon ? "Edit Coupon" : "Add Coupon"} onClose={() => setCouponModal(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const payload = { ...couponForm, code: String(couponForm.code || "").toUpperCase() };
              if (editingCoupon) await updateCoupon({ id: editingCoupon._id, body: payload });
              else await createCoupon(payload);
              setCouponModal(false);
            }}
            className="space-y-3"
          >
            <input placeholder="Code" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" required />
            <select value={couponForm.type} onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"><option value="percent">percent</option><option value="flat">flat</option><option value="freeship">freeship</option></select>
            <input type="number" placeholder="Value" value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" required />
            <input type="number" placeholder="Min Order" value={couponForm.minOrder} onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input type="number" placeholder="Max Discount" value={couponForm.maxDiscount} onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input type="number" placeholder="Usage Limit" value={couponForm.usageLimit} onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <button className="w-full rounded bg-[#ef9f27] py-2 font-semibold text-black">Save</button>
          </form>
        </Modal>
      )}
    </main>
  );
}
