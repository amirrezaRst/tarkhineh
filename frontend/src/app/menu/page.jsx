import { ChevronIcon, HeartIcon, SearchIcon, ShoppingCardIcon, StarIcon } from "@/assets/Icons";

const MenuPage = () => {
    return (
        <>
            {/*//! START Top Navigation */}
            <div className="bg-[#EDEDED] w-full ">
                <div className="container">
                    <div className="relative inline-block md:w-auto w-full">

                        <ul
                            className="flex items-center md:text-super-base text-[#717171] md:w-auto w-full"
                        >
                            <li className="md:px-4 px-1 md:w-auto w-full text-center py-5 font-medium text-[#417F56] border-b border-b-[#417F56]">غذای اصلی</li>
                            <li className="md:px-4 px-1 md:w-auto w-full text-center py-5">پیش غذا</li>
                            <li className="md:px-4 px-1 md:w-auto w-full text-center py-5">دسر</li>
                            <li className="md:px-4 px-1 md:w-auto w-full text-center py-5">نوشیدنی</li>
                        </ul>

                    </div>
                </div>
            </div>
            {/*//? END Top Navigation */}


            {/*//! START Searchbox section */}
            <div className="container py-8 flex md:flex-row flex-col items-center justify-between xl:gap-10 gap-4">


                {/*//! Most Search List */}
                <div className="flex items-center flex-nowrap gap-3 flex-1 overflow-hidden">


                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-1 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-base text-sm cursor-pointer rounded-full"
                    >
                        <span>پاستا سبزیجات</span> <ChevronIcon className="inline rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-1 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-base text-sm cursor-pointer rounded-full"
                    >
                        <span>پیتزا سیر و استیک</span> <ChevronIcon className="inline rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-1 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-base text-sm cursor-pointer rounded-full"
                    >
                        <span>سالاد سزار</span> <ChevronIcon className="inline rotate-90" />
                    </div>


                </div>

                {/*//! Search Field */}
                <form
                    className="relative xl:w-[450px] lg:w-[350px] md:w-[45%] w-full h-11 rounded-lg border border-[#CBCBCB] overflow-hidden"
                >
                    <input
                        type="text"
                        placeholder="جستجو"
                        className="w-full h-full bg-transparent px-4 text-[#353535] placeholder:text-[#353535] focus:ring-0 focus:outline-none"
                    />
                    <button className="w-11 h-11 absolute top-0 left-0 flex items-center justify-center">
                        <SearchIcon className="fill-[#353535]" />
                    </button>
                </form>


            </div>
            {/*//? END Searchbox section */}



            <main className="container md:py-20 py-12">

                {/*//! START Persian Food Section */}
                <section>

                    {/*//! Section Title */}
                    <div className="flex items-center justify-between">

                        <h2 className="lg:text-2.5xl text-1.5xl font-semibold">غذاهای ایرانی</h2>

                        <button
                            className="border border-[#417F56] flex items-center gap-2 text-[#417F56] md:text-base text-sm font-medium px-7 py-2 rounded-md"
                        >
                            <ShoppingCardIcon className="fill-[#417F56]" /> تکمیل خرید
                        </button>

                    </div>


                    {/*//! START Menu List */}
                    <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">


                        {/*//TODO Single Item */}
                        <div
                            className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[160px] flex 2xl:gap-2 border border-[#CBCBCB] rounded-lg overflow-hidden hover:shadow-lg duration-300"
                        >

                            <img
                                src="/images/food-image-1.jpg"
                                alt=""
                                className="h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] object-cover"
                            />

                            {/*//TODO Card Content */}
                            <div className="w-full p-4 flex flex-col justify-between">

                                <div className="flex items-center justify-between">
                                    <h3 className="3xl:text-2xl text-1.5xl text-[#353535] font-semibold">
                                        میرزا قاسمی
                                    </h3>
                                    <button className="hover:scale-110 duration-200">
                                        <HeartIcon />
                                    </button>
                                </div>

                                <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 mb-3.5">
                                    <p className="text-[#353535] 3xl:text-super-base text-super-sm flex-1">
                                        بادمجان، گوجه فرنگی، تخم مرغ، سیر، رب گوجه فرنگی
                                    </p>
                                    <div className="flex xl:flex-col flex-row justify-between gap-4">

                                        <div className="flex items-center justify-center gap-2">
                                            <span
                                                className="text-[#ADADAD] 3xl:text-lg text-base line-through"
                                            >۱۶۵٬۰۰۰</span>
                                            <span
                                                className="bg-[#FFF2F2] 3xl:text-base text-sm text-[#C30000] rounded-full pt-0.5 px-2"
                                            >
                                                %۱۰
                                            </span>
                                        </div>

                                        <span className="text-[#353535] 3xl:text-lg text-super-base">
                                            ۱۴۲٬۵۰۰ تومان
                                        </span>

                                    </div>
                                </div>

                                <div className="flex xl:flex-row flex-col xl:items-center justify-between xl:gap-6 gap-3">
                                    <div className="flex items-center">
                                        <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon />
                                    </div>
                                    <button
                                        className="bg-[#417F56] w-full rounded-md 3xl:leading-10 leading-9 text-super-sm px-4 text-white"
                                    >
                                        افزودن به سبد خرید
                                    </button>
                                </div>

                            </div>

                        </div>

                        {/*//TODO Single Item */}
                        <div
                            className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[160px] flex 2xl:gap-2 border border-[#CBCBCB] rounded-lg overflow-hidden hover:shadow-lg duration-300"
                        >

                            <img
                                src="/images/food-image-2.jpg"
                                alt=""
                                className="h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] object-cover"
                            />

                            {/*//TODO Card Content */}
                            <div className="w-full p-4 flex flex-col justify-between">

                                <div className="flex items-center justify-between">
                                    <h3 className="3xl:text-2xl text-1.5xl text-[#353535] font-semibold">
                                        دلمه برگ مو
                                    </h3>
                                    <button className="hover:scale-110 duration-200">
                                        <HeartIcon />
                                    </button>
                                </div>

                                <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 mb-3.5">
                                    <p className="text-[#353535] 3xl:text-super-base text-super-sm flex-1">
                                        پیاز، برنج، لپه، سبزی دلمه، سرکه
                                    </p>
                                    <div className="flex xl:flex-col flex-row justify-between gap-4">

                                        {/* <div className="flex items-center justify-center gap-2">
                                                <span
                                                 className="text-[ 3xl:text-lg text-base#ADADAD] line-through"
                                                 >۱۶۵٬۰۰۰</span>
                                                <span
                                                 className="bg-[#FFF 3xl:text-base2F2] text-sm text-[#C30000] rounded-full pt-0.5 px-2"
                                                 >
                                                 %۱۰
                                                 </span>
                                            </div> */}

                                        <span className="text-[#353535] 3xl:text-lg text-super-base">
                                            ۱۴۲٬۵۰۰ تومان
                                        </span>

                                    </div>
                                </div>

                                <div className="flex xl:flex-row flex-col xl:items-center justify-between xl:gap-6 gap-3">
                                    <div className="flex items-center">
                                        <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon />
                                    </div>
                                    <button
                                        className="bg-[#417F56] w-full rounded-md 3xl:leading-10 leading-9 text-super-sm px-4 text-white"
                                    >
                                        افزودن به سبد خرید
                                    </button>
                                </div>

                            </div>

                        </div>


                    </article>
                    {/*//? END Menu List */}


                </section>
                {/*//? END Persian Food Section */}


            </main>


        </>
    );
}

export default MenuPage;