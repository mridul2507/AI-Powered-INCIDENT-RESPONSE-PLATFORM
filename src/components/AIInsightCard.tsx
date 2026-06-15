"use client";

import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";

type Props = {
  title: string;
  icon: React.ReactNode;
  content: string;
  placeholder: string;
  loading: boolean;
  buttonText: string;
  loadingText: string;
  buttonColor: string;
  onClick: () => void;
};

export default function AIInsightCard({
  title,
  icon,
  content,
  placeholder,
  loading,
  buttonText,
  loadingText,
  buttonColor,
  onClick,
}: Props) {
  return (
    <div
      className="
      bg-white
      dark:bg-emerald-950
      border
      border-gray-200
      dark:border-slate-700
      rounded-2xl
      shadow-sm
      p-6
      h-full
      hover:shadow-lg
      transition-all
      duration-300
      mt-6
      max-h-[700px]
      overflow-y-auto
    "
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}

          <h2 className="text-2xl font-semibold text-green-900 dark:text-green-400">
            {title}
          </h2>
        </div>

        <button
          onClick={onClick}
          className={`${buttonColor} text-white px-4 py-2 rounded-xl flex items-center gap-2`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>{loadingText}</span>
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>

      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-blue-700 mt-6 mb-3">
              {children}
            </h2>
          ),

          p: ({ children }) => (
            <p className="leading-8 mb-4 text-gray-700 dark:text-slate-300">
              {children}
            </p>
          ),

          li: ({ children }) => (
            <li className="ml-6 mb-2 list-disc">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-green-700">
              {children}
            </strong>
          ),
        }}
      >
        {content || placeholder}
      </ReactMarkdown>
    </div>
  );
}