import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../context/SocketContext";
import { addNotification } from "../features/notifications/notificationsSlice";
import { notifySuccess } from "../components/common/Toast";

export function useNotificationSocket() {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return undefined;
    const onNotification = (notif) => {
      dispatch(addNotification(notif));
      notifySuccess(notif.title || "New notification");
    };
    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, [socket, dispatch]);
}

