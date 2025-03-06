export default function TicketCardSkeleton() {
  return (
    <div className="bg-primary relative flex rounded-lg shadow-md overflow-hidden h-36">
      {/* Image area skeleton */}
      <div className="aspect-square min-h-full overflow-hidden bg-gradient-to-r from-secondary-300/20 to-secondary-100/30 animate-pulse"></div>

      {/* Content area skeleton */}
      <div className="p-4 pr-8 flex-1">
        <div className="h-5 mb-2 bg-gradient-to-r from-secondary-300/20 to-secondary-100/40 animate-pulse rounded w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-secondary-300/20 to-secondary-100/40 animate-pulse rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gradient-to-r from-secondary-300/20 to-secondary-100/40 animate-pulse rounded w-2/3"></div>
      </div>

      {/* Options button skeleton */}
      <div className="absolute top-4 right-4 w-6 h-6 rounded-sm bg-secondary-200/30 animate-pulse"></div>
    </div>
  );
}
