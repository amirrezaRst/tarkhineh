const CartItemSkeleton = () => {
    return (
        <div className="flex border border-gray-300 rounded-lg overflow-hidden animate-pulse">
            {/*//! Skeleton Image */}
            <div className="xl:w-40 w-[8.5rem] bg-gray-200"></div>

            {/*//! Skeleton Content */}
            <div className="py-5 px-6 flex-1 flex flex-col justify-between gap-5">
                {/*//! Title & Delete Button */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>

                {/*//! Ingredients & Discount */}
                <div className="flex items-center justify-between gap-3">
                    <div className="w-full flex flex-col gap-1">
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-2/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-10 bg-gray-200 rounded"></div>
                </div>

                {/*//! Quantity & Price */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-200 flex items-center gap-2 rounded-md px-4 py-2 w-24 h-10"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export default CartItemSkeleton;