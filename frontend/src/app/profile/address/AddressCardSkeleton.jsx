import { Skeleton } from "@/components/Skeleton";

const AddressCardSkeleton = () => {
    return (
        <div className="bg-surface border border-border rounded-lg py-6 px-4">
            <div className="flex items-start justify-between gap-2.5">
                <Skeleton className="w-3/4 h-4" />
                <div className="flex gap-1.5">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-5">
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-1/3 h-4" />
            </div>
        </div>
    );
}

export default AddressCardSkeleton;
