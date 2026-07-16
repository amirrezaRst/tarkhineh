import { HomeIcon, TruckFastIcon, CircleCheckmarkIcon } from "@/assets/Icons";

const OrderProgress = ({ status }) => {
    const show = ["pending", "preparing", "on_the_way"].includes(status);
    if (!show) return null;


    const isPreparingActive = ["pending", "preparing", "on_the_way"].includes(status);
    const isDeliveryActive = ["on_the_way"].includes(status);

    return (
        <div className="flex items-center justify-between md:gap-3 gap-1 xl:text-super-sm text-super-xs mt-7 xl:px-6">
            <div className="flex items-center gap-2">
                <HomeIcon className={`w-[26px] h-[26px] fill-[${isPreparingActive ? "#417F56" : "#CBCBCB"}]`} />
                <p className={`${isPreparingActive ? "text-[#417F56] font-medium" : "text-[#CBCBCB]"} md:block hidden`}>
                    درحال آماده‌سازی
                </p>
            </div>

            <div className={`w-full md:border-t-2 border-t-[1.5px] border-dashed border-[${isDeliveryActive ? "#417F56" : "#CBCBCB"}] flex-1`}></div>

            <div className="flex items-center gap-2">
                <TruckFastIcon className={`w-[26px] h-[26px] fill-[${isDeliveryActive ? "#417F56" : "#CBCBCB"}]`} />
                <p className={`${isDeliveryActive ? "text-[#417F56] font-medium" : "text-[#CBCBCB]"} md:block hidden`}>
                    ارسال توسط پیک
                </p>
            </div>

            <div className="w-full md:border-t-2 border-t-[1.5px] border-dashed border-[#CBCBCB] flex-1"></div>
            <div className="flex items-center gap-2">
                <CircleCheckmarkIcon className="w-[26px] h-[26px] fill-[#CBCBCB]" />
                <p className="text-[#CBCBCB]">تحویل سفارش</p>
            </div>
        </div>
    );
};

export default OrderProgress;
