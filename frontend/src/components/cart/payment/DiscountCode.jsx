import { DiscountIcon } from "@/assets/Icons";

const DiscountCode = () => {
    return (
        <div
            className="border border-[#CBCBCB] rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-4"
        >
            <form
                className="flex md:flex-row flex-col md:items-center gap-3.5"
            >
                <div className="flex items-center gap-1.5 ml-1.5 md:border-b-0 border-b border-b-[#CBCBCB] md:pb-0 pb-4 md:mb-0 mb-1">
                    <DiscountIcon className="md:w-8 md:h-8" />
                    <p className="text-[#353535] lg:text-lg md:text-base text-super-sm">ثبت کد تخفیف</p>
                </div>
                <div className="flex-1 w-full flex gap-3.5">
                    <input
                        type="text"
                        className="flex-1 md:text-base text-sm text-[#717171] border border-[#CBCBCB] rounded-md py-2 md:px-6 px-2.5"
                        placeholder="کد تخفیف"
                    />
                    <button type="submit" className="bg-[#CBCBCB] md:text-base text-sm  text-white rounded-md py-2 md:px-4 px-2.5">ثبت کد</button>
                </div>
            </form>
        </div>
    );
};

export default DiscountCode;