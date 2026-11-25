import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage can be blocked; the choice still applies to this visit.
    }
  }
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={dark ? "Use light theme" : "Use dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      {dark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
    </button>
  );
}
