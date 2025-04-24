import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import { CheckmarkIcon, ChevronIcon } from "@/assets/Icons";

const OrderCategoryItem = ({ label, active, icon, category }) => {
    return (
        <PreserveQueryLink
            className={`flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 md:text-super-sm text-sm cursor-pointer rounded-full
            ${active ? "bg-[#E5F2E9] text-[#353535]" : "bg-[#EDEDED] text-[#353535]"}`}
            query={{ category }}
        >
            <span>{label}</span>
            {icon}
            {active ?
                <CheckmarkIcon className="fill-[#417F56]" /> :
                <ChevronIcon className="fill-[#717171] rotate-90" />
            }
        </PreserveQueryLink>
    );
};

export default OrderCategoryItem;
