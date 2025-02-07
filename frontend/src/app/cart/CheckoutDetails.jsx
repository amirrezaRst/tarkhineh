import DeliveryType from "./DeliveryType";
import DeliveryAddress from "./DeliveryAddress";
import OrderNotes from "./OrderNotes";
import CartLayout from "./CartLayout";
import useCartStore from "@/stores/useCartStore";
import BranchLocation from "./BranchLocation";


const CheckoutDetails = ({ step, setStep }) => {
    const { cart } = useCartStore();

    return (
        <CartLayout cart={cart || []} step={step} setStep={setStep}>
            <div className="md:space-y-8 space-y-5 lg:mb-0 mb-4">

                {/*//! Delivery Type */}
                <DeliveryType />

                <BranchLocation />

                {/*//! Delivery Address */}
                <DeliveryAddress />

                {/*//! Order Description */}
                <OrderNotes />

            </div>
        </CartLayout>
    );
};

export default CheckoutDetails;
