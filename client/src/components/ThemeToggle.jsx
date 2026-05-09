import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("zivvo-theme");
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("zivvo-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:border-[#ef9f27] hover:text-[#ef9f27] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      aria-label="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
