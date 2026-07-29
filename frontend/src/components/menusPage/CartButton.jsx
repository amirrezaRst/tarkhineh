import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { Skeleton } from "@/components/Skeleton";
import { useEffect, useState } from "react";

const CartButton = ({ id, handleAddToCart, handleDecrease, setLoading, loading, disabled }) => {
    const cart = useCartStore(state => state.cart);
    const [quantity, setQuantity] = useState(null);

    useEffect(() => {
        var item = cart?.find(item => {
            if (item.menuItem._id) {
                return item.menuItem._id === id
            } else if (item.menuItem) {
                return item.menuItem === id
            }
        });
        if (item) setQuantity(item.quantity);
        else {
            setQuantity(0);
            setLoading(false);
        }
    }, [cart]);


    if (disabled && !quantity) return (
        <button disabled className="w-full bg-surface-sunken text-muted-fg rounded-xl py-2 text-super-sm font-bold leading-6 mt-4 cursor-not-allowed">
            ناموجود
        </button>
    );

    return (
        <>
            {quantity === null ?
                <Skeleton className="w-full h-9 rounded-xl mt-4" /> : quantity > 0 ? <div
                    className="bg-primary-subtle w-full text-primary flex items-center justify-around rounded-xl mt-4 px-3"
                >

                    <button
                        className="p-1.5 rounded-lg hover:bg-primary/10 duration-200"
                        aria-label="افزودن یکی"
                        onClick={handleAddToCart}
                    >
                        <PlusIcon className="w-6 h-6 stroke-primary" />
                    </button>
                    <p className="font-extrabold tabular-nums">
                        {PersianNumber(quantity)}
                    </p>
                    {quantity == 1 ?
                        <button
                            className="p-1.5 rounded-lg hover:bg-primary/10 duration-200"
                            aria-label="حذف از سبد"
                            onClick={handleDecrease}
                        >
                            <TrashIcon className="w-[22px] h-[22px] fill-primary" />
                        </button> :
                        <button
                            className="p-1.5 rounded-lg hover:bg-primary/10 duration-200"
                            aria-label="کم کردن یکی"
                            onClick={handleDecrease}
                        >
                            <MinusIcon className="w-6 h-6 stroke-primary" />
                        </button>
                    }

                </div> :
                    <button
                        className="w-full bg-primary hover:bg-primary-hover text-primary-fg rounded-xl py-2 text-super-sm font-bold leading-6 mt-4 duration-200"
                        onClick={handleAddToCart}
                    >
                        {loading ?
                            "در حال اضافه شدن..." :
                            "افزودن به سبد خرید"
                        }
                    </button>
            }
        </>
    );
}

export default CartButton;
