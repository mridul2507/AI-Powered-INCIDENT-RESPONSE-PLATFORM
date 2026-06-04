"use client";

import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {motion} from "framer-motion";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (                    
    
    <div className="flex items-center justify-between mb-8">

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 bg-white dark:bg-emerald-950
       border border-gray-300 rounded-xl px-4 py-3 w-[400px]
      focus-within:border-black">

        <Search className="text-gray-400" size={20} />

        <input
          type="text"
          placeholder="Search incidents, logs..."
          className="outline-none w-full text-gray-700"
        />

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* DARK MODE TOGGLE */}
        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="
            p-3
            bg-white dark:bg-emerald-950
            border
            border-gray-300
            rounded-xl
            cursor-pointer
            hover:bg-gray-100
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

        <div className="p-3 bg-white dark:bg-emerald-950 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
          <Bell className="text-gray-700" size={20} />
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-emerald-950 border border-gray-300 rounded-xl px-4 py-2">

          <div className="w-10 h-10 rounded-full bg-green-900"></div>

          <div>
            <p className="font-semibold text-sm">
              Mridul
            </p>

            <p className="text-xs text-gray-500 dark:text-slate-400">
              Admin
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}