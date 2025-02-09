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
        <div className="odd:bg-[#F9F9F9] even:bg-[#f0f0f0] flex items-center justify-between py-3 px-4">
            <div className="flex flex-col justify-between gap-2">
                <h3 className="text-[#353535] md:text-super-base">{name}</h3>
                <p className="md:text-sm text-super-xs text-[#717171]">{PersianNumber(price || 0)} تومان</p>
            </div>
            <div className="bg-[#E5F2E9] flex items-center justify-between gap-2 rounded-md">
                <button
                    className="py-2.5 px-1.5"
                    onClick={handelIncreaseQuantity}
                >
                    <PlusIcon className="w-4.5 h-4.5 stroke-[#417F56]" />
                </button>
                <p className="text-[#417F56]">{PersianNumber(quantity)}</p>
                {quantity > 1 ?
                    <button
                        className="py-2.5 px-1.5"
                        onClick={handleDecreaseQuantity}
                    >
                        <MinusIcon className="w-4.5 h-4.5 stroke-[#417F56]" />
                    </button> :
                    <button
                        className="py-2.5 px-1.5"
                        onClick={() => setIsOpen(true)}
                    >
                        <TrashIcon className="w-4.5 h-4.5 fill-[#417F56]" />
                    </button>
                }
            </div>

            <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="حذف ایتم سبد خرید">

                {/*//! Content */}
                <div className="md:min-h-36 min-h-32 flex flex-col justify-center gap-6 px-6">
                    <p className="md:text-super-base text-[#353535] text-center">
                        آیا از حذف این آیتم مطمئن هستید؟
                    </p>

                    <div className="flex gap-3">
                        <button
                            className="rounded-md border border-[#417F56] text-[#417F56] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                            onClick={() => setIsOpen(false)}
                        >
                            انصراف
                        </button>
                        <button
                            className="bg-[#FFF2F2] rounded-md border border-transparent text-[#C30000] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
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