"use client";

import { useState } from "react";
import EmptyCart from "./EmptyCart";
import PurchaseSteps from "./PurchaseSteps";
import useUserStore from "@/stores/useUserStore";
import { ChevronIcon, MinusIcon, PlusIcon, TrashIcon, WarningIcon } from "@/assets/Icons";
import StarRating from "@/components/menusPage/StarRating";
import CartItem from "./CartItem";
import CartLayout from "./CartLayout";

const CartPage = () => {
    const [step, setStep] = useState(1);
    const cart = useUserStore(state => state.cart);

    return (
        <div className="py-20 space-y-12">

            {/*//! START Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />
            {/*//? END Purchase Step */}

            <main className="container">
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