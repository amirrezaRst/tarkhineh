import { ChevronIcon, TrashIcon, WarningIcon } from "@/assets/Icons";

const CartLayout = ({ children, }) => {
    return (
        <section
            className="flex items-start gap-10"
        >

            {/*//! Main Content */}
            <article
                className="flex-1"
            >
                {children}

            </article>

            {/*//! Side Content */}
            <aside
                className="max-w-[440px] border border-[#CBCBCB] rounded-lg py-8 px-6"
            >

                <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <p className=" text-[#353535] text-super-base">سبد خرید (4)</p>
                    <button className="">
                        <TrashIcon className="w-6 h-6 fill-[#353535]" />
                    </button>
                </div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <p className=" text-[#353535] text-super-sm">تخفیف محصولات</p>
                    <p className="text-[#717171] text-super-sm">۶۳٬۰۰۰ تومان</p>
                </div>
                <div className="pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <div className="flex items-center justify-between mb-2.5">
                        <p className=" text-[#353535] text-super-sm">هزینه ارسال</p>
                        <p className="text-[#717171] text-super-sm">0 تومان</p>
                    </div>
                    <p className="text-super-xs text-[#A9791C] font-light flex items-center gap-2 text-justify">
                        <WarningIcon className="w-11 h-11" />
                        هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
                    </p>
                </div>

                <div className="flex items-center justify-between pb-4 mb-4">
                    <p className=" text-[#353535] ">مبلغ قابل پرداخت</p>
                    <p className="text-[#417F56] ">۵۴۲٬۰۰۰ تومان</p>
                </div>

                <button
                    className="bg-[#417F56] w-full py-2 rounded-md flex items-center justify-center text-white text-super-sm font-light"
                >
                    تکمیل اطلاعات <ChevronIcon className="w-6 h-6 fill-[#fff] rotate-90" />
                </button>

            </aside>

        </section>
    );
}

export default CartLayout;