import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 transition hover:border-[#ef9f27] hover:text-[#ef9f27]">
      {theme === "dark" ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.5 6.5-1.5-1.5M8 8 6.5 6.5m11 0L16 8M8 16l-1.5 1.5" /><circle cx="12" cy="12" r="4" /></svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg>
      )}
    </button>
  );
}
