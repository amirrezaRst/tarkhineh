import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/Icons";
import StarRating from "@/components/menusPage/StarRating";

const CartItem = () => {
    return (
        <div className="flex border border-[#CBCBCB] rounded-lg overflow-hidden">
            <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/8ukElyvu7.jpg`} alt="" className="w-40 object-cover" />

            {/*//! Cart Content */}
            <div className="py-5 px-6 flex-1 flex flex-col justify-between gap-5">

                <div className="flex items-center justify-between">
                    <h3 className="text-1.5xl text-[#353535] font-medium">پاستا سبزیجات</h3>
                    <button className="">
                        <TrashIcon className="w-6 h-6 fill-[#353535]" />
                    </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <p className="text-[#353535] font-light text-wrap">
                        پاستا، قارچ، گوجه، کدوی خوردشده، پیاز خلالی‌شده
                    </p>
                    <div className="flex gap-1.5">
                        <p className="text-[#ADADAD] text-super-base">۱۷۵٬۰۰۰</p>
                        <span className="bg-[#FFF2F2] text-super-xs text-[#C30000] leading-4 flex items-center rounded-full px-2">%۲۰</span>
                    </div>
                </div>

                <div className="flex justify-between gap-3">

                    <div className="flex items-center gap-8">
                        <StarRating rate={3.5} />
                        <div className="bg-[#E5F2E9] text-[#417F56] flex items-center gap-2 rounded-md py-1 px-2">
                            <button className="">
                                <PlusIcon className="w-4.5 h-4.w-4.5 stroke-[#417F56]" />
                            </button>
                            <p className="text-super-base">۱</p>
                            <button className="">
                                <MinusIcon className="w-4.5 h-4.w-4.5 stroke-[#417F56]" />
                            </button>
                        </div>
                    </div>

                    <p className="text-[#353535] text-lg">
                        ۲۵۲٬۰۰۰ تومان
                    </p>

                </div>
            </div>
        </div>
    );
}

export default CartItem;