import React from "react";
export default function ShopPopScoreBadge({ score }) { if (!score || score < 70) return null; return <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Score {score}</span>; }

