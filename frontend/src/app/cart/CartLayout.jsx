import { ChevronIcon, MinusIcon, PlusIcon, TrashIcon, WarningIcon } from "@/assets/Icons";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";
import { useEffect, useMemo } from "react";
import CartMiniItem from "./CartMiniItem";

const CartLayout = ({ children, cart }) => {
    const { amount, totalDiscount } = useMemo(() => {
        return cart.reduce(
            (acc, item) => {
                const { menuItem, quantity } = item;
                const { price, discount } = menuItem;

                //! discount calculation
                let itemDiscount = 0;
                if (discount) {
                    if (discount.discountType === "percentage") {
                        itemDiscount = (price * discount.discountValue) / 100;
                    } else {
                        itemDiscount = discount.discountValue;
                    }
                }

                //! final amount
                const discountedPrice = price - itemDiscount;

                acc.totalDiscount += itemDiscount * quantity;
                acc.amount += discountedPrice * quantity;

                return acc;
            },
            { amount: 0, totalDiscount: 0 }
        );
    }, [cart]);

    // useEffect(() => {
    //     console.log(cart);
    // }, [cart]);

    return (
        <section className="flex items-start xl:gap-10 gap-5">
            {/*//! Main Content */}
            <article className="lg:block hidden flex-1">{children}</article>

            {/*//! Side Content */}
            <aside className="xl:w-[440px] lg:w-[300px] w-full border border-[#CBCBCB] rounded-lg xl:py-8 xl:px-6 lg:py-3 lg:px-3.5 md:p-8 p-4">
                <div className="md:flex hidden items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <p className="text-[#353535] xl:text-super-base lg:text-super-sm text-super-base">
                        سبد خرید ({PersianNumber(cart.length)})
                    </p>
                    <button className="">
                        <TrashIcon className="xl:w-6 xl:h-6 lg:w-5 lg:h-5 w-6 h-6 fill-[#353535]" />
                    </button>
                </div>

                {/*//! Cart Items List */}
                <div
                    className="max-h-56 lg:hidden block overflow-hidden pb-4 mb-4 border-b border-b-[#CBCBCB] overflow-y-auto"
                >

                    <div className="border border-[#CBCBCB] rounded-lg px-6 py-7 space-y-6">

                        {cart?.map(({ menuItem, quantity, _id: id }, index) => (
                            <CartMiniItem key={index} id={id} menuItem={menuItem} quantity={quantity} />
                        ))}

                    </div>

                </div>

                <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB] xl:text-super-sm lg:text-sm md:text-base text-super-sm">
                    <p className="text-[#353535]">تخفیف محصولات</p>
                    <p className="text-[#717171]">{PersianNumber(FormatPrice(totalDiscount))} تومان</p>
                </div>
                <div className="pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <div className="flex items-center justify-between mb-2.5 xl:text-super-sm lg:text-sm md:text-base text-super-sm">
                        <p className="text-[#353535]">هزینه ارسال</p>
                        <p className="text-[#717171]">0 تومان</p>
                    </div>
                    <p className="xl:text-super-xs text-xs text-[#A9791C] font-light flex items-center gap-2 text-justify">
                        <WarningIcon className="lg:w-11 lg:h-11" />
                        هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
                    </p>
                </div>

                <div className="flex items-center justify-between pb-4 md:mb-4 mb-3 xl:text-base md:text-base text-super-sm">
                    <p className="text-[#353535]">مبلغ قابل پرداخت</p>
                    <p className="text-[#417F56]">{PersianNumber(FormatPrice(amount))} تومان</p>
                </div>

                <button className="bg-[#417F56] w-full py-2 rounded-md flex items-center justify-center text-white lg:text-super-sm text-sm font-light">
                    تکمیل اطلاعات <ChevronIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] rotate-90" />
                </button>
            </aside>
        </section>
    );
};

export default CartLayout;
