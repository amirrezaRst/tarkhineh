import { Skeleton } from "@/components/Skeleton";

const CartItemSkeleton = () => {
    return (
        <div className="flex border border-border rounded-lg overflow-hidden">
            <Skeleton className="xl:w-40 w-[8.5rem] rounded-none shrink-0" />

            <div className="py-5 px-6 flex-1 flex flex-col justify-between gap-5">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="w-6 h-6" />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="w-full flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/4" />
                    </div>
                    <Skeleton className="h-4 w-10 shrink-0" />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <Skeleton className="w-24 h-10 rounded-md" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
        </div>
    );
}

export default CartItemSkeleton;
