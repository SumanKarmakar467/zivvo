import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) params.set("q", value.trim());
      else params.delete("q");
      params.set("page", "1");
      setSearchParams(params, { replace: true });
      setIsTyping(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 pr-10 text-sm text-zivvo-text-base outline-none focus:border-[#ef9f27]"
      />
      {isTyping && (
        <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-600 border-t-[#ef9f27]" />
      )}
    </form>
  );
}
