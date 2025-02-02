"use client";

import { useEffect, useRef, useState } from "react";
import EmptyCart from "./EmptyCart";
import PurchaseSteps from "./PurchaseSteps";
import useUserStore from "@/stores/useUserStore";
import CartItem from "./CartItem";
import CartLayout from "./CartLayout";
import MobileNavigation from "./MobileNavigation";
import { useSearchParams } from "next/navigation";
import CartItemSkeleton from "./CartItemSkeleton";
import CartLayoutSkeleton from "./CartLayoutSkeleton";
import OrderNotes from "./OrderNotes";
import DeliveryType from "./DeliveryType";
import DeliveryAddress from "./DeliveryAddress";
import { DiscountIcon, PersonalWalletIcon, ShoppingBag, TruckFastIcon, TruckIcon, WalletIcon } from "@/assets/Icons";

const CartPage = () => {
    const [step, setStep] = useState(3);
    const cart = useUserStore(state => state.cart) || null;
    const [branchId, setBranchId] = useState(null)
    const branch = useSearchParams().get("branch");
    const [deliveryType, setDeliveryType] = useState("courier");
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [paymentGateway, setPaymentGateway] = useState("saman");

    useEffect(() => {
        if (branch) {
            if (branch == "aghdasiyeh") setBranchId("675de19cf836156025ee8575");
            else if (branch == "tehranpars") setBranchId("675f4c1655060567771c7884");
            else if (branch == "vanak") setBranchId("675f4bfe55060567771c7881");
            else if (branch == "chalous") setBranchId("675f4c3155060567771c7887");
        }
    }, [branch]);

    useEffect(() => {
        console.log(cart)
    }, [cart])


    return (
        <div className="xl:py-20 md:py-12 py-9">

            {/*//! Mobile Navigation */}
            <MobileNavigation />

            {/*//! Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />

            <main className="container md:mt-12 mt-8">

                {step === 1 ? cart === null ?
                    <CartLayoutSkeleton>
                        {[...Array(3)].map((_, index) =>
                            <CartItemSkeleton key={index} />
                        )}
                    </CartLayoutSkeleton> : cart?.length > 0 ?
                        <CartLayout cart={cart || []} step={step} setStep={setStep} branch={branchId && branchId}>

                            <div className="border border-[#CBCBCB] rounded-lg px-6 py-7 space-y-6">

                                {cart?.map(({ menuItem, quantity, _id: id }, index) => (
                                    <CartItem key={index} id={id} menuItem={menuItem} quantity={quantity} branch={branchId && branchId} />
                                ))}

                            </div>

                        </CartLayout> :
                        <EmptyCart />
                    : null
                }

                {step === 2 ?

                    <>

                        <CartLayout cart={cart || []} step={step} setStep={setStep} branch={branchId && branchId}>

                            <div className="space-y-8">

                                {/*//! Delivery Type */}
                                <DeliveryType deliveryType={deliveryType} setDeliveryType={setDeliveryType} />

                                {/*//! Address Section */}
                                <DeliveryAddress selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />

                                {/*//! Order Notes */}
                                <OrderNotes setNotes={setNotes} />

                            </div>

                        </CartLayout>

                    </>

                    : null}


                {step === 3 ?

                    <>

                        <CartLayout cart={cart || []} step={step} setStep={setStep} branch={branchId && branchId}>

                            <div className="space-y-8">



                                {/*//! Discount Code Section */}
                                <div className="border border-[#CBCBCB] rounded-lg px-9 py-8 ">

                                    <form
                                        className="flex items-center gap-3.5"
                                    >
                                        <div className="flex items-center gap-1.5 ml-1.5">
                                            <DiscountIcon className="w-8 h-8" />
                                            <p className="text-[#353535] text-lg">ثبت کد تخفیف</p>
                                        </div>

                                        <input
                                            type="text"
                                            className="flex-1 text-[#717171] leading-7 placeholder:text-[#717171] border border-[#CBCBCB] rounded-md py-2 px-6 focus:outline-none"
                                            placeholder="کد تخفیف"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#CBCBCB] text-super-base text-[#EDEDED] leading-7 rounded-md py-2 px-4"
                                        >ثبت کد</button>
                                    </form>

                                </div>

                                {/*//! payment method */}
                                <div className="grid grid-cols-3 gap-5 border border-[#CBCBCB] rounded-lg px-9 py-10">

                                    <div className="flex items-center gap-1.5">
                                        <TruckIcon className="w-7 h-7" />
                                        <p className="text-[#353535] text-lg">روش پرداخت</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="delivery-type"
                                            id="courier-delivery"
                                        />
                                        <label className="flex flex-col gap-1 text-[#717171] cursor-pointer" htmlFor="courier-delivery" >
                                            <p className="text-super-base">پرداخت ایینترنتی</p>
                                            <p className="text-sm">
                                                توسط درگاه پرداخت بانکی
                                            </p>
                                        </label>
                                        <TruckFastIcon className="fill-[#717171] scale-x-[-1] w-7 h-7" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="delivery-type"
                                            id="person-delivery"
                                        />
                                        <label className="flex flex-col gap-1 text-[#717171] cursor-pointer" htmlFor="person-delivery" >
                                            <p className="text-super-base">پرداخت در محل</p>
                                            <p className="text-sm">
                                                پرداخت به صورت حضوری
                                            </p>
                                        </label>
                                        <ShoppingBag className="fill-[#717171] scale-x-[-1] w-7 h-7" />
                                    </div>

                                </div>



                                {/*//! payment Gateway */}
                                <div className="border border-[#CBCBCB] rounded-lg px-9 py-10">

                                    <div className="flex items-center gap-1.5">
                                        <PersonalWalletIcon className="w-7 h-7 fill-[#353535]" />
                                        <p className="text-[#353535] text-lg">درگاه پرداخت</p>
                                    </div>
                                    <div className="w-4/5 mx-auto mt-5">

                                        {/*//! gateway lists */}
                                        <div className="flex justify-center gap-7 mb-3">

                                            {/*//TODO gateway item */}
                                            <div
                                                className="w-32 h-32 bg-blue-500 rounded-md overflow-hidden border border-[#417F56] ring-1 ring-[#417F56] grayscale-0 cursor-pointer duration-300 hover:shadow-lg"
                                            >
                                                <img
                                                    src="/images/melat-gateway.jpg"
                                                    alt=""
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            {/*//TODO gateway item */}
                                            <div
                                                className="w-32 h-32 bg-blue-500 rounded-md overflow-hidden border border-[#CBCBCB] ring-1 ring-[#CBCBCB] grayscale cursor-pointer duration-300 hover:shadow-lg"
                                            >
                                                <img
                                                    src="/images/saman-gateway.jpg"
                                                    alt=""
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            {/*//TODO gateway item */}
                                            <div
                                                className="w-32 h-32 bg-blue-500 rounded-md overflow-hidden border border-[#CBCBCB] ring-1 ring-[#CBCBCB] grayscale cursor-pointer duration-300 hover:shadow-lg"
                                            >
                                                <img
                                                    src="/images/parsian-gateway.jpg"
                                                    alt=""
                                                    className="w-full h-full"
                                                />
                                            </div>

                                        </div>

                                        <p className="text-sm text-[#717171] text-center mb-0.5">
                                            پرداخت از طریق کلیه کارت های عضو شتاب امکان پذیر است.
                                        </p>
                                        <p className="text-super-xs text-[#717171] text-center">
                                            (لطفا قبل از پرداخت فیلتر شکن خود را خاموش کنید.)
                                        </p>

                                    </div>

                                </div>


                            </div>

                        </CartLayout>

                    </>

                    : null}


            </main>

        </div >
    );
}

export default CartPage;