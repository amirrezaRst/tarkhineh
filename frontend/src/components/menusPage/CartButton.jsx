import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";
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
        <button disabled className="w-full bg-surface-sunken text-muted-fg rounded-md py-1.5 text-super-sm leading-6 mt-4 cursor-not-allowed">
            ناموجود
        </button>
    );

    return (
        <>
            {quantity === null ?
                <div className="w-full py-3" /> : quantity > 0 ? <div
                    className="bg-primary-subtle w-full text-primary flex items-center justify-around rounded-md mt-4 px-3"
                >

                    <button
                        className="p-1.5"
                        onClick={handleAddToCart}
                    >
                        <PlusIcon className="w-6 h-6 stroke-primary" />
                    </button>
                    <p>
                        {quantity}
                    </p>
                    {quantity == 1 ?
                        <button
                            className="p-1.5"
                            onClick={handleDecrease}
                        >
                            <TrashIcon className="w-[22px] h-[22px] fill-primary" />
                        </button> :
                        <button
                            className="p-1.5"
                            onClick={handleDecrease}
                        >
                            <MinusIcon className="w-6 h-6 stroke-primary" />
                        </button>
                    }

                </div> :
                    <button
                        className="w-full bg-primary text-white rounded-md py-1.5 text-super-sm leading-6 mt-4"
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