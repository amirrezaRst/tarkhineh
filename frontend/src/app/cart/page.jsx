"use client";

import { useEffect, useState } from "react";
import PurchaseSteps from "./PurchaseSteps";
import MobileNavigation from "./MobileNavigation";
import ShoppingCart from "./ShoppingCart";
import CheckoutDetails from "./CheckoutDetails";
import Payment from "./Payment";

const CartPage = () => {
    const [step, setStep] = useState(2);

    return (
        <div className="xl:py-20 md:py-12 py-9">

            {/*//! Mobile Navigation */}
            <MobileNavigation step={step} />

            {/*//! Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />

            <main className="container md:mt-12 mt-8">

                {step === 1 && <ShoppingCart step={step} setStep={setStep} />}
                {step === 2 && <CheckoutDetails step={step} setStep={setStep} />}
                {step === 3 && <Payment step={step} setStep={setStep} />}

            </main>

        </div >
    );
}

export default CartPage;