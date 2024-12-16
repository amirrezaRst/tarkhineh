import { HeartIcon, StarIcon } from "@/assets/Icons";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";

const MenuCard = ({ _id, name, price, images, discount, reviews, available }) => {

    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;

    return (
        <div
            className="w-[250px] bg-white flex-shrink-0 border border-[#cbcbcb] rounded-lg overflow-hidden"
        >

            <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}`}
                alt={name}
                className="w-full h-[220px] object-center object-cover"
            />

            {/*// Card Content */}
            <div className="pt-2 pb-3.5 px-3">
                <h3 className="text-[#353535] text-lg text-center font-semibold mb-2.5">
                    {name}
                </h3>

                <div className="flex items-center justify-between gap-2">

                    <div className="text-[#adadad] text-xs flex items-center gap-2">
                        <HeartIcon className="stroke-[#adadad]" />
                        {/* <span>افزودن به علاقمندی ها</span> */}
                    </div>

                    <div className={`${discount ? "flex" : "hidden"} items-center justify-center gap-2`}>
                        <span
                            className="text-[#ADADAD] 3xl:text-lg text-base line-through"
                        >{FormatPrice(price)}</span>
                        <span
                            className="bg-[#FFF2F2] 3xl:text-base text-sm text-[#C30000] rounded-full pt-0.5 px-2"
                        >
                            {discount?.discountType === "percentage" ?
                                `%${PersianNumber(discount?.discountValue || 0)}` :
                                `$${PersianNumber(discount?.discountValue || 0)}`}
                        </span>
                    </div>

                </div>

                <div className="flex items-center justify-between gap-2 mt-2">

                    <div className="font-medium text-super-base flex items-center gap-0.5">
                        <StarIcon className="w-[22px] h-[22px]" />
                        <p>{PersianNumber(reviews?.averageRating || 0)} <span className="text-[#adadad] font-light text-xs mr-0.5">({PersianNumber(reviews?.total)} امتیاز)</span></p>
                    </div>

                    <p className="text-[#353535] ">{FormatPrice(finalPrice)} تومان</p>

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