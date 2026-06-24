"use client";

import { useEffect, useState } from "react";
import { BellCheck, Trash2 } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<
    "ALL" | "READ" | "UNREAD"
  >("ALL");

  useEffect(() => {
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

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "READ") return n.isRead;

    if (filter === "UNREAD") return !n.isRead;

    return true;
  });

  async function handleMarkAllRead() {
    await Promise.all(
      notifications
        .filter((n) => !n.isRead)
        .map((n) =>
          fetch(`/api/notifications/${n.id}`, {
            method: "PATCH",
          })
        )
    );

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );
  }

  async function handleDelete(id: string) {
    await fetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });

    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-green-900 dark:text-green-400">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            System alerts and activity updates
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className=" bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl">
          Mark All Read
        </button>

      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-8">

        <button
          onClick={() => setFilter("ALL")}
          className={`
            px-5 py-2 rounded-xl border
            ${
              filter === "ALL"
                ? "bg-green-700 text-white"
                : ""
            }
          `}
        >
          All
        </button>

        <button
          onClick={() => setFilter("UNREAD")}
          className={`
            px-5 py-2 rounded-xl border
            ${
              filter === "UNREAD"
                ? "bg-green-700 text-white"
                : ""
            }
          `}
        >
          Unread
        </button>

        <button
          onClick={() => setFilter("READ")}
          className={`
            px-5 py-2 rounded-xl border
            ${
              filter === "READ"
                ? "bg-green-700 text-white"
                : ""
            }
          `}
        >
          Read
        </button>

      </div>

      {/* EMPTY STATE */}
      {filteredNotifications.length === 0 && (
        <div
          className=" py-24 flex flex-col items-center justify-center text-center">
          <BellCheck
            size={60}
            className="text-gray-300 mb-6"
          />

          <h2 className="text-2xl font-semibold mb-2">
            No Notifications
          </h2>

          <p className="text-gray-500">
            You're all caught up.
          </p>
        </div>
      )}

      {/* TABLE */}
      {filteredNotifications.length > 0 && (
        <div
          className=" bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700
            rounded-2xl overflow-hidden "
        >
          <table className="w-full">

            <thead className="bg-gray-100 dark:bg-emerald-900">

              <tr>

                <th className="text-left p-5">
                  Title
                </th>

                <th className="text-left p-5">
                  Message
                </th>

                <th className="text-left p-5">
                  Time
                </th>

                <th className="text-left p-5">
                  Status
                </th>

                <th className="text-left p-5">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredNotifications.map(
                (notification) => (
                  <tr
                    key={notification.id}
                    className="
                      border-b
                      border-gray-100
                      dark:border-slate-700
                    "
                  >

                    <td className="p-5 font-semibold">
                      {notification.title}
                    </td>

                    <td className="p-5 text-gray-500">
                      {notification.message}
                    </td>

                    <td className="p-5 text-sm text-gray-500">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </td>

                    <td className="p-5">

                      <span
                        className={`
                          px-3 py-1 rounded-full text-sm
                          ${
                            notification.isRead
                              ? "bg-gray-100 text-gray-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {notification.isRead
                          ? "Read"
                          : "Unread"}
                      </span>

                    </td>

                    <td className="p-5">

                      <button
                        onClick={() =>
                          handleDelete(notification.id)
                        }
                        className="
                          text-red-500
                          hover:text-red-700
                        "
                      >
                        <Trash2 size={18} />
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}