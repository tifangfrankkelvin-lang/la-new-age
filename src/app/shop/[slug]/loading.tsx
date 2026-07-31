export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="h-4 w-48 bg-brand-mid/10 mb-6 animate-pulse" />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-brand-mid/10 animate-pulse" />
        <div className="space-y-3">
          <div className="h-3 w-20 bg-brand-mid/10 animate-pulse" />
          <div className="h-8 w-3/4 bg-brand-mid/10 animate-pulse" />
          <div className="h-4 w-1/2 bg-brand-mid/10 animate-pulse" />
          <div className="h-8 w-24 bg-brand-mid/10 animate-pulse mt-4" />
          <div className="h-16 w-full bg-brand-mid/10 animate-pulse mt-4" />
          <div className="h-12 w-40 bg-brand-mid/10 animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}