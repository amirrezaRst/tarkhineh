// Loading skeletons that mirror the real card shapes, so the layout doesn't
// shift when data arrives (CLS) and loading reads as intentional, not a spinner.

export const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-surface-sunken rounded-lg ${className}`} />
);

export const SkeletonStatTile = () => (
    <div className="bg-surface rounded-2xl shadow-soft p-5 flex items-center justify-between gap-4">
        <div className="space-y-2.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
);

export const SkeletonOrderRow = () => (
    <div className="bg-surface rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-7 w-24 rounded-md" />
        </div>
    </div>
);

export const SkeletonMenuCard = () => (
    <div className="bg-surface rounded-2xl shadow-soft overflow-hidden flex h-[200px]">
        <Skeleton className="h-full w-[140px] rounded-none shrink-0" />
        <div className="p-4 flex-1 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-5 w-24 mt-auto" />
        </div>
    </div>
);
