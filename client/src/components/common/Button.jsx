import React from "react";
export default function Button({ className = "", ...props }) { return <button className={`rounded-md font-medium px-4 py-2 transition ${className}`} {...props} />; }
