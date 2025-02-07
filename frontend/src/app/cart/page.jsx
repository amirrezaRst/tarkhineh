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
    const { cart, deliveryType, selectedAddress, notes, paymentMethod, paymentGateway, cartBranch } = useCartStore();

    //! Now we must handle payment

    const handlePayment = async () => {
        console.log("Payment Address: ", user.addresses[selectedAddress]);
        console.log("Delivery Type : ", deliveryType);
        console.log("Payment Me : ", paymentMethod);
        console.log(cart)
        console.log(user)

        const body = {
            user: user?._id,
            items: cart?.map(item => {
                return { menuItem: item.menuItem._id, quantity: item.quantity }
            }),
            deliveryFee: deliveryType == "courier" ? 26000 : undefined,
            deliveryAddress: {
                addressLine: user?.addresses?.[selectedAddress].addressLine,
                recipientPhoneNumber: user?.addresses?.[selectedAddress].recipientPhoneNumber,
                recipientFullName: user?.addresses?.[selectedAddress].recipientFullName,
            },
            paymentMethod,
            customerNote: notes,
            branch: cartBranch
        }

        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/`, {
        //     method: "POST",
        //     // body:
        // }).then(res => res.json());

        // console.log(response);

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