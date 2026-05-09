import React from "react";
export default function Badge({ children, className = "" }) { return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${className}`}>{children}</span>; }
