import React from "react";
export default function StarRating({ value = 0, count = 0 }) { return <div className="text-xs text-gray-600">? {Number(value).toFixed(1)} ({count})</div>; }
