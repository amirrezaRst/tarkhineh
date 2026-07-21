import { ShoppingCartIcon } from "@/assets/Icons";
import StarRating from "@/components/menusPage/StarRating";
import InterestCardLike from "./InterestCardLike";
import useUserStore from "@/stores/useUserStore";
import FormatPrice from "@/utils/FormatPrice";
import MenuCardDiscount from "@/components/menusPage/MenuCardDiscount";

const InterestCard = ({ id, name, price, images, discount, reviews }) => {
    const user = useUserStore(state => state.user);

    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;


    return (
        <div
            className="bg-white border border-border rounded-lg overflow-hidden flex flex-col"
        >

            <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}`}
                alt={`ترخینه ${name}`}
                className="w-full lg:h-[180px] md:h-40 h-44 object-cover object-center"
            />

            {/*// Content */}
            <div className="md:py-5 md:px-4 p-3.5 flex flex-col justify-between flex-1">

                <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-foreground text-xl font-semibold text-wrap">
                        {name}
                    </h3>
                    <InterestCardLike id={id} user={user?._id} />
                </div>

                <div className="flex items-center justify-between mb-5">


                    <StarRating rate={4.1} />

                    <div className="flex flex-col justify-between gap-1">
                        <MenuCardDiscount discount={discount} price={price} />
                        <h4 className="text-foreground text-super-base">
                            {FormatPrice(finalPrice)} تومان
                        </h4>
                    </div>

                </div>

                <button
                    className="w-full bg-primary flex items-center justify-center gap-1.5 text-white py-2 px-3 rounded-md"
                >
                    افزودن به سبد خرید <ShoppingCartIcon className="w-[21px] h-[21px] fill-white" />
                </button>

            </div>

        </div>
    );
}

export default InterestCard;