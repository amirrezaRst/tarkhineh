import { CheckmarkIcon, ChevronIcon, HeartIcon, OutlineStarIcon, SearchIcon, ShoppingCardIcon, StarIcon } from "@/assets/Icons";

const InterestsPage = () => {
    return (
        <>

            {/*//! START Searchbox section */}
            <div className="flex xl:flex-row flex-col-reverse items-center justify-between xl:gap-7 gap-4">


                {/*//! Most Search List */}
                <div className="flex items-center xl:flex-nowrap flex-wrap gap-2.5 overflow-hidden">


                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#E5F2E9] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>همه</span> <CheckmarkIcon className="fill-[#417F56]" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>غذای اصلی</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>پیش غذا</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>دسر</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>نوشیدنی</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>


                </div>

                {/*//! Search Field */}
                <form
                    className="relative xl:h-11 md:h-auto h-11 md:py-3 py-0 xl:w-auto w-full flex-1 rounded-lg border border-[#CBCBCB] overflow-hidden"
                >
                    <input
                        type="text"
                        placeholder="جستجو"
                        className="w-full h-full bg-transparent px-4 text-[#353535] placeholder:text-[#353535] focus:ring-0 focus:outline-none"
                    />
                    <button className="w-11 h-11 my-auto absolute top-0 left-0 flex items-center justify-center">
                        <SearchIcon className="fill-[#353535]" />
                    </button>
                </form>


            </div>
            {/*//? END Searchbox section */}

            {/*//! START Interests List */}
            <section
                className="grid xl:grid-cols-3 md:grid-cols-2 lg:gap-6 gap-5 md:my-10 mt-14 mb-6"
            >

                {/*//TODO Single Card */}
                <div
                    className="bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                >

                    <img
                        src="/images/food-image-1.jpg"
                        alt=""
                        className="w-full lg:h-[180px] md:h-40 h-44 object-cover object-center"
                    />

                    {/*// Content */}
                    <div className="md:py-5 md:px-4 p-3.5">

                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-[#353535] text-xl font-semibold text-wrap">
                                میرزا قاسمی
                            </h3>
                            <button className="hover:scale-110 duration-200">
                                <HeartIcon className="stroke-[#777777]" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-5">

                            <div className="flex items-center">
                                <OutlineStarIcon className="w-5 h-5 ml-0.5" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                            </div>

                            <h4 className="text-[#353535] text-super-base">
                                ۱۵۰٬۰۰۰ تومان
                            </h4>

                        </div>

                        <button
                            className="w-full bg-[#417F56] flex items-center justify-center gap-1.5 text-white py-2 px-3 rounded-md"
                        >
                            افزودن به سبد خرید <ShoppingCardIcon className="w-[21px] h-[21px] fill-white" />
                        </button>

                    </div>

                </div>

                {/*//TODO Single Card */}
                <div
                    className="bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                >

                    <img
                        src="/images/food-image-1.jpg"
                        alt=""
                        className="w-full lg:h-[180px] md:h-40 h-44 object-cover object-center"
                    />

                    {/*// Content */}
                    <div className="py-5 px-4">

                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-[#353535] text-xl font-semibold text-wrap">
                                میرزا قاسمی
                            </h3>
                            <button className="hover:scale-110 duration-200">
                                <HeartIcon className="stroke-[#777777]" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-5">

                            <div className="flex items-center">
                                <OutlineStarIcon className="w-5 h-5 ml-0.5" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                            </div>

                            <h4 className="text-[#353535] text-super-base">
                                ۱۵۰٬۰۰۰ تومان
                            </h4>

                        </div>

                        <button
                            className="w-full bg-[#417F56] flex items-center justify-center gap-1.5 text-white py-2 px-3 rounded-md"
                        >
                            افزودن به سبد خرید <ShoppingCardIcon className="w-[21px] h-[21px] fill-white" />
                        </button>

                    </div>

                </div>

                {/*//TODO Single Card */}
                <div
                    className="bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                >

                    <img
                        src="/images/food-image-1.jpg"
                        alt=""
                        className="w-full lg:h-[180px] md:h-40 h-44 object-cover object-center"
                    />

                    {/*// Content */}
                    <div className="py-5 px-4">

                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-[#353535] text-xl font-semibold text-wrap">
                                میرزا قاسمی
                            </h3>
                            <button className="hover:scale-110 duration-200">
                                <HeartIcon className="stroke-[#777777]" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-5">

                            <div className="flex items-center">
                                <OutlineStarIcon className="w-5 h-5 ml-0.5" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                                <StarIcon className="w-6 h-6" />
                            </div>

                            <h4 className="text-[#353535] text-super-base">
                                ۱۵۰٬۰۰۰ تومان
                            </h4>

                        </div>

                        <button
                            className="w-full bg-[#417F56] flex items-center justify-center gap-1.5 text-white py-2 px-3 rounded-md"
                        >
                            افزودن به سبد خرید <ShoppingCardIcon className="w-[21px] h-[21px] fill-white" />
                        </button>

                    </div>

                </div>

            </section>
            {/*//? END Interests List */}

        </>
    );
}

export default InterestsPage;