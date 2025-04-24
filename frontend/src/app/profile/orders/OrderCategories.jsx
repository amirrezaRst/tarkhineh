
import { useSearchParams } from "next/navigation";
import OrderCategoryItem from "./OrderCategoryItem";

const OrderCategories = ({ category }) => {

    return (
        <div className="flex items-center xl:flex-nowrap flex-wrap gap-2.5 overflow-hidden">
            <OrderCategoryItem
                label="همه"
                category="all"
                active={category === "all"}
            />
            <OrderCategoryItem
                label="جاری"
                category="preparing"
                active={category === "preparing"}
            />
            <OrderCategoryItem
                label="تحویل شده"
                category="delivered"
                active={category === "delivered"}
            />
            <OrderCategoryItem
                label="لغو شده"
                category="cancelled"
                active={category === "cancelled"}
            />
        </div>

    );
};

export default OrderCategories;
