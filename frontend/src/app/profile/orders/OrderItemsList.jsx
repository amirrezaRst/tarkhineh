import { useState } from "react";
import OrderFoodItem from "./OrderFoodItem";

const OrderItemsList = ({ items }) => {
    const [showAll, setShowAll] = useState(false);

    const getVisibleCount = () => {
        if (typeof window !== "undefined") {
            if (window.innerWidth >= 1280) return 5; // xl
            if (window.innerWidth >= 768) return 4;  // md
        }
        return 2; // sm and default
    };

    const visibleCount = getVisibleCount();
    const visibleItems = showAll ? items : items.slice(0, visibleCount);
    const shouldShowToggle = items.length > visibleCount;


    return (
        <>
            <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3.5 mt-9 md:mb-5 mb-3.5 transition-all duration-300 ease-in-out">
                {visibleItems.map((item, index) => (
                    <OrderFoodItem
                        key={index}
                        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.menuItem.images?.[0]}`}
                        name={item.menuItem.name}
                        price={item.price}
                        count={item.quantity}
                    />
                ))}
            </div>

            {shouldShowToggle && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-muted-fg text-center text-super-xs mb-6 cursor-pointer transition-colors hover:text-black"
                >
                    {showAll ? "بستن سفارشات" : "مشاهده همه سفارشات"}
                </button>
            )}
        </>
    );
};

export default OrderItemsList;
