"use client";

import CategoryNavigation from "@/components/menusPage/CategoryNavigation";
import SearchSection from "@/components/menusPage/SearchSection";
import MenuSection from "./MenuSection";
import { useSearchParams } from "next/navigation";

const MenuPage = () => {
    const category = useSearchParams().get("category") || "main";


    return (
        <>
            {/*//! Category Navigation */}
            <CategoryNavigation />

            {/*//! Searchbox section */}
            <SearchSection />

            <main className="container md:py-20 py-12 space-y-12">


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



                {/*//! START Persian Food Section */}
                {/* <section>

                    //! Section Title
                    <div className="flex items-center justify-between">

                        <h2 className="lg:text-2.5xl text-1.5xl font-semibold">غذاهای ایرانی</h2>

                        <button
                            className="border border-[#417F56] flex items-center gap-2 text-[#417F56] md:text-base text-sm font-medium px-7 py-2 rounded-md"
                        >
                            <ShoppingCardIcon className="fill-[#417F56]" /> تکمیل خرید
                        </button>

                    </div>


                    //! START Menu List
                    <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">




                    </article>
                    //? END Menu List


                </section> */}
                {/*//? END Persian Food Section */}


            </main>


        </>
    );
}

export default MenuPage;