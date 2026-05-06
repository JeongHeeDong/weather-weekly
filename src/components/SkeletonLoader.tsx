export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-2xl p-6 h-48" style={{ background: "var(--card-bg)" }}>
        <div className="h-6 w-32 rounded-full bg-gray-300 dark:bg-gray-700 mb-4" />
        <div className="h-16 w-24 rounded-xl bg-gray-300 dark:bg-gray-700 mb-4" />
        <div className="flex gap-4">
          <div className="h-4 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-xl p-3 h-28" style={{ background: "var(--card-bg)" }}>
            <div className="h-3 w-8 rounded-full bg-gray-300 dark:bg-gray-700 mb-2 mx-auto" />
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 mb-2 mx-auto" />
            <div className="h-3 w-10 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
