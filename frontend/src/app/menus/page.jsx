"use client";

import CategoryNavigation from "@/components/menusPage/CategoryNavigation";
import SearchSection from "@/components/menusPage/SearchSection";
import MenuSection from "./MenuSection";
import { useSearchParams } from "next/navigation";
import SelectBranchSection from "../branches/SelectBranchSection";
import { ShoppingCardIcon } from "@/assets/Icons";

const MenuPage = () => {
    const branch = useSearchParams().get("branch");
    const category = useSearchParams().get("category") || "main";

    return (
        <>

            <SelectBranchSection branch={branch} href={"menus"} />

            {branch ?
                <>
                    {/*//! Category Navigation */}
                    <CategoryNavigation />

                    {/*//! Searchbox section */}
                    <SearchSection />

                    <main className="container md:py-12 py-8 space-y-12">

                        {category === "main" ?
                            <>
                                <MenuSection title="غذاهای ایرانی" category={category} foodType="iranian" />
                                <MenuSection title="غذاهای غیر ایرانی" category={category} foodType="non-iranian" />
                                <MenuSection title="پیتزاها" category={category} foodType="pizza" />
                                <MenuSection title="ساندویچ ها" category={category} foodType="sandwich" />
                            </> : category === "side" ?
                                <>
                                    <MenuSection title="پیش غذاهای ایرانی" category={category} sectionCategory="side" foodType="iranian" />
                                    <MenuSection title="پیش غذاهای غیر ایرانی" category={category} sectionCategory="side" foodType="non-iranian" />
                                </> : category === "dessert" ?
                                    <>
                                        <MenuSection title="دسرهای ایرانی" category={category} isPersian={true} />
                                        <MenuSection title="دسرهای غیر ایرانی" category={category} isPersian={false} />
                                    </> : category === "drink" ?
                                        <>
                                            <MenuSection title="نوشیدنی های ایرانی" category={category} isPersian={true} />
                                            <MenuSection title="نوشیدنی های غیر ایرانی" category={category} isPersian={false} />
                                        </> : null
                        }
                    </main>

                    <div className="container fixed bottom-5 translate-x-0 duration-1000">
                        <button
                            className="bg-white rounded-full border border-[#cbcbcb] flex items-center justify-center p-3.5 shadow-xl"
                        >
                            <div className="relative bg-red-400/10">
                                <ShoppingCardIcon className="fill-[#417F56] w-8 h-8" />
                                <span className="w-5 h-5 rounded-full bg-[#417F56] absolute -top-1.5 -right-1.5 text-white text-super-sm">4</span>
                            </div>
                        </button>
                    </div>

                </> : null
            }

        </>
    );
}

export default MenuPage;