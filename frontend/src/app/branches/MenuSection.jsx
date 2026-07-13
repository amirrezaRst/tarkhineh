import MenuCard from "@/components/branchesPage/MenuCard";
import { fetchBranchPageItems } from "@/services/MenuService";
import { useEffect, useState } from "react";

const MenuSection = ({ title, branchId, category, ratingSort, bgColor = 'white' }) => {
    const [items, setItems] = useState([]);
    const [branchName, setBranchName] = useState(null);

    useEffect(() => {
        if (!branchId) return;
        if (branchId == "675de19cf836156025ee8575") setBranchName("اقدسیه");
        else if (branchId == "675f4c1655060567771c7884") setBranchName("تهرانپارس");
        else if (branchId == "675f4bfe55060567771c7881") setBranchName("ونک");
        else if (branchId == "675f4c3155060567771c7887") setBranchName("چالوس");

        const controller = new AbortController();
        fetchBranchPageItems(branchId, category, ratingSort, setItems, controller.signal);
        return () => controller.abort();
    }, [branchId])

    return (
        <section className={`md:py-[4.5rem] py-10 transition-all duration-700 ${bgColor === 'green' ? 'bg-[#417F56]' : ''}`}>
            <div className="container">

                <h2
                    className={`md:text-2.5xl text-xl ${!branchName && "bg-[#ededed] inline-block px-14 animate-pulse"} rounded
                        ${bgColor === 'green' ? 'text-white' : 'text-[#353535]'} font-semibold`}
                >
                    <span className={`${branchName ? "opacity-100" : "opacity-0"} duration-200`}>
                        {title} شعبه {branchName}
                    </span>
                </h2>

                <div className="flex flex-nowrap gap-7 overflow-x-auto md:mt-11 mt-5 pb-1.5">
                    {items?.length > 0 && items?.map((item, index) => (
                        <MenuCard key={index} {...item} branch={branchId && branchId} />
                    ))}
                </div>

            </div>
        </section>
    );
}

export default MenuSection;