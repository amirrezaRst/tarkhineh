import { ClockIcon } from "@/assets/Icons";

const OrderDeliveryTime = () => (
    <p className="flex items-center gap-2">
        <ClockIcon className="fill-[#717171] w-5 h-5" />
        تحویل تا <span className="text-[#417F56]">۲۵:۳۳</span>
    </p>
);

export default OrderDeliveryTime;
