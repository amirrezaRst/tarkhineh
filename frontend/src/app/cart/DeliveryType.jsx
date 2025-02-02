import { ShoppingBag, TruckFastIcon, TruckIcon } from "@/assets/Icons";

const DeliveryType = ({ deliveryType, setDeliveryType }) => {


    return (
        <div
            className="grid grid-cols-3 gap-5 border rounded-lg px-9 py-10"
        >

            <div className="flex items-center gap-1.5">
                <TruckIcon className="w-8 h-8" />
                <p className="text-[#353535] text-lg">روش تحویل سفارش</p>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="radio"
                    name="delivery-type"
                    id="courier-delivery"
                    checked={deliveryType == "courier"}
                    onChange={() => setDeliveryType("courier")}
                />
                <label className="flex flex-col gap-1 text-[#717171] cursor-pointer" htmlFor="courier-delivery" >
                    <p className="text-super-base">ارسال توسط پیک</p>
                    <p className="text-sm">
                        توسط پیک رستوران ارسال شود.
                    </p>
                </label>
                <TruckFastIcon className="fill-[#717171] scale-x-[-1] w-7 h-7" />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="radio"
                    name="delivery-type"
                    id="person-delivery"
                    checked={deliveryType == "person"}
                    onChange={() => setDeliveryType("person")}
                />
                <label className="flex flex-col gap-1 text-[#717171] cursor-pointer" htmlFor="person-delivery" >
                    <p className="text-super-base">تحویل حضوری</p>
                    <p className="text-sm">
                        توسط پیک رستوران ارسال شود.
                    </p>
                </label>
                <ShoppingBag className="fill-[#717171] scale-x-[-1] w-7 h-7" />
            </div>


        </div>
    );
}

export default DeliveryType;