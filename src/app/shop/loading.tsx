export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="h-4 w-24 bg-brand-mid/10 mb-4 animate-pulse" />
      <div className="h-8 w-64 bg-brand-mid/10 mb-2 animate-pulse" />
      <div className="h-4 w-32 bg-brand-mid/10 mb-8 animate-pulse" />

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 bg-brand-mid/10 animate-pulse" />
          ))}
        </aside>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-brand-mid/20">
              <div className="h-40 bg-brand-mid/10 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-brand-mid/10 animate-pulse" />
                <div className="h-3 w-1/2 bg-brand-mid/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}