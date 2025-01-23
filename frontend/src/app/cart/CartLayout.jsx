import { ChevronIcon, MinusIcon, PlusIcon, TrashIcon, WarningIcon } from "@/assets/Icons";

const CartLayout = ({ children, }) => {
    return (
        <section
            className="flex items-start xl:gap-10 gap-5"
        >

            {/*//! Main Content */}
            <article
                className="lg:block hidden flex-1"
            >
                {children}

            </article>

            {/*//! Side Content */}
            <aside
                className="xl:w-[440px] lg:w-[300px] w-full border border-[#CBCBCB] rounded-lg xl:py-8 xl:px-6 lg:py-3 lg:px-3.5 md:p-8 p-4"
            >

                <div
                    className="md:flex hidden items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB]"
                >
                    <p className=" text-[#353535] xl:text-super-base lg:text-super-sm text-super-base">سبد خرید (4)</p>
                    <button className="">
                        <TrashIcon className="xl:w-6 xl:h-6 lg:w-5 lg:h-5 w-6 h-6 fill-[#353535]" />
                    </button>
                </div>

                {/*//! Cart Items List */}
                <div className="lg:hidden block overflow-hidden pb-4 mb-4 border-b border-b-[#CBCBCB]">

                    {/*//TODO Cart Item */}
                    <div className="odd:bg-[#F9F9F9] even:bg-[#EDEDED] flex items-center justify-between py-3 px-4">

                        <div className="flex flex-col justify-between gap-2">
                            <h3 className="text-[#353535] md:text-super-base">
                                پاستا سبزیجات
                            </h3>
                            <p className="md:text-sm text-super-xs text-[#717171]">
                                ۱۴۰٬۰۰۰ تومان
                            </p>
                        </div>

                        <div className="bg-[#E5F2E9] flex items-center justify-between gap-2 py-2.5 px-2 rounded-md">
                            <button>
                                <PlusIcon className="w-4.5 h-4.5 stroke-[#417F56]" />
                            </button>
                            <p className="text-[#417F56]">
                                ۱
                            </p>
                            <button>
                                <TrashIcon className="w-4.5 h-4.5 stroke-[#417F56]" />
                                {/* <MinusIcon className="w-4.5 h-4.5 stroke-[#417F56]" /> */}
                            </button>
                        </div>

                    </div>

                </div>

                <div
                    className="flex items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB] xl:text-super-sm lg:text-sm md:text-base text-super-sm"
                >
                    <p className=" text-[#353535]">تخفیف محصولات</p>
                    <p className="text-[#717171]">۶۳٬۰۰۰ تومان</p>
                </div>
                <div className="pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <div className="flex items-center justify-between mb-2.5 xl:text-super-sm lg:text-sm md:text-base text-super-sm">
                        <p className=" text-[#353535]">هزینه ارسال</p>
                        <p className="text-[#717171]">0 تومان</p>
                    </div>
                    <p
                        className="xl:text-super-xs text-xs text-[#A9791C] font-light flex items-center gap-2 text-justify"
                    >
                        <WarningIcon className="lg:w-11 lg:h-11" />
                        هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
                    </p>
                </div>

                <div className="flex items-center justify-between pb-4 md:mb-4 mb-3 xl:text-base md:text-base text-super-sm">
                    <p className=" text-[#353535]">مبلغ قابل پرداخت</p>
                    <p className="text-[#417F56]">۵۴۲٬۰۰۰ تومان</p>
                </div>

                <button
                    className="bg-[#417F56] w-full py-2 rounded-md flex items-center justify-center text-white lg:text-super-sm text-sm font-light"
                >
                    تکمیل اطلاعات <ChevronIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] rotate-90" />
                </button>

            </aside>

        </section>
    );
}

export default CartLayout;