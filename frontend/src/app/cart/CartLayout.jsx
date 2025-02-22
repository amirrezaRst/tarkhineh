// import { ChevronIcon, CircleCheckmarkIcon, PersonalWalletIcon, TrashIcon, WalletIcon, WarningIcon } from "@/assets/Icons";
// import PersianNumber from "@/utils/ConvertToPersianNumber";
// import FormatPrice from "@/utils/FormatPrice";
// import { useMemo, useState } from "react";
// import CartMiniItem from "../../components/cart/CartMiniItem";
// import useUserStore from "@/stores/useUserStore";
// import CartPopup from "../../components/cart/CartPopup";
// import { deleteCart } from "@/services/MenuService";
// import useCartStore from "@/stores/useCartStore";
// import CartMiniItemSkeleton from "../../components/cart/CartMiniItemSkeleton";

// const CartLayout = ({ children, cart, step, setStep, handler }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const { loading, clearCart, cartBranch, deliveryType, discount } = useCartStore();
//     const user = useUserStore(state => state.user);


//     const { amount, totalDiscount } = useMemo(() => {
//         return cart?.reduce(
//             (acc, item) => {
//                 const { menuItem, quantity } = item;
//                 const { price, discount } = menuItem;

//                 //! discount calculation
//                 let itemDiscount = 0;
//                 if (discount) {
//                     if (discount.discountType === "percentage") {
//                         itemDiscount = (price * discount.discountValue) / 100;
//                     } else {
//                         itemDiscount = discount.discountValue;
//                     }
//                 }

//                 //! final amount
//                 const discountedPrice = price - itemDiscount;

//                 acc.totalDiscount += itemDiscount * quantity;
//                 acc.amount += discountedPrice * quantity;

//                 return acc;
//             },
//             { amount: 0, totalDiscount: 0 }
//         );
//     }, [cart]);

//     const handleDeleteCart = async () => {
//         deleteCart(user?._id, clearCart)
//     };



//     return (
//         <section className="flex lg:flex-row flex-col items-start xl:gap-10 gap-5">
//             {/*//! Main Content */}
//             <article className={`${step == 1 && "lg:block hidden"} flex-1 w-full`}>{children}</article>

//             {/*//! Side Content */}
//             <aside className="xl:w-[440px] lg:w-[300px] w-full border border-[#CBCBCB] rounded-lg xl:py-8 xl:px-6 lg:py-3 lg:px-3.5 md:p-8 p-4">
//                 <div className="md:flex hidden items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB]">
//                     <p className="text-[#353535] xl:text-super-base lg:text-super-sm text-super-base">
//                         سبد خرید ({PersianNumber(cart.length)})
//                     </p>
//                     <button
//                         className="p-1.5"
//                         onClick={() => setIsOpen(true)}
//                     >
//                         <TrashIcon className="xl:w-6 xl:h-6 lg:w-5 lg:h-5 w-6 h-6 fill-[#353535]" />
//                     </button>
//                 </div>

//                 {/*//! Cart Items List */}
//                 <div
//                     className={`max-h-56 ${step == 1 ? "lg:hidden block" : "lg:block hidden"}  overflow-hidden pb-4 mb-4 border-b border-b-[#CBCBCB] overflow-y-auto`}
//                 >

//                     <div className={`${step == 1 ? "border border-[#CBCBCB] rounded-lg px-3 py-3.5" : " space-y-3"}`}>

//                         {cart?.length == 0 ?
//                             [...Array(3)].map((item, index) => (
//                                 <CartMiniItemSkeleton key={index} />
//                             )) : cart?.map(({ menuItem, quantity, _id: id }, index) => (
//                                 <CartMiniItem key={index} id={id} menuItem={menuItem} quantity={quantity} branch={cartBranch} />
//                             ))
//                         }

//                     </div>

