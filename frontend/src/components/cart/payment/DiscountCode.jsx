import { CheckmarkIcon, DiscountIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

const DiscountCode = () => {
    const [code, setCode] = useState();
    const [isApplied, setIsApplied] = useState(false);
    const { cart, setDiscount } = useCartStore();


    const handleValidateCoupon = async (e) => {
        e.preventDefault();

        if (isApplied) return false;

        let totalAmount = 0;

        cart.forEach(item => {
            const { menuItem, quantity } = item;
            const { price, discount } = menuItem;

            let finalPrice = price;

            if (discount) {
                const { discountType, discountValue } = discount;

                if (discountType === "percentage") {
                    finalPrice = price - (price * (discountValue / 100));
                } else if (discountType === "flat") {
                    finalPrice = price - discountValue;
                }
            }

            totalAmount += finalPrice * quantity;
        });


        try {
            const { coupon } = await api.post("/coupon/validate-coupon", { code, itemAmount: totalAmount });
            setDiscount(coupon);
            setIsApplied(true);
            toast.success("کد تخفیف ثبت و اعمال شد.");
        } catch (err) {
            if (err.status === 404) return toast.error("کد تخفیف معتبر نیست.");
            if (err.status === 400) return toast.error(err.message);
            toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        }
    };


    return (
        <div
            className="border border-[#CBCBCB] rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-4"
        >
            <form
                className="flex md:flex-row flex-col md:items-center gap-3.5"
                onSubmit={handleValidateCoupon}
            >
                <div className="flex items-center gap-1.5 ml-1.5 md:border-b-0 border-b border-b-[#CBCBCB] md:pb-0 pb-4 md:mb-0 mb-1">
                    <DiscountIcon className="md:w-8 md:h-8" />
                    <p className="text-[#353535] lg:text-lg md:text-base text-super-sm">ثبت کد تخفیف</p>
                </div>
                <div className="flex-1 w-full flex gap-3.5">
                    <input
                        type="text"
                        className={`flex-1 md:text-base text-sm text-[#717171] read-only:text-[#417F56] border border-[#CBCBCB] read-only:border-[#417F56] read-only:focus:outline-none rounded-md py-2 md:px-6 px-2.5`}
                        placeholder="کد تخفیف"
                        value={code}
                        readOnly={isApplied}
                        onChange={({ target: { value } }) => value.length <= 9 && !isApplied && setCode(value)}
                    />
                    <button
                        type="submit"
                        className={`bg-[#417F56] disabled:bg-[#CBCBCB] md:text-base text-sm  text-white rounded-md py-2 md:px-4 px-2.5 ${isApplied && "cursor-default"}`}
                        disabled={code?.length !== 9}
                    >
                        {isApplied ?
                            <div className="flex items-center">
                                ثبت شد <CheckmarkIcon className="fill-white" />
                            </div> :
                            "ثبت کد"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DiscountCode;