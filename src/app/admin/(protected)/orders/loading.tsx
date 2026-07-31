export default function AdminOrdersLoading() {
  return (
    <div>
      <div className="h-8 w-40 bg-brand-mid/10 mb-6 animate-pulse" />
      <div className="border border-brand-mid/20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 border-t border-brand-mid/10 first:border-t-0 bg-brand-mid/5 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}