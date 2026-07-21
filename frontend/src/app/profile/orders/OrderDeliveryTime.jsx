import { ClockIcon } from "@/assets/Icons";

const OrderDeliveryTime = () => (
    <p className="flex items-center gap-2">
        <ClockIcon className="fill-muted-fg w-5 h-5" />
        تحویل تا <span className="text-primary">۲۵:۳۳</span>
    </p>
);

export default OrderDeliveryTime;
