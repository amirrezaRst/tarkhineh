const AddressCardSkeleton = () => {
    return (
        <div className="bg-[#F9F9F9] border border-[#CBCBCB] rounded-lg py-6 px-4">
            <div className="flex items-start justify-between gap-2.5">
                <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="flex gap-1.5">
                    <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
                    <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-[#717171] xl:text-base md:text-super-sm text-sm mt-5">
                <div className="w-1/4 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="w-1/4 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="w-1/3 h-4 bg-gray-300 rounded animate-pulse" />
            </div>
        </div>
    );
}

export default AddressCardSkeleton;