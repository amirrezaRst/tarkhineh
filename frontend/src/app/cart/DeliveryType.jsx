import { ShoppingBag, TruckFastIcon, TruckIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";
import RadioGroup from "./RadioGroup";

const DeliveryType = () => {
    const { deliveryType, setDeliveryType } = useCartStore();
    const options = [
        { id: "courier-delivery", value: "courier", label: "ارسال توسط پیک", description: "توسط پیک رستوران ارسال شود.", icon: TruckFastIcon },
        { id: "person-delivery", value: "person", label: "تحویل حضوری", description: "تحویل مستقیم از فروشگاه.", icon: ShoppingBag },
    ];

    return (
        <RadioGroup
            title="روش تحویل سفارش"
            name="delivery-type"
            options={options}
            selectedValue={deliveryType}
            onChange={setDeliveryType}
        />
    );
}

export default DeliveryType;