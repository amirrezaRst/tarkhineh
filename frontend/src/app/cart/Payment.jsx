import useCartStore from "@/stores/useCartStore";
import CartLayout from "./CartLayout";
import DiscountCode from "../../components/cart/payment/DiscountCode";
import PaymentGateway from "../../components/cart/payment/PaymentGateway";
import PaymentMethod from "../../components/cart/payment/PaymentMethod";
import { WarningIcon } from "@/assets/Icons";

const Payment = ({ step, setStep, handler }) => {
    const { cart } = useCartStore();

    return (
        <CartLayout cart={cart || []} step={step} setStep={setStep} handler={handler}>

            <div className="md:space-y-8 space-y-5 lg:mb-0 mb-4">

                {/*//! Discount Code InputBox */}
                <DiscountCode />

                {/*//! Payment Method */}
                <PaymentMethod />

                {/*//! Gateways */}
                <PaymentGateway />



            </div>
        </CartLayout>

    );
};

export default Payment;
