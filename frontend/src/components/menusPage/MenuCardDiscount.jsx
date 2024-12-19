import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const MenuCardDiscount = ({ discount, price }) => {
    return (
        <div className={`${discount ? "flex" : "hidden"} items-center justify-center gap-2`}>
            <span
                className="text-[ 3xl:text-lg text-base#ADADAD] line-through"
            >{FormatPrice(price)}</span>
            <span
                className="bg-[#FFF 3xl:text-base2F2] text-sm text-[#C30000] rounded-full pt-0.5 px-2"
            >
                {discount?.discountType === "percentage" ?
                    `%${PersianNumber(discount?.discountValue || 0)}` :
                    `$${PersianNumber(discount?.discountValue || 0)}`}
            </span>
        </div>
    );
}

export default MenuCardDiscount;