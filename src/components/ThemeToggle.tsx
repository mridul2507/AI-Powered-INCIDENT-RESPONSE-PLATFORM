"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="
        p-3
        bg-white dark:bg-emerald-950
        border border-gray-300 dark:border-slate-700
        rounded-xl
        hover:bg-gray-100 dark:hover:bg-slate-800
        transition-all
      "
    >
      <motion.div
        animate={{
            rotate: theme === "dark" ? 180 : 0,
            scale: theme === "dark" ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        >
        {theme === "dark" ? (
            <Sun className="text-yellow-500" size={20} />
        ) : (
            <Moon className="text-gray-700" size={20} />
        )}
        </motion.div>
    </button>
  );
}