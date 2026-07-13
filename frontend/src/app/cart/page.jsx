"use client";

import { useState } from "react";
import MobileNavigation from "@/components/cart/MobileNavigation";
import PurchaseSteps from "@/components/cart/PurchaseSteps";
import ShoppingCart from "./ShoppingCart";
import CheckoutDetails from "./CheckoutDetails";
import Payment from "./Payment";
import useUserStore from "@/stores/useUserStore";
import useCartStore from "@/stores/useCartStore";
import { toast } from "react-toastify";
import PopAlert from "./PopAlert";
import { SquareCheckIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import { api } from "@/utils/apiClient";

const CartPage = () => {
    const [step, setStep] = useState(1);
    const { user } = useUserStore();
    const { cart, deliveryType, selectedAddress, notes, paymentMethod, paymentGateway, cartBranch, discount: appliedCoupon, clearCart, loading, setLoading } = useCartStore();

    const [alertOpened, setAlertOpened] = useState(false);

    const handlePayment = async (amount, discount) => {
        // amount/discount/deliveryFee/branch are no longer trusted by the
        // backend (it recomputes everything from the server-side cart) -
        // couponCode is what actually drives the discount now.
        const body = {
            amount,
            discount: discount || 0,
            deliveryFee: deliveryType == "courier" ? 26000 : undefined,
            deliveryType,
            paymentMethod,
            customerNote: notes.trim(),
            branch: cartBranch,
            couponCode: appliedCoupon?.code,
        };

        if (deliveryType == "courier") {
            body.deliveryAddress = {
                addressLine: user?.addresses?.[selectedAddress].addressLine,
                recipientPhoneNumber: user?.addresses?.[selectedAddress].recipientPhoneNumber,
                recipientFullName: user?.addresses?.[selectedAddress].recipientFullName,
            };
        }

        setLoading(true);
        try {
            const { url } = await api.post("/order", body);

            if (paymentMethod == "online") {
                toast.info("درحال ارسال به درگاه پرداخت");
                window.location.href = url;
                return;
            }

            clearCart();
            setAlertOpened(true);
            setStep(1);
            toast.success("سفارش شما با موفقیت ثبت شد. پرداخت به صورت نقدی در هنگام تحویل انجام خواهد شد.");
        } catch {
            toast.error("خطایی از سمت سرور رخ داده، لطفا دوباره امتحان کنید.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="xl:py-20 md:py-12 py-9">

            {/*//! Mobile Navigation */}
            <MobileNavigation step={step} />

            {/*//! Purchase Step */}
            <PurchaseSteps step={step} setStep={setStep} />

            {/* <button className="p-4 bg-red-400 container" onClick={() => setAlertOpened(!alertOpened)}>
                Open Alert
            </button> */}

            <main className="container md:mt-12 mt-8">

                {step === 1 && <ShoppingCart step={step} setStep={setStep} />}
                {step === 2 && <CheckoutDetails step={step} setStep={setStep} />}
                {step === 3 && <Payment step={step} setStep={setStep} handler={handlePayment} />}

            </main>

            <PopAlert isOpen={alertOpened} setIsOpen={setAlertOpened} >

                <div
                    className="bg-white md:w-[500px] w-[90%] rounded-2xl p-12 bg-[url('/images/selebration-roban-2.png')] bg-cover bg-center"
                >

                    <div className="">
                        <SquareCheckIcon
                            className="mx-auto relative md:w-[150px] md:h-[140px] w-[130] h-[110px] md:left-4"
                        />

                        <h3 className="text-1.5xl font-medium text-[#417F56] text-center mt-6">
                            سفارش با موفقیت ثبت شد
                        </h3>
                        <p className="text-super-sm text-[#717171] text-center mt-2.5">
                            سفارش شما با موفقیت ثبت شد. لطفا هنگام دریافت سفارش، مبلغ را به صورت نقدی پرداخت نمایید.
                        </p>

                        <div className="flex items-center gap-3 mt-6">
                            <PreserveQueryLink
                                href="/"
                                className="w-full flex justify-center bg-white border border-[#417F56] text-[#417F56] rounded py-2 px-3"
                            >
                                <button>
                                    بازگشت به صفحه اصلی
                                </button>
                            </PreserveQueryLink>
                            <PreserveQueryLink
                                href="/profile/orders"
                                className="w-full flex justify-center bg-[#417F56] border border-[#417F56] text-white rounded py-2 px-3"
                            >
                                <button>
                                    مشاهده سفارشات
                                </button>
                            </PreserveQueryLink>
                        </div>

                    </div>

                </div>

            </PopAlert>

        </div>
    );
}

export default CartPage;