import { CalenderIcon, CheckmarkIcon, ChevronIcon, CircleCheckmarkIcon, ClockIcon, HomeIcon, LocationIcon, PersonalWalletIcon, TruckFastIcon, TruckIcon } from "@/assets/Icons";

const OrdersPage = () => {
    return (
        <>

            <div className="flex flex-row items-center justify-between xl:gap-7 gap-4">


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
                        <span>جاری</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>تحویل شده</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>

                    {/*//TODO Single Item */}
                    <div
                        className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-super-sm text-sm cursor-pointer rounded-full"
                    >
                        <span>لغو شده</span> <ChevronIcon className="fill-[#717171]rotate-90" />
                    </div>


                </div>
                {/*//? END Orders Category */}

            </div>

            {/*//! START Orders List */}
            <section
                className="space-y-8 md:mt-14 mt-10"
            >


                {/*//TODO Single Order */}
                <div
                    className="bg-white border border-[#CBCBCB] rounded-md md:py-7 md:px-6 py-6 px-4"
                >

                    <div className="flex justify-between gap-4">
                        <h2 className="md:text-lg text-super-base text-[#757575] font-medium">
                            شعبه اقدسیه
                        </h2>

                        <div className="flex gap-2 md:text-sm text-xs">
                            <span className="bg-[#EDEDED] text-[#353535] rounded-md py-1.5 md:px-3 px-2">ارسال توسط پیک</span>
                            <span className="bg-[#FFF8E1] text-[#A9791C] rounded-md py-1.5 md:px-3 px-2">جاری</span>
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col-reverse items-start justify-between gap-3 mt-4 text-[#717171] md:text-super-sm text-super-xs">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CalenderIcon className="fill-[#717171] w-5 h-5" />
                                <div className="flex gap-4">
                                    <p>شنبه ۸ مرداد، ساعت ۱۸:۵۳</p>
                                    <p className="xl:block hidden">مبلغ: ۲۲۸٬۵۰۰ تومان</p>
                                    <p className="xl:block hidden">تخفیف: ۲۸٬۵۰۰ تومان</p>
                                </div>
                            </div>
                            <p className="flex items-center gap-2">
                                <LocationIcon className="fill-[#717171] w-5 h-5" />
                                اقدسیه، بزرگراه ارتش، مجتمع شمیران سنتر، طبقه ۱۰
                            </p>
                            <div className="xl:hidden flex items-center gap-2">
                                <PersonalWalletIcon className="fill-[#717171] w-5 h-5" />
                                <div className="flex gap-3">
                                    <p>مبلغ: ۲۲۸٬۵۰۰ تومان</p>
                                    <p>تخفیف: ۲۸٬۵۰۰ تومان</p>
                                </div>
                            </div>
                        </div>

                        <p className="flex items-center gap-2">
                            <ClockIcon className="fill-[#717171] w-5 h-5" />
                            تحویل تا <span className="text-[#417F56]">۲۵:۳۳</span>
                        </p>
                    </div>


                    {/*//! Order Status Progress */}
                    <div
                        className="flex items-center justify-between md:gap-3 gap-1 xl:text-super-sm text-super-xs mt-7 xl:px-6"
                    >

                        <div className="flex items-center gap-2">
                            <HomeIcon className="xl:w-[27px] xl:h-[27px] md:w-6 md:h-6 w-[26px] h-[26px] fill-[#417F56]" />
                            <p className="text-[#417F56] md:block hidden font-medium">درحال آماده سازی</p>
                        </div>
                        <div className="w-full md:border-t-2 border-t-[1.5px] border-dashed border-[#CBCBCB] flex-1"></div>
                        <div className="flex items-center gap-2">
                            <TruckFastIcon className="xl:w-[27px] xl:h-[27px] md:w-6 md:h-6 w-[26px] h-[26px] fill-[#CBCBCB]" />
                            <p className="text-[#CBCBCB] md:block hidden">ارسال توسط پیک</p>
                        </div>
                        <div className="w-full md:border-t-2 border-t-[1.5px] border-dashed border-[#CBCBCB] flex-1"></div>
                        <div className="flex items-center gap-2">
                            <CircleCheckmarkIcon className="xl:w-[27px] xl:h-[27px] md:w-6 md:h-6 w-[26px] h-[26px] fill-[#CBCBCB]" />
                            <p className="text-[#CBCBCB] md:block hidden">تحویل سفارش</p>
                        </div>

                    </div>


                    {/*//! START Food List */}
                    <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3.5 mt-9 md:mb-5 mb-3.5">

                        {/*//TODO Single Item */}
                        <div
                            className="xl:h-[190px] lg:h-[165px] md:h-[155px] h-[150px] flex flex-col bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                        >

                            {/* Image */}
                            <div className="relative w-full lg:h-[110px] h-[85px] rounded-t-lg overflow-hidden">
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
                            <div className="h-full flex flex-col gap-0.5 justify-center lg:py-2.5 md:py-1 px-2 text-center md:text-super-sm text-super-xs text-[#353535] flex-1">
                                <h6>پاستا بلونز</h6>
                                <p>۱۶۰٬۰۰۰ تومان</p>
                            </div>

                        </div>

                        {/*//TODO Single Item */}
                        <div
                            className="xl:h-[190px] lg:h-[165px] md:h-[155px] h-[150px] flex flex-col bg-white border border-[#CBCBCB] rounded-lg overflow-hidden"
                        >

                            {/* Image */}
                            <div className="relative w-full lg:h-[110px] h-[85px] rounded-t-lg overflow-hidden">
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
                            <div className="h-full flex flex-col gap-0.5 justify-center lg:py-2.5 md:py-1 px-2 text-center md:text-super-sm text-super-xs text-[#353535] flex-1">
                                <h6>راتاتویی</h6>
                                <p>۹۵٬۰۰۰ تومان</p>
                            </div>

                        </div>

                    </div>
                    {/*//? END Food List */}

                    <p className="text-[#717171] text-center text-super-xs mb-6">
                        مشاهده همه سفارشات
                    </p>

                    <div className="flex justify-end">
                        <button
                            className="border border-[#C30000] text-[#C30000] rounded-md py-1 px-9 md:text-super-sm text-sm font-medium leading-7"
                        >
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