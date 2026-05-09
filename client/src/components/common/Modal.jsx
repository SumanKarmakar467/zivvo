import React from "react";
export default function Modal({ open, onClose, children }) { if (!open) return null; return <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={onClose}><div onClick={(e) => e.stopPropagation()} className="mx-auto mt-16 max-w-2xl rounded-xl bg-white p-4">{children}</div></div>; }
