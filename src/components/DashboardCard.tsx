"use client"
import { motion } from "framer-motion"

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }} 
      className="bg-white dark:bg-emerald-950 p-6 rounded-2xl border border-gray-300 w-full shadow-sm
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center gap-2 ease-in-out">
        <Icon className="text-gray-400"/>   

        <h2 className="text-gray-500 dark:text-slate-400 text-sm">{title}</h2>
      </div>

      <p className="text-3xl font-bold text-green-900 dark:text-green-400 mt-2">
        {value}
      </p>
    </motion.div>
  );
}