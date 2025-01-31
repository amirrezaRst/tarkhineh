"use client";

import { useEffect, useState } from "react";
import EmptyCart from "./EmptyCart";
import PurchaseSteps from "./PurchaseSteps";
import useUserStore from "@/stores/useUserStore";
import CartItem from "./CartItem";
import CartLayout from "./CartLayout";
import MobileNavigation from "./MobileNavigation";
import { useSearchParams } from "next/navigation";

const CartPage = () => {
    const [step, setStep] = useState(1);
    const cart = useUserStore(state => state.cart);
    const [branchId, setBranchId] = useState(null)
    const branch = useSearchParams().get("branch");

    useEffect(() => {
        if (branch) {
            if (branch == "aghdasiyeh") setBranchId("675de19cf836156025ee8575");
            else if (branch == "tehranpars") setBranchId("675f4c1655060567771c7884");
            else if (branch == "vanak") setBranchId("675f4bfe55060567771c7881");
            else if (branch == "chalous") setBranchId("675f4c3155060567771c7887");
        }
    }, [branch]);

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
                                <CartItem key={index} id={id} menuItem={menuItem} quantity={quantity} branch={branchId && branchId} />
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