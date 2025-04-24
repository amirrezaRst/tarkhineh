"use client";

import Popup from "@/components/Popup";
import { handleCancelOrder, handleReorder } from "@/services/UserOrderService";
import useCartStore from "@/stores/useCartStore";
import useUserStore from "@/stores/useUserStore";
import { useState } from "react";


const OrderActionButton = ({ status, orderId, orderItems, branch, onStatusUpdate }) => {
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const fetchCart = useCartStore(state => state.fetchCart);
    const { user } = useUserStore();

    const isFinal = status === "delivered" || status === "cancelled";


    return (
        <>
            <button
                className={`border rounded-md py-1 px-9 md:text-super-sm text-sm font-medium leading-7 duration-300
                ${isFinal
                        ? "border-[#417F56] text-[#417F56] hover:bg-[#E5F2E9]"
                        : "border-[#C30000] text-[#C30000] hover:bg-[#FFF2F2]"}
                    `}
                onClick={() => setIsOpenPopup(true)}
            >
                {isFinal ? "سفارش مجدد" : "لغو سفارش"}
            </button>

            <Popup isOpen={isOpenPopup} setIsOpen={setIsOpenPopup} title={isFinal ? "سفارش مجدد" : "لغو سفارش"}>

                {/*//! Content */}
                <div div className="min-h-36 flex flex-col justify-center gap-6 px-6">
                    <p className="text-super-base text-[#353535] text-center">
                        {isFinal ? "آیا مطمئن هستید که می‌خواهید این سفارش را مجدداً ثبت کنید؟" : "آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟"}
                    </p>

                    <div className="flex gap-3">
                        <button
                            className="rounded-md bg-[#717171]/10 
                            text-[#717171] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                            onClick={() => setIsOpenPopup(false)}
                        >
                            انصراف
                        </button>
                        <button
                            className={` rounded-md border ${isFinal
                                ? "border-[#417F56] text-[#417F56] hover:bg-[#E5F2E9]"
                                : "border-[#C30000] text-[#C30000] hover:bg-[#FFF2F2]"} text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block`}
                            onClick={() => isFinal ? handleReorder(orderItems, user, branch, setIsOpenPopup, fetchCart) : handleCancelOrder(orderId, setIsOpenPopup, onStatusUpdate)}
                        >
                            {isFinal ? "سفارش مجدد" : "لغو سفارش"}
                        </button>
                    </div>
                </div>
            </Popup>
        </>
    );
};

export default OrderActionButton;
