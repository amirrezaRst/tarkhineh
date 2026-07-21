import CartMiniItemSkeleton from "../../components/cart/CartMiniItemSkeleton";

const CartLayoutSkeleton = ({ children }) => {
    return (
        <section className="flex items-start xl:gap-10 gap-5 animate-pulse">
            {/*//! Main Content Skeleton */}
            <article className="lg:block hidden flex-1">
                <div className="border border-border rounded-lg px-6 py-7 space-y-6">

                    {children}

                </div>
            </article>

            {/*//! Side Content Skeleton */}
            <aside className="xl:w-[440px] lg:w-[300px] w-full border border-gray-300 rounded-lg xl:py-8 xl:px-6 lg:py-3 lg:px-3.5 md:p-8 p-4">
                {/*//! Header Skeleton */}
                <div className="md:flex hidden items-center justify-between pb-4 mb-4 border-b border-gray-300">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>

                {/*//! Cart Items List Skeleton */}
                <div className="max-h-56 lg:hidden block overflow-hidden pb-4 mb-4 border-b border-gray-300 overflow-y-auto">
                    <div className="border border-gray-300 rounded-lg px-6 py-7 space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <CartMiniItemSkeleton key={index} />
                            // <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>

                {/*//! Discounts & Shipping Skeleton */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="pb-4 mb-4 border-b border-gray-300">
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                </div>

                {/*//! Total Price Skeleton */}
                <div className="flex items-center justify-between pb-4 md:mb-4 mb-3">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                </div>

                {/*//! Checkout Button Skeleton */}
                <div className="h-10 bg-gray-300 rounded"></div>
            </aside>
        </section>
    );
}

export default CartLayoutSkeleton;