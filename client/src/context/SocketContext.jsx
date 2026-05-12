import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!token) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      return;
    }

    const socketUrl = String(import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
    const nextSocket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"]
    });
    setSocket(nextSocket);

    return () => nextSocket.disconnect();
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
