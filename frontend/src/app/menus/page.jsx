import { ChevronIcon, HeartIcon, SearchIcon, ShoppingCardIcon, StarIcon } from "@/assets/Icons";
import MenuCard from "@/components/menusPage/MenuCard";

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
                        <span>پاستا سبزیجات</span> <ChevronIcon className="fill-[#717171] inline rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-1 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-base text-sm cursor-pointer rounded-full"
                    >
                        <span>پیتزا سیر و استیک</span> <ChevronIcon className="fill-[#717171] inline rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-1 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-base text-sm cursor-pointer rounded-full"
                    >
                        <span>سالاد سزار</span> <ChevronIcon className="fill-[#717171] inline rotate-90" />
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


                        <MenuCard />


                    </article>
                    {/*//? END Menu List */}


                </section>
                {/*//? END Persian Food Section */}


            </main>


        </>
    );
}

export default MenuPage;