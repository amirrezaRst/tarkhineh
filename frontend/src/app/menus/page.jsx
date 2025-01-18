"use client";

import CategoryNavigation from "@/components/menusPage/CategoryNavigation";
import SearchSection from "@/components/menusPage/SearchSection";
import MenuSection from "./MenuSection";
import { useSearchParams } from "next/navigation";
import SelectBranchSection from "../branches/SelectBranchSection";
import { ShoppingCartIcon } from "@/assets/Icons";
import CartButtonFlow from "./CartButtonFlow";
import useUserStore from "@/stores/useUserStore";

const MenuPage = () => {
    const branch = useSearchParams().get("branch");
    const category = useSearchParams().get("category") || "main";
    const cart = useUserStore(state => state.cart);


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

                    <CartButtonFlow cart={cart} />

                </> : null
            }

        </>
    );
}

export default MenuPage;