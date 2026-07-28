import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";

// Compact variant: sits inline next to the final price in the branch menu
// card, so the struck-through original stays visually secondary.
const MenuCardDiscount = ({ discount, price }) => {
    if (!discount) return null;

    return (
        <div className="flex items-center gap-1.5">
            <span className="text-subtle-fg text-super-xs line-through tabular-nums">
                {FormatPrice(price)}
            </span>
            <span className="bg-destructive-subtle text-destructive text-super-xs font-bold rounded-full px-1.5 py-0.5 tabular-nums">
                {discount?.discountType === "percentage"
                    ? `${PersianNumber(discount?.discountValue || 0)}٪`
                    : PersianNumber(discount?.discountValue || 0)}
            </span>
        </div>
    );
}

export default MenuCardDiscount;
