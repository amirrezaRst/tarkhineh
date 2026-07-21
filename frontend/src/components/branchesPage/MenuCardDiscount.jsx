import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const MenuCardDiscount = ({discount,price}) => {
    return (
        <div className={`${discount ? "flex" : "hidden"} items-center justify-center gap-2`}>
            <span
                className="text-subtle-fg 3xl:text-lg text-base line-through"
            >{FormatPrice(price)}</span>
            <span
                className="bg-destructive-subtle 3xl:text-base text-sm text-destructive rounded-full pt-0.5 px-2"
            >
                {discount?.discountType === "percentage" ?
                    `%${PersianNumber(discount?.discountValue || 0)}` :
                    `$${PersianNumber(discount?.discountValue || 0)}`}
            </span>
        </div>
    );
}

export default MenuCardDiscount;