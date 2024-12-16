"use client";

import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import { useSearchParams } from "next/navigation";


const NavigationItem = ({ title, query, handleActive }) => {
    return (
        <PreserveQueryLink href="/menus" query={{ category: query }}>
            <li className={handleActive(query)}>{title}</li>
        </PreserveQueryLink>
    )
};

const links = [
    { title: "غذای اصلی", query: "main" },
    { title: "پیش غذا", query: "side" },
    { title: "دسر", query: "dessert" },
    { title: "نوشیدنی", query: "drink" },
];



const CategoryNavigation = () => {
    const category = useSearchParams().get("category") || "main";

    const handleActive = (path) => {
        if (category === path) return "md:px-4 px-1 md:w-auto w-full text-center py-5 font-medium text-[#417F56] border-b border-b-[#417F56]"
        return "md:px-4 px-1 md:w-auto w-full text-center py-5"
    };


    return (
        <div className="bg-[#EDEDED] w-full ">
            <div className="container">
                <div className="relative inline-block md:w-auto w-full">

                    <ul
                        className="flex items-center md:text-super-base text-[#717171] md:w-auto w-full"
                    >
                        {links.map((item, index) =>
                            <NavigationItem key={index} {...item} handleActive={handleActive} />
                        )}
                    </ul>

                </div>
            </div>
        </div>
    );
}

export default CategoryNavigation;