//                 </div>
//                 <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB] xl:text-super-sm lg:text-sm md:text-base text-super-sm">
//                     <p className="text-[#353535]">تخفیف محصولات</p>
//                     <p className="text-[#717171]">{PersianNumber(FormatPrice(totalDiscount))} تومان</p>
//                 </div>
//                 <div className="pb-4 mb-4 border-b border-b-[#CBCBCB]">
//                     <div className="flex items-center justify-between mb-2.5 xl:text-super-sm lg:text-sm md:text-base text-super-sm">
//                         <p className="text-[#353535]">هزینه ارسال</p>
//                         <p className="text-[#717171]">{PersianNumber(FormatPrice(step > 1 && deliveryType == "courier" ? 29000 : 0))} تومان</p>
//                     </div>
//                     <p className={step == 1 ? "xl:text-super-xs text-xs text-[#A9791C] font-light flex items-center gap-2 text-justify" : "hidden"}>
//                         <WarningIcon className="fill-[#A9791C] lg:w-11 lg:h-11" />
//                         هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
//                     </p>
//                 </div>

//                 <div className="flex items-center justify-between pb-4 md:mb-4 mb-3 xl:text-base md:text-base text-super-sm">
//                     <p className="text-[#353535]">مبلغ قابل پرداخت</p>
//                     <p className="text-[#417F56]">{PersianNumber(FormatPrice(amount))} تومان</p>
//                 </div>

//                 <button
//                     className="bg-[#417F56] w-full py-2 rounded-md flex items-center justify-center text-white lg:text-super-sm text-sm font-light"
//                     onClick={step < 3 ? () => setStep(step + 1) : handler}
//                 >
//                     {loading ?
//                         "loading..." : step === 1 ?
//                             <>
//                                 تکمیل اطلاعات <ChevronIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] rotate-90" />
//                             </> : step === 2 ?
//                                 <>
//                                     <CircleCheckmarkIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] ml-1.5" /> ثبت سفارش
//                                 </> :
//                                 <>
//                                     <PersonalWalletIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] ml-1.5" /> تایید و پرداخت
//                                 </>
//                     }
//                 </button>
//             </aside>

//             <CartPopup
//                 title="خالی کردن سبد خرید"
//                 text="آیا از حذف این آیتم از سبد خرید مطمئن هستید؟ این عملیات قابل بازگشت نیست!"
//                 isOpen={isOpen}
//                 setIsOpen={setIsOpen}
//                 handler={handleDeleteCart}
//             />

//         </section>
//     );
// };

// export default CartLayout;



import { ChevronIcon, CircleCheckmarkIcon, PersonalWalletIcon, TrashIcon, WalletIcon, WarningIcon } from "@/assets/Icons";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";
import { useMemo, useState } from "react";
import CartMiniItem from "../../components/cart/CartMiniItem";
import useUserStore from "@/stores/useUserStore";
import CartPopup from "../../components/cart/CartPopup";
import { deleteCart } from "@/services/MenuService";
import useCartStore from "@/stores/useCartStore";
import CartMiniItemSkeleton from "../../components/cart/CartMiniItemSkeleton";

