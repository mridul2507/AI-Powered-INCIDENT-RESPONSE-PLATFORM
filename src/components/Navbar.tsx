"use client";

import { Bell, Search, Moon, Sun, X, BellCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import {motion} from "framer-motion";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    setMounted(true);

    async function fetchNotifications() {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    }

    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter(
        (notification) => !notification.isRead
      ).length
    : 0;

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
          className="outline-none w-full text-gray-700 dark:text-gray-300"
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

        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="
              p-3
              bg-white dark:bg-emerald-950
              border border-gray-300
              rounded-xl
              cursor-pointer
              hover:bg-gray-100
              transition-all
              relative
            "
          >
            <Bell className="text-gray-700" size={20} />
            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-600
                  text-white
                  rounded-full
                  text-xs
                  px-2
                "
              >
                {unreadCount}
              </span>
            )}
          </div>

          {open && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-80
                bg-white dark:bg-emerald-900
                border border-gray-200 dark:border-white
                rounded-2xl
                shadow-xl
                z-50
                p-4
              "
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">
                  Notifications
                </h2>

                <button
                  onClick={async () => {
                    await Promise.all(
                      notifications
                        .filter((n) => !n.isRead)
                        .map((n) =>
                          fetch(
                            `/api/notifications/${n.id}`,
                            {
                              method: "PATCH",
                            }
                          )
                        )
                    );

                    setNotifications(
                      notifications.map((n) => ({
                        ...n,
                        isRead: true,
                      }))
                    );

                    setOpen(false);
                  }}
                  className="
                    text-sm
                    text-green-700
                    hover:underline
                  "
                >
                  Mark all
                </button>
              </div>

              {Array.isArray(notifications) && notifications.length === 0 && (
                <div className=" py-16 flex flex-col items-center justify-center text-center">
                  <BellCheck size={48} className="text-gray-300 mb-4"/>

                  <h2 className="text-xl font-semibold mb-2">
                    No Notifications
                  </h2>
                </div>
              )}

              {Array.isArray(notifications) &&
                notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  onClick={async () => {
                    await fetch(
                      `/api/notifications/${notification.id}`,
                      {
                        method: "PATCH",
                      }
                    );

                    setNotifications(
                      notifications.map((n) =>
                        n.id === notification.id
                          ? { ...n, isRead: true }
                          : n
                      )
                    );
                  }}
                  className={`
                    border-b border-gray-100
                    pb-3 mb-3
                    rounded-xl
                    p-2
                    cursor-pointer
                    transition-colors
                    hover:bg-gray-100
                    ${
                      notification.isRead
                        ? ""
                        : "bg-green-50"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {notification.title}
                      </p>

                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-green-600"/>
                      )}
                    </div>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        await fetch(
                          `/api/notifications/${notification.id}`,
                          {
                            method: "DELETE",
                          }
                        );

                        setNotifications(
                          notifications.filter(
                            (n) => n.id !== notification.id
                          )
                        );
                      }}
                      className="
                        text-gray-400
                        hover:text-red-600
                        transition-colors
                      "
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>{notification.message}</p>

                    <p className="text-xs mt-1 text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-3 text-center">
                <Link
                  href="/notifications"
                  className="
                    text-green-700
                    hover:underline
                  "
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}

        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-emerald-950 border border-gray-300 rounded-xl px-4 py-2">

          <div className="w-10 h-10 rounded-full bg-green-900"></div>

          <div>
            <p className="font-semibold text-sm">
              {session?.user?.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-slate-400">
              {session?.user?.role}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className=" text-sm text-red-500 hover:underline">
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}