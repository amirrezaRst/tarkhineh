import DeliveryType from "../../components/cart/checkoutDetails/DeliveryType";
import DeliveryAddress from "../../components/cart/checkoutDetails/DeliveryAddress";
import OrderNotes from "../../components/cart/checkoutDetails/OrderNotes";
import CartLayout from "./CartLayout";
import useCartStore from "@/stores/useCartStore";
import BranchLocation from "../../components/cart/checkoutDetails/BranchLocation";


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
