import { Button } from '../components/ui/button'
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  // Set initial theme based on localStorage or default to 'light'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    // Apply theme on body tag and save it to localStorage
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <Button
      aria-label="Toggle theme"
      onClick={() => setIsDarkMode((prev) => !prev)}
      variant="ghost"
      size="icon"
      className="w-5 h-5 transition-all duration-200 dark:hover:bg-transparent"
    >
      {isDarkMode ? <Moon size={20} className='dark:text-white' /> : <Sun size={20} />}
    </Button>
  );
};
