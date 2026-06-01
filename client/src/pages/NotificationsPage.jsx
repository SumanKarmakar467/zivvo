import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markAllAsRead,
  markAsRead
} from "../features/notifications/notificationsSlice";

const typeIcon = {
  new_order: "🛒",
  order_status: "📦",
  review_received: "⭐",
  low_stock: "⚠",
  promo: "🏷"
};

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // TODO: Replace with memoized selector from store/selectors.js
  const { items, status, error, pages } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ page, limit: 20, unreadOnly: tab === "unread" }));
  }, [dispatch, page, tab]);

  const openItem = async (item) => {
    if (!item.isRead) await dispatch(markAsRead(item._id));
    if (item.link) navigate(item.link);
  };

  return (
    <main className="min-h-screen bg-zivvo-dark-bg px-4 py-6 text-zivvo-text-base md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button type="button" onClick={() => dispatch(markAllAsRead())} className="rounded-md bg-zinc-800 px-3 py-2 text-xs">Mark all as read</button>
        </div>

        <div className="mb-4 flex gap-2">
          <button type="button" onClick={() => { setTab("all"); setPage(1); }} className={`rounded-full px-3 py-1 text-xs ${tab === "all" ? "bg-[#ef9f27] text-black" : "bg-zinc-800"}`}>All</button>
          <button type="button" onClick={() => { setTab("unread"); setPage(1); }} className={`rounded-full px-3 py-1 text-xs ${tab === "unread" ? "bg-[#ef9f27] text-black" : "bg-zinc-800"}`}>Unread</button>
        </div>

        {status === "loading" ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-800" />)}</div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">{error}</p>
            <button type="button" onClick={() => dispatch(fetchNotifications({ page, limit: 20, unreadOnly: tab === "unread" }))} className="mt-2 rounded bg-zinc-800 px-3 py-1 text-xs">Retry</button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <button key={item._id} type="button" onClick={() => openItem(item)} className="w-full rounded-xl border border-zinc-800 bg-zivvo-surface p-3 text-left">
                <div className="flex items-start gap-2">
                  <span>{typeIcon[item.type] || "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="line-clamp-2 text-xs text-zinc-400">{item.body}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
                  </div>
                  {!item.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border border-zinc-700 px-3 py-1 text-xs disabled:opacity-40">Prev</button>
          <span className="text-xs text-zinc-400">Page {page} / {pages || 1}</span>
          <button type="button" disabled={page >= (pages || 1)} onClick={() => setPage((p) => p + 1)} className="rounded border border-zinc-700 px-3 py-1 text-xs disabled:opacity-40">Load more</button>
        </div>
      </div>
    </main>
  );
}
