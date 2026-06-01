import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between mb-8">

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 w-[400px]
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

        <div className="p-3 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
          <Bell className="text-gray-700" size={20} />
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-2">

          <div className="w-10 h-10 rounded-full bg-green-900"></div>

          <div>
            <p className="font-semibold text-sm">
              Mridul
            </p>

            <p className="text-xs text-gray-500">
              Admin
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}