import { useEffect, useState } from "react";

const TOAST_EVENT = "zivvo:toast";

const dispatchToast = (type, message) => {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { id: `${Date.now()}-${Math.random()}`, type, message }
    })
  );
};

export const notifySuccess = (msg) => dispatchToast("success", msg);
export const notifyError = (msg) => dispatchToast("error", msg);

export function ToastViewport() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onToast = (event) => {
      const toast = event.detail;
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, 2600);
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-3 py-2 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-green-500/40 bg-[#1f1a14] text-green-300"
              : "border-red-500/40 bg-[#1f1a14] text-red-300"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
