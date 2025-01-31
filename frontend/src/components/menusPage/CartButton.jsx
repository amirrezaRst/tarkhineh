import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import useUserStore from "@/stores/useUserStore";
import { useEffect, useState } from "react";

const CartButton = ({ id, handleAddToCart, setLoading, loading }) => {
    const cart = useUserStore(state => state.cart);
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

    return (
        <>
            {quantity === null ?
                <div className="w-full py-3" /> : quantity > 0 ? <div
                    className="bg-[#E5F2E9] w-full text-[#417F56] flex items-center justify-around rounded-md mt-4 px-3"
                >

                    <button
                        className="p-1.5"
                        onClick={handleAddToCart}
                    >
                        <PlusIcon className="w-6 h-6 stroke-[#417F56]" />
                    </button>
                    <p>
                        {quantity}
                    </p>
                    {quantity == 1 ?
                        <button className="p-1.5">
                            <TrashIcon className="w-[22px] h-[22px] fill-[#417F56]" />
                        </button> :
                        <button className="p-1.5">
                            <MinusIcon className="w-6 h-6 stroke-[#417F56]" />
                        </button>
                    }

                </div> :
                    <button
                        className="w-full bg-[#417F56] text-white rounded-md py-1.5 text-super-sm leading-6 mt-4"
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