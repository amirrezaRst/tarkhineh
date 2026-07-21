import { HomeIcon, TruckFastIcon, CircleCheckmarkIcon } from "@/assets/Icons";

const OrderProgress = ({ status }) => {
    const show = ["pending", "preparing", "on_the_way"].includes(status);
    if (!show) return null;


    const isPreparingActive = ["pending", "preparing", "on_the_way"].includes(status);
    const isDeliveryActive = ["on_the_way"].includes(status);

    return (
        <div className="flex items-center justify-between md:gap-3 gap-1 xl:text-super-sm text-super-xs mt-7 xl:px-6">
            <div className="flex items-center gap-2">
                <HomeIcon className={`w-[26px] h-[26px] ${isPreparingActive ? "fill-primary" : "fill-border"}`} />
                <p className={`${isPreparingActive ? "text-primary font-medium" : "text-border"} md:block hidden`}>
                    درحال آماده‌سازی
                </p>
            </div>

            <div className={`w-full md:border-t-2 border-t-[1.5px] border-dashed flex-1 ${isDeliveryActive ? "border-primary" : "border-border"}`}></div>

            <div className="flex items-center gap-2">
                <TruckFastIcon className={`w-[26px] h-[26px] ${isDeliveryActive ? "fill-primary" : "fill-border"}`} />
                <p className={`${isDeliveryActive ? "text-primary font-medium" : "text-border"} md:block hidden`}>
                    ارسال توسط پیک
                </p>
            </div>

            <div className="w-full md:border-t-2 border-t-[1.5px] border-dashed border-border flex-1"></div>
            <div className="flex items-center gap-2">
                <CircleCheckmarkIcon className="w-[26px] h-[26px] fill-border" />
                <p className="text-border">تحویل سفارش</p>
            </div>
        </div>
    );
};

export default OrderProgress;
