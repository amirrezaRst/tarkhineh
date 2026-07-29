import { Skeleton } from "@/components/Skeleton";

const InterestCardSkeleton = () => {
    return (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <Skeleton className="w-full lg:h-[180px] md:h-40 h-44 rounded-none" />

            <div className="md:py-5 md:px-4 p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                    <Skeleton className="w-2/3 h-6" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                </div>

                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="w-6 h-6 rounded-full" />
                        ))}
                    </div>
                    <Skeleton className="w-1/4 h-5" />
                </div>

                <Skeleton className="w-full h-10 rounded-md" />
            </div>
        </div>
    );
}

export default InterestCardSkeleton;
