import { CalenderIcon, LocationIcon, PersonalWalletIcon } from "@/assets/Icons";
import FormatPrice from "@/utils/FormatPrice";


const OrderCardMeta = ({ finalPrice, discount }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <CalenderIcon className="fill-[#717171] w-5 h-5" />
            <div className="flex gap-4">
                <p>شنبه ۸ مرداد، ساعت ۱۸:۵۳</p>
                <p className="xl:block hidden">مبلغ: {FormatPrice(finalPrice)} تومان</p>
                <p className="xl:block hidden">تخفیف: {FormatPrice(discount)} تومان</p>
            </div>
        </div>
        <p className="flex items-center gap-2">
            <LocationIcon className="fill-[#717171] w-5 h-5" />
            اقدسیه، بزرگراه ارتش، مجتمع شمیران سنتر، طبقه ۱۰
        </p>
        <div className="xl:hidden flex items-center gap-2">
            <PersonalWalletIcon className="fill-[#717171] w-5 h-5" />
            <div className="flex gap-3">
                <p>مبلغ: {FormatPrice(finalPrice)} تومان</p>
                <p>تخفیف: {FormatPrice(discount)} تومان</p>
            </div>
        </div>
    </div>
);

export default OrderCardMeta;
