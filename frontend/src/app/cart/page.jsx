"use client";

import { useEffect, useState } from "react";
import EmptyCart from "./EmptyCart";
import PurchaseSteps from "./PurchaseSteps";
import useUserStore from "@/stores/useUserStore";
import CartItem from "./CartItem";
import CartLayout from "./CartLayout";
import MobileNavigation from "./MobileNavigation";

const CartPage = () => {
    const [step, setStep] = useState(1);
    const cart = useUserStore(state => state.cart);

    useEffect(() => {
        // console.log(cart)
    }, [cart])

    return (
        <div className="xl:py-20 md:py-12 py-9">

            {/*//! Mobile Navigation */}
            <MobileNavigation />

            {/*//! Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />

            <main className="container md:mt-12 mt-8">

                {cart?.length === 0 ?
                    <EmptyCart /> :
                    null
                }

                {cart?.length > 0 ?
                    <CartLayout cart={cart || []}>

                        <div className="border border-[#CBCBCB] rounded-lg px-6 py-7 space-y-6">

                            {cart?.map(({ menuItem, quantity, _id: id }, index) => (
                                <CartItem key={index} id={id} menuItem={menuItem} quantity={quantity} />
                            ))}

                        </div>

                    </CartLayout> :
                    "loading..."
                }


            </main>

        </div >
    );
}

export default CartPage;