const CartMiniItemSkeleton = () => {
    return (
        <div className="odd:bg-[#F9F9F9] even:bg-[#f0f0f0] flex items-center justify-between py-3 px-4 animate-pulse">
            <div className="flex flex-col justify-between gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="bg-[#E5F2E9] flex items-center justify-between gap-2 py-2.5 px-2 rounded-md">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 w-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

export default CartMiniItemSkeleton;
