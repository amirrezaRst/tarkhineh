// Loading skeletons that mirror the real shape they stand in for, so the
// layout doesn't shift when data arrives (no CLS) and loading reads as
// intentional, not a spinner. The shimmer sweep itself lives in the
// `.skeleton` CSS class (globals.css) so every variant here — and any new
// one — gets it for free, in both themes, and drops it under
// prefers-reduced-motion automatically.

export const Skeleton = ({ className = "" }) => (
    <div className={`skeleton rounded-lg ${className}`} />
);

// For a skeleton drawn directly on a dark/tinted surface (a gradient hero
// tile, a colored card) where the token-based `.skeleton` fill wouldn't read.
export const SkeletonLight = ({ className = "" }) => (
    <div className={`skeleton-light rounded-lg ${className}`} />
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

// Horizontal card (image left, body right) — the shape panel/admin menu
// grids and the public /menus page cards use.
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

// Vertical card (image top, body below) — the branch page's own menu grid.
export const SkeletonMenuCardVertical = () => (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft flex flex-col">
        <Skeleton className="h-[150px] rounded-none" />
        <div className="p-4 flex flex-col gap-2.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center justify-between mt-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl mt-1" />
        </div>
    </div>
);

// The branch card used on the homepage and every branch-picker grid.
export const SkeletonBranchCard = () => (
    <div className="bg-surface border border-border rounded-lg overflow-hidden md:h-[410px] h-[140px] md:block flex">
        <Skeleton className="md:w-full w-[45%] md:h-[280px] h-full rounded-none" />
        <div className="flex-1 md:p-5 p-4 flex flex-col items-center justify-center gap-2.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-4/5" />
        </div>
    </div>
);

export const SkeletonCommentCard = () => (
    <div className="bg-surface border border-border rounded-2xl shadow-soft p-5">
        <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-11 w-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-20" />
            </div>
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-4/5" />
    </div>
);

export const SkeletonCartItem = () => (
    <div className="flex gap-3.5 p-4 bg-surface border border-border rounded-2xl">
        <Skeleton className="h-[76px] w-[76px] rounded-xl shrink-0" />
        <div className="flex-1 flex flex-col justify-between py-0.5">
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-4 w-14" />
            </div>
        </div>
    </div>
);

// One row of a search-as-you-type dropdown (GlobalSearch, UserPicker).
export const SkeletonSearchRow = () => (
    <div className="flex items-center gap-3 px-3.5 py-2.5">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-2/5" />
            <Skeleton className="h-2 w-1/4" />
        </div>
    </div>
);

// One row of the admin activity bell.
export const SkeletonActivityRow = () => (
    <div className="flex items-center gap-3 px-3.5 py-3">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-2.5 w-2/5" />
        </div>
        <Skeleton className="h-2.5 w-10 shrink-0" />
    </div>
);
