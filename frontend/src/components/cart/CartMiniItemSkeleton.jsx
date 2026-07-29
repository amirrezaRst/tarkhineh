import { Skeleton } from "@/components/Skeleton";

const CartMiniItemSkeleton = () => {
    return (
        <div className="flex items-center justify-between py-3 px-4">
            <div className="flex flex-col justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="w-24 h-10 rounded-md" />
        </div>
    );
};

export default CartMiniItemSkeleton;
