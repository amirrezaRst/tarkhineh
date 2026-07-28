"use client";

import CategoryNavigation from "@/components/menusPage/CategoryNavigation";
import SearchSection from "@/components/menusPage/SearchSection";
import MenuSection from "./MenuSection";
import SearchResultsSection from "./SearchResultsSection";
import { useSearchParams } from "next/navigation";
import SelectBranchSection from "../branches/SelectBranchSection";
import { ShoppingCartIcon } from "@/assets/Icons";
import CartButtonFlow from "./CartButtonFlow";
import useCartStore from "@/stores/useCartStore";
import useBranch from "@/hooks/useBranch";

const MenuPage = () => {
    const branch = useSearchParams().get("branch");
    const category = useSearchParams().get("category") || "main";
    const search = useSearchParams().get("q");
    const cart = useCartStore(state => state.cart);
    const { branchId, status } = useBranch(branch);


    return (
        <>

            <SelectBranchSection branch={branch} href={"menus"} />

            {branch && status === "not-found" &&
                <p className="container text-center text-muted-fg py-16">
                    شعبه‌ای با این مشخصات پیدا نشد.
                </p>
            }

            {branchId ?
                <>
                    {/*//! Category Navigation */}
                    <CategoryNavigation />

                    {/*//! Searchbox section */}
                    <SearchSection />

                    <main className="container md:py-12 py-8 space-y-12">

                        {search ?
                            <SearchResultsSection branchId={branchId} search={search} />
                            : category === "main" ?
                            <>
                                <MenuSection title="غذاهای ایرانی" branchId={branchId} category={category} foodType="iranian" />
                                <MenuSection title="غذاهای غیر ایرانی" branchId={branchId} category={category} foodType="non-iranian" />
                                <MenuSection title="پیتزاها" branchId={branchId} category={category} foodType="pizza" />
                                <MenuSection title="ساندویچ ها" branchId={branchId} category={category} foodType="sandwich" />
                            </> : category === "side" ?
                                <>
                                    <MenuSection title="پیش غذاهای ایرانی" branchId={branchId} category={category} sectionCategory="side" foodType="iranian" />
                                    <MenuSection title="پیش غذاهای غیر ایرانی" branchId={branchId} category={category} sectionCategory="side" foodType="non-iranian" />
                                </> : category === "dessert" ?
                                    <>
                                        <MenuSection title="دسرهای ایرانی" branchId={branchId} category={category} isPersian={true} />
                                        <MenuSection title="دسرهای غیر ایرانی" branchId={branchId} category={category} isPersian={false} />
                                    </> : category === "drink" ?
                                        <>
                                            <MenuSection title="نوشیدنی های ایرانی" branchId={branchId} category={category} isPersian={true} />
                                            <MenuSection title="نوشیدنی های غیر ایرانی" branchId={branchId} category={category} isPersian={false} />
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