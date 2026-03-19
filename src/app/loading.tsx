export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated logo/icon placeholder */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-b-2 border-t-2 border-red-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-black/20 animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
          </div>
        </div>

        {/* Text for visual feedback */}
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground animate-pulse">
            Loading...
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            Preparing the best machinery deals for you.
          </p>
        </div>

        {/* Subtle progress bar simulation */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full origin-left animate-loading-progress bg-red-600"></div>
        </div>
      </div>
    </div>
  );
}
