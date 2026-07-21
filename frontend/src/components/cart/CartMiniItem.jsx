import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import useUserStore from "@/stores/useUserStore";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { decreaseItemQuantity, increaseItemQuantity, removeItemFromCart } from "@/services/MenuService";
import Popup from "@/components/Popup";
import { useState } from "react";
import useCartStore from "@/stores/useCartStore";

const CartMiniItem = ({ id, menuItem, quantity, branch }) => {
    const [isOpen, setIsOpen] = useState(false);

    const user = useUserStore(state => state.user);
    const setCart = useCartStore(state => state.setCart);

    const { name, price } = menuItem;

    const handleDelete = async () => {
        removeItemFromCart(user?._id, menuItem._id, setIsOpen, setCart)
    }

    const handleDecreaseQuantity = async () => {
        decreaseItemQuantity(user, menuItem?._id, setCart);
    };

    const handelIncreaseQuantity = async () => {
        increaseItemQuantity(user, menuItem._id, branch, setCart)
    };

    return (
        <div className="odd:bg-background even:bg-background flex items-center justify-between py-3 px-4">
            <div className="flex flex-col justify-between gap-2">
                <h3 className="text-foreground md:text-super-base">{name}</h3>
                <p className="md:text-sm text-super-xs text-muted-fg">{PersianNumber(price || 0)} تومان</p>
            </div>
            <div className="bg-primary-subtle flex items-center justify-between gap-2 rounded-md">
                <button
                    className="py-2.5 px-1.5"
                    onClick={handelIncreaseQuantity}
                >
                    <PlusIcon className="w-4.5 h-4.5 stroke-primary" />
                </button>
                <p className="text-primary">{PersianNumber(quantity)}</p>
                {quantity > 1 ?
                    <button
                        className="py-2.5 px-1.5"
                        onClick={handleDecreaseQuantity}
                    >
                        <MinusIcon className="w-4.5 h-4.5 stroke-primary" />
                    </button> :
                    <button
                        className="py-2.5 px-1.5"
                        onClick={() => setIsOpen(true)}
                    >
                        <TrashIcon className="w-4.5 h-4.5 fill-primary" />
                    </button>
                }
            </div>

            <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="حذف ایتم سبد خرید">

                {/*//! Content */}
                <div className="md:min-h-36 min-h-32 flex flex-col justify-center gap-6 px-6">
                    <p className="md:text-super-base text-foreground text-center">
                        آیا از حذف این آیتم مطمئن هستید؟
                    </p>

                    <div className="flex gap-3">
                        <button
                            className="rounded-md border border-primary text-primary text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                            onClick={() => setIsOpen(false)}
                        >
                            انصراف
                        </button>
                        <button
                            className="bg-destructive-subtle rounded-md border border-transparent text-destructive text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                            onClick={handleDelete}
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </Popup>

        </div>
    );
}

export default CartMiniItem;