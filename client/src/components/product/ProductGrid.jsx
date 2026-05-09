import React from "react";
import ProductCard from "./ProductCard";
export default function ProductGrid({ products = [] }) { return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>; }
