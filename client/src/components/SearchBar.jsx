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
        className="w-full rounded-xl border border-black/10 bg-brand-bg px-3 py-2 pr-10 text-sm font-semibold text-brand-ink outline-none placeholder:text-brand-inkFaint focus:border-[#e8730a] dark:border-night-border dark:bg-night-muted dark:text-white"
      />
      {isTyping && (
        <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-600 border-t-[#ef9f27]" />
      )}
    </form>
  );
}
