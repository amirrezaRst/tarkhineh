import { Skeleton } from "@/components/Skeleton";

const OrderCardSkeleton = () => (
    <div className="bg-surface border border-border rounded-md md:py-7 md:px-6 py-6 px-4 space-y-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex md:flex-row flex-col-reverse items-start justify-between gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
        </div>

        <Skeleton className="h-2 w-full rounded-full" />

        <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
        </div>

        <div className="flex justify-end">
            <Skeleton className="h-9 w-28 rounded-md" />
        </div>
    </div>
);

export default OrderCardSkeleton;
