"use client";

import { useEffect, useState } from "react";
import PurchaseSteps from "./PurchaseSteps";
import MobileNavigation from "./MobileNavigation";
import ShoppingCart from "./ShoppingCart";
import CheckoutDetails from "./CheckoutDetails";
import Payment from "./Payment";
import useUserStore from "@/stores/useUserStore";
import useCartStore from "@/stores/useCartStore";

const CartPage = () => {
    const [step, setStep] = useState(2);
    const { user } = useUserStore();
    const { deliveryType, selectedAddress, notes, paymentMethod, paymentGateway } = useCartStore();

    //! Now we must handle payment

    const handlePayment = async () => {
        console.log("Payment Address: ", user.addresses[selectedAddress]);
        console.log("Delivery Type : ", deliveryType);
        console.log("Payment Me : ", paymentMethod);
    }


    return (
        <div className="xl:py-20 md:py-12 py-9">

            {/*//! Mobile Navigation */}
            <MobileNavigation step={step} />

            {/*//! Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />

            <main className="container md:mt-12 mt-8">

                {step === 1 && <ShoppingCart step={step} setStep={setStep} />}
                {step === 2 && <CheckoutDetails step={step} setStep={setStep} />}
                {step === 3 && <Payment step={step} setStep={setStep} handler={handlePayment} />}

            </main>

        </div >
    );
}

export default CartPage;