import Image from "next/image";
import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import { decreaseItemQuantity, increaseItemQuantity, removeItemFromCart } from "@/services/MenuService";
import useUserStore from "@/stores/useUserStore";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";
import { useState } from "react";
import CartPopup from "../CartPopup";
import useCartStore from "@/stores/useCartStore";

const CartItem = ({ id, menuItem, quantity, branch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore(state => state.user);
    const setCart = useCartStore(state => state.setCart);
    const { name, price, images, discount, ingredients } = menuItem;

    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;

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
        <div className="flex border border-border rounded-lg overflow-hidden">
            <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images?.[0]}`}
                alt={`ترخینه ${name}`}
                width={160}
                height={160}
                className="xl:w-40 w-[8.5rem] h-auto self-stretch object-cover"
            />

            {/*//! Cart Content */}
            <div className="py-5 px-6 flex-1 flex flex-col justify-between gap-5">

                <div className="flex items-center justify-between">
                    <h3 className="xl:text-1.5xl text-lg text-foreground font-medium">{name}</h3>
                    <button
                        className="p-1.5"
                        onClick={() => setIsOpen(true)}
                    >
                        <TrashIcon className="xl:w-6 xl:h-6 w-5 h-5 fill-foreground" />
                    </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <p className="text-foreground xl:text-base text-super-xs font-light text-wrap">
                        {ingredients?.map(item => `${item}، `)}
                    </p>
                    {discount &&
                        <div className="flex gap-1.5">
                            <p className="text-subtle-fg xl:text-super-base line-through">
                                {PersianNumber(FormatPrice(price || 0))}
                            </p>
                            <span
                                className="bg-destructive-subtle xl:text-super-xs text-xs text-destructive leading-4 flex items-center text-nowrap rounded-full px-2"
                            >
                                {discount?.discountValue} {discount.discountType == "percentage" ? "%" : "$"}
                            </span>
                        </div>
                    }
                </div>

                <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center xl:gap-8 gap-4">
                        <div className="bg-primary-subtle text-primary flex items-center gap-2 rounded-md  px-4">
                            <button
                                className="p-1.5"
                                onClick={handelIncreaseQuantity}
                            >
                                <PlusIcon className="w-6 h-6 stroke-primary" />
                            </button>
                            <p className="text-super-base">{quantity}</p>
                            {quantity > 1 ?
                                <button
                                    className="p-1.5"
                                    onClick={handleDecreaseQuantity}
                                >
                                    <MinusIcon className="w-6 h-6 stroke-primary" />
                                </button> :
                                <button
                                    className="p-1.5"
                                    onClick={() => setIsOpen(true)}
                                >
                                    <TrashIcon className="w-5 h-5 fill-primary" />
                                </button>
                            }
                        </div>
                    </div>

                    <p className="text-foreground xl:text-lg">
                        {PersianNumber(FormatPrice(finalPrice))} تومان
                    </p>

                </div>
            </div>

            <CartPopup
                title="حذف ایتم سبد خرید"
                text="آیا از حذف این آیتم مطمئن هستید؟"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handler={handleDelete}
            />

        </div>
    );
}

export default CartItem;