import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme} className="rounded-full border border-white/10 p-2 text-on-surface-variant hover:border-electric-violet hover:text-primary">{theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}</button>;
}
