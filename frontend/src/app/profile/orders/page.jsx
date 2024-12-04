import { CalenderIcon, CheckmarkIcon, ChevronIcon, CircleCheckmarkIcon, ClockIcon, HomeIcon, LocationIcon, TruckIcon } from "@/assets/Icons";

const OrdersPage = () => {
    return (
        <>

            <div className="flex xl:flex-row flex-col-reverse items-center justify-between xl:gap-7 gap-4">


                {/*//! START Orders Category */}
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
                        <span>جاری</span> <ChevronIcon className="rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>تحویل شده</span> <ChevronIcon className="rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>لغو شده</span> <ChevronIcon className="rotate-90" />
                    </div>


                </div>
                {/*//? END Orders Category */}

            </div>

            {/*//! START Orders List */}
            <section
                className="space-y-8 mt-14"
            >


                {/*//TODO Single Order */}
                <div
                    className="bg-white border border-[#CBCBCB] rounded-md py-7 px-6"
                >

                    <div className="flex justify-between gap-4">
                        <h2 className="text-lg text-[#757575] font-medium">
                            شعبه اقدسیه
                        </h2>

                        <div className="flex gap-2 text-sm">
                            <span className="bg-[#EDEDED] text-[#353535] rounded-md py-1.5 px-3">ارسال توسط پیک</span>
                            <span className="bg-[#FFF8E1] text-[#A9791C] rounded-md py-1.5 px-3">جاری</span>
                        </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 mt-4 text-[#717171] text-super-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CalenderIcon className="fill-[#717171] w-5 h-5" />
                                <div className="flex gap-4">
                                    <p>شنبه ۸ مرداد، ساعت ۱۸:۵۳</p>
                                    <p>مبلغ: ۲۲۸٬۵۰۰ تومان</p>
                                    <p>تخفیف: ۲۸٬۵۰۰ تومان</p>
                                </div>
                            </div>
                            <p className="flex items-center gap-2">
                                <LocationIcon className="fill-[#717171] w-5 h-5" />
                                اقدسیه، بزرگراه ارتش، مجتمع شمیران سنتر، طبقه ۱۰
                            </p>
                        </div>

                        <p className="flex items-center gap-2">
                            <ClockIcon className="fill-[#717171] w-5 h-5" />
                            تحویل تا <span className="text-[#417F56]">۲۵:۳۳</span>
                        </p>
                    </div>


                    {/*//! Order Status Progress */}
                    <div
                        className="flex items-center justify-between gap-3 text-super-sm mt-7 px-6"
                    >

                        <div className="flex items-center gap-2">
                            <HomeIcon className="w-[27px] h-[27px] fill-[#417F56]" />
                            <p className="text-[#417F56] font-medium">درحال آماده سازی</p>
                        </div>
                        <div className="w-full border-t-2 border-dashed border-[#CBCBCB] flex-1"></div>
                        <div className="flex items-center gap-2">
                            <TruckIcon className="w-[27px] h-[27px] fill-[#CBCBCB]" />
                            <p className="text-[#CBCBCB]">ارسال توسط پیک</p>
                        </div>
                        <div className="w-full border-t-2 border-dashed border-[#CBCBCB] flex-1"></div>
                        <div className="flex items-center gap-2">
                            <CircleCheckmarkIcon className="w-[27px] h-[27px] fill-[#CBCBCB]" />
                            <p className="text-[#CBCBCB]">تحویل سفارش</p>
                        </div>

                    </div>


                    {/*//! START Food List */}
                    <div className="grid grid-cols-5 gap-3.5 mt-9">

                        {/*//TODO Single Item */}
                        <div
                            className="h-[190px] flex flex-col bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                        >

                            {/* Image */}
                            <div className="relative w-full h-[110px] bg-red-400">
                                <img
                                    src="/images/food-image-3.jpg"
                                    alt=""
                                    className="w-full h-full object-cover object-center"
                                />

                                <span className="bg-white border border-[#CBCBCB] absolute bottom-1.5 left-1.5 px-2 rounded-md flex items-center justify-center text-super-sm text-[#417F56]">
                                    ۱×
                                </span>
                            </div>

                            {/* Content */}
                            <div className="h-full flex flex-col gap-0.5 justify-center py-2.5 px-3 text-center text-super-sm text-[#353535]">
                                <h6>پاستا بلونز</h6>
                                <p>۱۶۰٬۰۰۰ تومان</p>
                            </div>

                        </div>

                        {/*//TODO Single Item */}
                        <div
                            className="h-[190px] flex flex-col bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                        >

                            {/* Image */}
                            <div className="relative w-full h-[110px] bg-red-400">
                                <img
                                    src="/images/food-image-4.jpg"
                                    alt=""
                                    className="w-full h-full object-cover object-center"
                                />

                                <span className="bg-white border border-[#CBCBCB] absolute bottom-1.5 left-1.5 px-2 rounded-md flex items-center justify-center text-super-sm text-[#417F56]">
                                    ۴×
                                </span>
                            </div>

                            {/* Content */}
                            <div className="h-full flex flex-col gap-0.5 justify-center py-2.5 px-3 text-center text-super-sm text-[#353535]">
                                <h6>راتاتویی</h6>
                                <p>۹۵٬۰۰۰ تومان</p>
                            </div>

                        </div>

                    </div>
                    {/*//? END Food List */}

                    <div className="flex justify-end">
                        <button className="border border-[#C30000] text-[#C30000] rounded-md py-1 px-7 text-super-sm font-medium leading-7">
                            لغو سفارش
                        </button>
                    </div>



                </div>


            </section>
            {/*//? END Orders List */}

        </>
    );
}

export default OrdersPage;