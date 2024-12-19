"use client";

import MenuCard from "@/components/menusPage/MenuCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MenuSection = ({ title }) => {
    const [items, setItems] = useState();
    const [branchId, setBranchId] = useState(null)
    const branch = useSearchParams().get("branch");
    const category = useSearchParams().get("category") || "main";


    const fetchMenuItems = async () => {
        console.log("fetch menu items")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/get-branch-items/${branchId}?sortBy=asc&category=${category}`);
        const data = await res.json();

        setItems(data?.branch?.menus);
    }


    useEffect(() => {
        if (branch) {
            if (branch == "aghdasiyeh") setBranchId("675de19cf836156025ee8575");
            else if (branch == "tehranpars") setBranchId("675f4c1655060567771c7884");
            else if (branch == "vanak") setBranchId("675f4bfe55060567771c7881");
            else if (branch == "chalous") setBranchId("675f4c3155060567771c7887");
        }
    }, [branch]);

    useEffect(() => {
        if (branchId) {
            fetchMenuItems();
        }
    }, [branchId, category])


    return (
        <section>
            <h2
                className={`lg:text-2.5xl text-1.5xl text-[#353535] font-semibold`}
            >
                {title}
            </h2>

            <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">

                {items?.length > 0 && items?.map((item, index) => (
                    <MenuCard key={index} {...item} />
                ))}

            </article>
        </section>
    );
}

export default MenuSection;