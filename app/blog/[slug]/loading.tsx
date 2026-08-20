export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="h-14 bg-bg-primary/95 backdrop-blur-md border-b border-border" />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Skeleton for article header */}
          <div className="mb-6">
            <div className="animate-pulse h-3 w-2/5 bg-bg-elevated rounded mb-2" />
            <div className="animate-pulse h-12 w-4/5 bg-bg-elevated rounded" />
          </div>
          {/* Skeleton for hero image */}
          <div className="animate-pulse h-72 rounded-xl bg-bg-elevated mb-8" />
          {/* Skeleton for content */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse h-4 bg-bg-elevated rounded w-[90%]" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}