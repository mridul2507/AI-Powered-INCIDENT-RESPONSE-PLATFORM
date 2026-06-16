export default function SkeletonCard() {
  return (
    <div className=" animate-pulse bg-white dark:bg-emerald-950 border border-gray-200 
        dark:border-slate-700 rounded-2xl p-6 h-72 ">
      <div className=" h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-8 "/>

      <div className="space-y-5">

        <div className=" h-4 w-full rounded bg-gray-200 dark:bg-slate-700 "/>

        <div className=" h-4 w-4/5 rounded bg-gray-200 dark:bg-slate-700 "/>

        <div className=" h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-700 "/>

        <div className=" h-4 w-5/6 rounded bg-gray-200 dark:bg-slate-700 "/>

      </div>

    </div>

  );

}