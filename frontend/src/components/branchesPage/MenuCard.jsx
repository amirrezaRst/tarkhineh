import { HeartIcon, StarIcon } from "@/assets/Icons";

const MenuCard = () => {
    return (
        <div
            className="w-[250px] bg-white flex-shrink-0 border border-[#cbcbcb] rounded-lg overflow-hidden"
        >

            <img src="/images/food-image-1.jpg" alt="" className="w-full h-[220px] object-center object-cover" />

            {/*// Card Content */}
            <div className="pt-2 pb-3.5 px-3">
                <h3 className="text-[#353535] text-lg text-center font-semibold mb-2.5">
                    میرزا قاسمی
                </h3>

                <div className="flex items-center justify-between gap-2">

                    <div className="text-[#adadad] text-xs flex items-center gap-2">
                        <HeartIcon className="stroke-[#adadad]" />
                        {/* <span>افزودن به علاقمندی ها</span> */}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <span
                            className="text-[#ADADAD] 3xl:text-lg text-base line-through"
                        >۱۶۵٬۰۰۰</span>
                        <span
                            className="bg-[#FFF2F2] 3xl:text-base text-sm text-[#C30000] rounded-full pt-0.5 px-2"
                        >
                            %۱۰
                        </span>
                    </div>

                </div>

                <div className="flex items-center justify-between gap-2 mt-2">

                    <div className="font-medium text-super-base flex items-center gap-0.5">
                        <StarIcon className="w-[22px] h-[22px]" />
                        <p>۵ <span className="text-[#adadad] font-light text-xs mr-0.5">(۵۲ امتیاز)</span></p>
                    </div>

                    <p className="text-[#353535] ">۲۰۹٬۰۰۰ تومان</p>

                </div>

                <button
                    className="w-full bg-[#417F56] text-white rounded-md py-1.5 text-super-sm leading-6 mt-4"
                >
                    افزودن به سبد خرید
                </button>
            </div>

        </div>
    );
}

export default MenuCard;