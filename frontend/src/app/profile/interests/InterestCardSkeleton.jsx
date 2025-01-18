const InterestCardSkeleton = () => {
    return (
        <div className="bg-white border border-[#CBCBCB] rounded-lg overflow-hidden animate-pulse">
            {/* Skeleton Image */}
            <div className="w-full lg:h-[180px] md:h-40 h-44 bg-gray-200" />

            {/* Skeleton Content */}
            <div className="md:py-5 md:px-4 p-3.5">
                {/* Title and Icon Skeleton */}
                <div className="flex items-center justify-between mb-2.5">
                    <div className="w-2/3 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>

                {/* Stars and Price Skeleton */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-6 h-6 bg-gray-200 rounded-full"
                            ></div>
                        ))}
                    </div>
                    <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                </div>

                {/* Button Skeleton */}
                <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            </div>
        </div>
    );
}

export default InterestCardSkeleton;