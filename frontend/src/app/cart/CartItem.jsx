import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import Popup from "@/components/Popup";
import { addItemToCart, decreaseItemQuantity, increaseItemQuantity } from "@/services/MenuService";
import useUserStore from "@/stores/useUserStore";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";
import { useState } from "react";
import { toast } from "react-toastify";

const CartItem = ({ id, menuItem, quantity, branch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore(state => state.user);
    const setCart = useUserStore(state => state.setCart);
    const { name, price, images, discount, ingredients } = menuItem;

    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;

    const handleDelete = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${user?._id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                menuItemId: menuItem._id
            }),
            credentials: "include"
        }).then(res => res.json());

        const { status, message, cart } = response;

        console.log(response)
        setIsOpen(false);
        if (status == 500) return toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.")

        if (status == 404) return toast.error("آیتم مورد نظر یافت نشد.");
        setCart(cart.items)

        toast.success("آیتم با موفقیت از سبد خرید حذف شد.");
    }

    const handleDecreaseQuantity = async () => {
        decreaseItemQuantity(user, menuItem?._id, setCart);
    };

    const handelIncreaseQuantity = async () => {
        increaseItemQuantity(user, menuItem._id, branch, setCart)
    };


    return (
        <div className="flex border border-[#CBCBCB] rounded-lg overflow-hidden">
            <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images?.[0]}`}
                alt={`ترخینه ${name}`}
                className="xl:w-40 w-[8.5rem] object-cover"
            />

            {/*//! Cart Content */}
            <div className="py-5 px-6 flex-1 flex flex-col justify-between gap-5">

                <div className="flex items-center justify-between">
                    <h3 className="xl:text-1.5xl text-lg text-[#353535] font-medium">{name}</h3>
                    <button
                        className="p-1.5"
                        onClick={() => setIsOpen(true)}
                    >
                        <TrashIcon className="xl:w-6 xl:h-6 w-5 h-5 fill-[#353535]" />
                    </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <p className="text-[#353535] xl:text-base text-super-xs font-light text-wrap">
                        {ingredients?.map(item => `${item}، `)}
                    </p>
                    {discount &&
                        <div className="flex gap-1.5">
                            <p className="text-[#ADADAD] xl:text-super-base line-through">
                                {PersianNumber(FormatPrice(price))}
                            </p>
                            <span
                                className="bg-[#FFF2F2] xl:text-super-xs text-xs text-[#C30000] leading-4 flex items-center text-nowrap rounded-full px-2"
                            >
                                {discount?.discountValue} {discount.discountType == "percentage" ? "%" : "$"}
                            </span>
                        </div>
                    }
                </div>

                <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center xl:gap-8 gap-4">
                        <div className="bg-[#E5F2E9] text-[#417F56] flex items-center gap-2 rounded-md  px-4">
                            <button
                                className="p-1.5"
                                onClick={handelIncreaseQuantity}
                            >
                                <PlusIcon className="w-6 h-6 stroke-[#417F56]" />
                            </button>
                            <p className="text-super-base">{quantity}</p>
                            {quantity > 1 ?
                                <button
                                    className="p-1.5"
                                    onClick={handleDecreaseQuantity}
                                >
                                    <MinusIcon className="w-6 h-6 stroke-[#417F56]" />
                                </button> :
                                <button
                                    className="p-1.5"
                                    onClick={() => setIsOpen(true)}
                                >
                                    <TrashIcon className="w-5 h-5 fill-[#417F56]" />
                                </button>
                            }
                        </div>
                    </div>

                    <p className="text-[#353535] xl:text-lg">
                        {PersianNumber(FormatPrice(finalPrice))} تومان
                    </p>

                </div>
            </div>

            {/*//! Delete Item Popup */}
            <Popup isOpen={isOpen} setIsOpen={setIsOpen}>

                {/*//! Content */}
                <div className="min-h-36 flex flex-col justify-center gap-6 px-6">
                    <p className="text-super-base text-[#353535] text-center">
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

export default CartItem;