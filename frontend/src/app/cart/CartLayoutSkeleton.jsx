import { Skeleton } from "@/components/Skeleton";
import CartMiniItemSkeleton from "../../components/cart/CartMiniItemSkeleton";

const CartLayoutSkeleton = ({ children }) => {
    return (
        <section className="flex items-start xl:gap-10 gap-5">
            {/*//! Main Content Skeleton */}
            <article className="lg:block hidden flex-1">
                <div className="border border-border rounded-lg px-6 py-7 space-y-6">

                    {children}

                </div>
            </article>

            {/*//! Side Content Skeleton */}
            <aside className="xl:w-[440px] lg:w-[300px] w-full border border-border rounded-lg xl:py-8 xl:px-6 lg:py-3 lg:px-3.5 md:p-8 p-4">
                {/*//! Header Skeleton */}
                <div className="md:flex hidden items-center justify-between pb-4 mb-4 border-b border-border">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="w-6 h-6" />
                </div>

                {/*//! Cart Items List Skeleton */}
                <div className="max-h-56 lg:hidden block overflow-hidden pb-4 mb-4 border-b border-border overflow-y-auto">
                    <div className="border border-border rounded-lg px-6 py-7 space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <CartMiniItemSkeleton key={index} />
                        ))}
                    </div>
                </div>

                {/*//! Discounts & Shipping Skeleton */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="pb-4 mb-4 border-b border-border">
                    <div className="flex items-center justify-between mb-2.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-16" />
                </div>

                {/*//! Total Price Skeleton */}
                <div className="flex items-center justify-between pb-4 md:mb-4 mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                </div>

                {/*//! Checkout Button Skeleton */}
                <Skeleton className="h-10" />
            </aside>
        </section>
    );
}

export default CartLayoutSkeleton;
