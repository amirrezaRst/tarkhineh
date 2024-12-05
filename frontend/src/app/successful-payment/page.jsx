import { SquareCheckIcon } from "@/assets/Icons";

const SuccessfulPaymentPage = () => {
    return (
        <>

            <div
                className="w-full md:h-[90vh] h-[85vh] flex items-center justify-center md:bg-[url('/images/selebration-roban.png')] bg-[url('/images/selebration-roban-2.png')] bg-cover bg-center"
            >

                <div className="relative flex flex-col md:bottom-0 bottom-5 items-center">

                    <SquareCheckIcon className="relative md:w-[256px] md:h-[240px] w-[166] h-[150px] md:left-4" />

                    <h5 className="md:text-3xl text-1.5xl text-[#417F56] text-center font-bold mt-7">
                        پرداخت شما با موفقیت انجام شد!
                    </h5>

                    <p className="md:text-lg text-super-base text-[#417F56] text-center md:mt-8 mt-5">
                        کد رهگیری سفارش شما: ۲۱۵۴۹۰۱۹
                    </p>

                    <div className="flex items-center md:gap-4 gap-2.5 mt-10">
                        <button
                            className="bg-[#417F56] border border-[#417F56] text-white md:text-base text-super-sm rounded-md py-2 leading-6 md:px-8 px-5"
                        >
                            بازگشت به صفحه اصلی
                        </button>
                        <button
                            className="bg-white border border-[#417F56] text-[#417F56] md:text-base text-super-sm rounded-md py-2 leading-6 md:px-8 px-5"
                        >
                            پیگیری سفارش
                        </button>
                    </div>

                </div>

            </div>

        </>
    );
}

export default SuccessfulPaymentPage;