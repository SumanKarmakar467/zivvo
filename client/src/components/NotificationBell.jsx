import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  fetchNotifications,
  markAllAsRead,
  markAsRead
} from "../features/notifications/notificationsSlice";
import { selectUnreadCount } from "../store/selectors";

const typeIcon = {
  new_order: "🛒",
  order_status: "📦",
  review_received: "⭐",
  low_stock: "⚠",
  promo: "🏷"
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadCount = useSelector(selectUnreadCount);
  // TODO: Replace with memoized selector from store/selectors.js
  const items = useSelector((state) => state.notifications.items);
  // TODO: Replace with memoized selector from store/selectors.js
  const status = useSelector((state) => state.notifications.status);

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (!open) return;
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [open, dispatch]);

  const badge = useMemo(() => {
    if (unreadCount <= 0) return null;
    return unreadCount > 9 ? "9+" : String(unreadCount);
  }, [unreadCount]);

  const openNotification = async (notif) => {
    if (!notif.isRead) await dispatch(markAsRead(notif._id));
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="relative rounded-full border border-zinc-700 p-2 text-zinc-200 hover:text-[#ef9f27]">
        <span>🔔</span>
        {badge && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{badge}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] max-w-[92vw] rounded-xl border border-zinc-700 bg-[#1f1a14] shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-700 px-3 py-2">
            <p className="text-sm font-semibold">Notifications</p>
            <button type="button" onClick={() => dispatch(markAllAsRead())} className="text-xs text-[#ef9f27]">Mark all read</button>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-2">
            {status === "loading" ? (
              <p className="p-2 text-xs text-zinc-400">Loading...</p>
            ) : items.length === 0 ? (
              <p className="p-2 text-xs text-zinc-400">No notifications yet.</p>
            ) : (
              items.map((notif) => (
                <div key={notif._id} className="mb-2 rounded-lg border border-zinc-800 bg-zinc-900 p-2">
                  <button type="button" onClick={() => openNotification(notif)} className="w-full text-left">
                    <div className="flex items-start gap-2">
                      <span>{typeIcon[notif.type] || "🔔"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{notif.title}</p>
                        <p className="line-clamp-2 text-xs text-zinc-400">{notif.body}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                      </div>
                      {!notif.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />}
                    </div>
                  </button>
                  <button type="button" onClick={() => dispatch(deleteNotification(notif._id))} className="mt-2 text-[11px] text-red-300">Delete</button>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-zinc-700 p-2 text-center">
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs text-[#ef9f27]">See all</Link>
          </div>
        </div>
      )}
    </div>
  );
}
