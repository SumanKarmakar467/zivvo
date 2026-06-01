import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "/api";
const HEALTH_URL = `${String(API_BASE).replace(/\/$/, "")}/health`;
const WAKE_TIMEOUT_MS = 60000;

export default function ServerWakeUp() {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const deadline = Date.now() + WAKE_TIMEOUT_MS;
    const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

    const checkHealth = async () => {
      while (active && Date.now() < deadline) {
        try {
          const response = await fetch(HEALTH_URL, {
            method: "GET",
            credentials: "include",
            signal: controller.signal
          });

          if (response.ok) break;
        } catch {
          // Retry until the server wakes or the timeout expires.
        }

        await delay(2000);
      }

      if (active) setWaiting(false);
    };

    checkHealth();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (!waiting) return null;

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#05060F] px-6 text-center text-[#F8F5EF]">
      <div className="w-full max-w-md">
        <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-[#22D3EE]/20 p-4 shadow-[0_0_45px_rgba(34,211,238,0.35)]">
          <div className="h-full w-full rounded-full bg-[#22D3EE]" />
        </div>
        <div className="mt-8 space-y-3">
          <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-white/10" />
          <h1 className="text-2xl font-black tracking-wide">Waking up the server, please wait…</h1>
          <div className="mx-auto h-3 w-full max-w-xs animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
