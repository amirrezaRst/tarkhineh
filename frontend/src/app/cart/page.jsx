"use client";

import { useState } from "react";
import EmptyCart from "./EmptyCart";
import PurchaseSteps from "./PurchaseSteps";
import useUserStore from "@/stores/useUserStore";
import CartItem from "./CartItem";
import CartLayout from "./CartLayout";
import MobileNavigation from "./MobileNavigation";

const CartPage = () => {
    const [step, setStep] = useState(1);
    const cart = useUserStore(state => state.cart);

    return (
        <div className="xl:py-20 md:py-12 py-9">

            {/*//! Mobile Navigation */}
            <MobileNavigation />

            {/*//! Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />

            <main className="container md:mt-12 mt-8">
                {/*//! Empty Cart */}
                {cart?.length === 0 ?
                    <EmptyCart /> :
                    null
                }

                <CartLayout>

                    <div className="border border-[#CBCBCB] rounded-lg px-6 py-7 space-y-6">

                        <CartItem />

                    </div>

                </CartLayout>

            </main>

        </div>
    );
}

export default CartPage;