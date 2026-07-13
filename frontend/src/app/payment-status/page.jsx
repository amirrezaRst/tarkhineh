"use client";

import { SquareCheckIcon, SquareXmarkIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import useCartStore from "@/stores/useCartStore";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";

const PaymentStatus = () => {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState();
    const router = useRouter();

    const params = useSearchParams()
    const statusParams = params.get("Status");
    const authority = params.get("Authority");
    const [refId, setRefId] = useState();
    const { clearCart } = useCartStore();

    const handleVerifyPayment = async () => {
        try {
            const { orderStatus, transactionId } = await api.get(`/payment/verifyPayment/${authority}`);
            if (orderStatus == 101 || orderStatus == 100) {
                clearCart();
                setRefId(transactionId);
                setLoading(false);
                return setStatus(200);
            }
            setStatus(400);
            setLoading(false);
        } catch (err) {
            if (err.status === 404) return router.back();
            setStatus(400);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleVerifyPayment();
    }, [authority, statusParams])

    if (!loading) return (
        <>

            <div
                className="w-full md:h-[90vh] h-[85vh] flex items-center justify-center md:bg-[url('/images/selebration-roban.png')] bg-[url('/images/selebration-roban-2.png')] bg-cover bg-center"
            >

                <div className="relative flex flex-col md:bottom-0 bottom-5 items-center">

                    {status && status == 200 ?
                        <SquareCheckIcon className="relative md:w-[256px] md:h-[240px] w-[166] h-[150px] md:left-4" /> :
                        <SquareXmarkIcon className="relative md:w-[256px] md:h-[240px] w-[166] h-[150px] md:left-4" />
                    }


                    <h5
                        className={`md:text-3xl text-1.5xl ${status == 200 ? "text-[#417F56]" : "text-[#C30000]"} text-center font-bold mt-7`}
                    >
                        {status == 200 ?
                            "پرداخت شما با موفقیت انجام شد!" :
                            "پرداخت شما ناموفق بود!"
                        }
                    </h5>
                    {status == 200 &&
                        <p className={`md:text-lg text-super-base text-[#417F56] text-center md:mt-8 mt-5`}>
                            کد رهگیری سفارش شما: {refId}
                        </p>
                    }


                    <div className="flex items-center md:gap-4 gap-2.5 mt-10">
                        <PreserveQueryLink href="/">
                            <button
                                className={`${status == 200 ? "bg-[#417F56]" : "bg-[#353535]/80"} border ${status == 200 ? "border-[#417F56]" : "border-[#353535]/80"} text-white md:text-base text-super-sm rounded-md py-2 leading-6 md:px-8 px-5`}
                            >
                                بازگشت به صفحه اصلی
                            </button>
                        </PreserveQueryLink>
                        {status == 200 ?
                            <PreserveQueryLink href="/profile/orders">
                                <button
                                    className="bg-white border border-[#417F56] text-[#417F56] md:text-base text-super-sm rounded-md py-2 leading-6 md:px-8 px-5"
                                >
                                    پیگیری سفارش
                                </button>
                            </PreserveQueryLink> :
                            <Link href={`https://sandbox.zarinpal.com/pg/StartPay/${authority}`}>
                                <button
                                    className="bg-white border border-[#353535] text-[#353535] md:text-base text-super-sm rounded-md py-2 leading-6 md:px-8 px-5"
                                >
                                    پرداخت مجدد
                                </button>
                            </Link>
                        }
                    </div>

                </div>

            </div>

        </>
    );
    else return <div className="w-full h-screen" />
}

export default PaymentStatus;