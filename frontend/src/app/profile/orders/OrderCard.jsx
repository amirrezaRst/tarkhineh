import OrderCardHeader from "./OrderCardHeader";
import OrderCardMeta from "./OrderCardMeta";
import OrderDeliveryTime from "./OrderDeliveryTime";
import OrderProgress from "./OrderProgress";
import OrderItemsList from "./OrderItemsList";
import OrderActionButton from "./OrderActionButton";

const OrderCard = ({ _id: orderId, branch, finalPrice, discount, deliveryType, items, status, onStatusUpdate }) => {

    return (
        <div className="bg-white border border-border rounded-md md:py-7 md:px-6 py-6 px-4 space-y-6">
            <OrderCardHeader branch={branch} status={status} deliveryType={deliveryType} />
            <div className="flex md:flex-row flex-col-reverse items-start justify-between gap-3 mt-4 text-muted-fg md:text-super-sm text-super-xs">
                <OrderCardMeta finalPrice={finalPrice} discount={discount} />
                <OrderDeliveryTime />
            </div>
            <OrderProgress status={status} />
            <OrderItemsList items={items} />
            <div className="flex justify-end">
                <OrderActionButton status={status} orderId={orderId} orderItems={items} branch={branch} onStatusUpdate={onStatusUpdate} />
            </div>
        </div>
    );
};

export default OrderCard;