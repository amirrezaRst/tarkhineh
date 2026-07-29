import MenuCard from "@/components/menusPage/MenuCard";
import { fetchSearchItems } from "@/services/MenuService";
import { useEffect, useState } from "react";
import { SkeletonMenuCard } from "@/components/Skeleton";

const SearchResultsSection = ({ branchId, search }) => {
    const [items, setItems] = useState();

    useEffect(() => {
        if (!branchId || !search) return;
        setItems(undefined); // back to skeleton — otherwise the previous search's results would linger during the new one
        const controller = new AbortController();
        fetchSearchItems(branchId, search, setItems, controller.signal);
        return () => controller.abort();
    }, [branchId, search]);

    return (
        <section>
            <h2 className="lg:text-2.5xl text-xl text-foreground md:font-semibold font-bold">
                نتایج جستجو برای «{search}»
            </h2>

            <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 md:mt-10 mt-3.5">

                {items === undefined && [0, 1].map((i) => <SkeletonMenuCard key={i} />)}

                {items?.length > 0 && items?.map((item, index) => (
                    <MenuCard key={index} {...item} branch={branchId && branchId} />
                ))}
                {items?.length === 0 &&
                    <p className="mt-0 text-foreground font-light">
                        آیتمی با این عنوان پیدا نشد.
                    </p>
                }

            </article>
        </section>
    );
}

export default SearchResultsSection;