const CartLayout = ({ children, cart, step, setStep, handler }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { loading, clearCart, cartBranch, deliveryType, discount } = useCartStore();
    const user = useUserStore(state => state.user);

    // محاسبه مبلغ اولیه و تخفیف محصولات
    const { amount, totalDiscount } = useMemo(() => {
        return cart?.reduce(
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

    // اعمال کد تخفیف
    const finalDiscount = useMemo(() => {
        if (!discount) return totalDiscount;
        const discountValue = discount.discountType === "percentage"
            ? (amount * discount.discountValue) / 100
            : discount.discountValue;
        return totalDiscount + discountValue;
    }, [amount, totalDiscount, discount]);

    //! calculating the final amount after applying the discount code
    const finalAmount = useMemo(() => {
        if (!discount) return amount;
        const discountValue = discount.discountType === "percentage"
            ? (amount * discount.discountValue) / 100
            : discount.discountValue;
        return Math.max(amount - discountValue, 0);
    }, [amount, discount]);

    const handleDeleteCart = async () => {
        deleteCart(user?._id, clearCart);
    };

    return (
        <section className="flex lg:flex-row flex-col items-start xl:gap-10 gap-5">
            {/*//! Main Content */}
            <article className={`${step == 1 && "lg:block hidden"} flex-1 w-full`}>{children}</article>

            {/*//! Side Content */}
            <aside className="xl:w-[440px] lg:w-[300px] w-full border border-[#CBCBCB] rounded-lg xl:py-8 xl:px-6 lg:py-3 lg:px-3.5 md:p-8 p-4">
                <div className="md:flex hidden items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <p className="text-[#353535] xl:text-super-base lg:text-super-sm text-super-base">
                        سبد خرید ({PersianNumber(cart.length)})
                    </p>
                    <button
                        className="p-1.5"
                        onClick={() => setIsOpen(true)}
                    >
                        <TrashIcon className="xl:w-6 xl:h-6 lg:w-5 lg:h-5 w-6 h-6 fill-[#353535]" />
                    </button>
                </div>

                {/*//! Cart Items List */}
                <div
                    className={`max-h-56 ${step == 1 ? "lg:hidden block" : "lg:block hidden"} overflow-hidden pb-4 mb-4 border-b border-b-[#CBCBCB] overflow-y-auto`}
                >
                    <div className={`${step == 1 ? "border border-[#CBCBCB] rounded-lg px-3 py-3.5" : " space-y-3"}`}>
                        {cart?.length == 0 ?
                            [...Array(3)].map((item, index) => (
                                <CartMiniItemSkeleton key={index} />
                            )) : cart?.map(({ menuItem, quantity, _id: id }, index) => (
                                <CartMiniItem key={index} id={id} menuItem={menuItem} quantity={quantity} branch={cartBranch} />
                            ))
                        }
                    </div>
                </div>

                {/*//! تخفیف محصولات */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-[#CBCBCB] xl:text-super-sm lg:text-sm md:text-base text-super-sm">
                    <p className="text-[#353535]">{discount ? "تخفیف کل" : "تخفیف محصولات"}</p>
                    <div className="flex flex-col">
                        <p className={`text-[#717171] ${discount && "line-through"}`}>{PersianNumber(FormatPrice(totalDiscount))} تومان</p>
                        {discount &&
                            <p className="text-[#717171]">{PersianNumber(FormatPrice(finalDiscount))} تومان</p>
                        }
                    </div>
                </div>

                {/*//! هزینه ارسال */}
                <div className="pb-4 mb-4 border-b border-b-[#CBCBCB]">
                    <div className="flex items-center justify-between mb-2.5 xl:text-super-sm lg:text-sm md:text-base text-super-sm">
                        <p className="text-[#353535]">هزینه ارسال</p>
                        <p className="text-[#717171]">{PersianNumber(FormatPrice(step > 1 && deliveryType == "courier" ? 26000 : 0))} تومان</p>
                    </div>
                    <p className={step == 1 ? "xl:text-super-xs text-xs text-[#A9791C] font-light flex items-center gap-2 text-justify" : "hidden"}>
                        <WarningIcon className="fill-[#A9791C] lg:w-11 lg:h-11" />
                        هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
                    </p>
                </div>

                {/*//! مبلغ قابل پرداخت */}
                <div className="flex items-center justify-between pb-4 md:mb-4 mb-3 xl:text-base md:text-base text-super-sm">
                    <p className="text-[#353535]">مبلغ قابل پرداخت</p>
                    <p className="text-[#417F56]">{PersianNumber(FormatPrice(finalAmount))} تومان</p>
                </div>

                <button
                    className="bg-[#417F56] w-full py-2 rounded-md flex items-center justify-center text-white lg:text-super-sm text-sm font-light"
                    onClick={step < 3 ? () => setStep(step + 1) : () => handler(finalAmount,finalDiscount)}
                >
                    {loading ?
                        "loading..." : step === 1 ?
                            <>
                                تکمیل اطلاعات <ChevronIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] rotate-90" />
                            </> : step === 2 ?
                                <>
                                    <CircleCheckmarkIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] ml-1.5" /> ثبت سفارش
                                </> :
                                <>
                                    <PersonalWalletIcon className="lg:w-6 lg:h-6 w-5 h-5 fill-[#fff] ml-1.5" /> تایید و پرداخت
                                </>
                    }
                </button>
            </aside>

            <CartPopup
                title="خالی کردن سبد خرید"
                text="آیا از حذف این آیتم از سبد خرید مطمئن هستید؟ این عملیات قابل بازگشت نیست!"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handler={handleDeleteCart}
            />
        </section>
    );
};

export default CartLayout;
