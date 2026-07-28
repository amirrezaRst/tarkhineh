import MenuCard from "@/components/menusPage/MenuCard";
import { fetchMenuPageItems } from "@/services/MenuService";
import { useEffect, useState } from "react";

const MenuSection = ({ title, branchId, category, foodType, isPersian }) => {
    const [items, setItems] = useState();

    useEffect(() => {
        if (!branchId) return;
        const controller = new AbortController();
        fetchMenuPageItems(branchId, category, foodType, isPersian, setItems, controller.signal);
        return () => controller.abort();
    }, [branchId, category])


    return (
        <section>
            <h2
                className={`lg:text-2.5xl text-xl text-foreground md:font-semibold font-bold`}
            >
                {title}
            </h2>

            <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 md:mt-10 mt-3.5">

                {items?.length > 0 && items?.map((item, index) => (
                    <MenuCard key={index} {...item} branch={branchId && branchId} />
                ))}
                {items?.length === 0 &&
                    <p className="mt-0 text-foreground font-light">
                        اینجا خالی است، اما ترخینه همیشه در حال آماده کردن بهترین‌هاست.
                    </p>
                }

            </article>
        </section>
    );
}

export default MenuSection;