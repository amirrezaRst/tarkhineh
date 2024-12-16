import { HeartIcon, StarIcon } from "@/assets/Icons";
import FormatPrice from "@/utils/FormatPrice";
import MenuCardDiscount from "./MenuCardDiscount";
import MenuCardLike from "./MenuCardLike";
import MenuCardRate from "./MenuCardRate";

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

                    <MenuCardLike />
                    <MenuCardDiscount discount={discount} price={price} />

                </div>

                <div className="flex items-center justify-between gap-2 mt-2">

                    <MenuCardRate reviews={reviews} />
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