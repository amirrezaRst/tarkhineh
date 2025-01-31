import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const CartMiniItem = ({ id, menuItem, quantity }) => {
    const { name, price } = menuItem;

    return (
        <div className="odd:bg-[#F9F9F9] even:bg-[#f0f0f0] flex items-center justify-between py-3 px-4">
            <div className="flex flex-col justify-between gap-2">
                <h3 className="text-[#353535] md:text-super-base">{name}</h3>
                <p className="md:text-sm text-super-xs text-[#717171]">{PersianNumber(price || 0)} تومان</p>
            </div>
            <div className="bg-[#E5F2E9] flex items-center justify-between gap-2 py-2.5 px-2 rounded-md">
                <button>
                    <PlusIcon className="w-4.5 h-4.5 stroke-[#417F56]" />
                </button>
                <p className="text-[#417F56]">{PersianNumber(quantity)}</p>
                {quantity > 1 ?
                    <button>
                        <MinusIcon className="w-4.5 h-4.5 stroke-[#417F56]" />
                    </button> :
                    <button>
                        <TrashIcon className="w-4.5 h-4.5 fill-[#417F56]" />
                    </button>
                }
            </div>
        </div>
    );
}

export default CartMiniItem;