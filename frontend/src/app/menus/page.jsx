import { ShoppingCardIcon } from "@/assets/Icons";
import CategoryNavigation from "@/components/menusPage/CategoryNavigation";
import MenuCard from "@/components/menusPage/MenuCard";

const MenuPage = () => {
    return (
        <>
            {/*//! Category Navigation */}
            <CategoryNavigation />

            {/*//! START Searchbox section */}

            {/*//? END Searchbox section */}



            <main className="container md:py-20 py-12 space-y-12">

                {/*//! START Persian Food Section */}
                <section>

                    {/*//! Section Title */}
                    <div className="flex items-center justify-between">

                        <h2 className="lg:text-2.5xl text-1.5xl font-semibold">غذاهای ایرانی</h2>

                        <button
                            className="border border-[#417F56] flex items-center gap-2 text-[#417F56] md:text-base text-sm font-medium px-7 py-2 rounded-md"
                        >
                            <ShoppingCardIcon className="fill-[#417F56]" /> تکمیل خرید
                        </button>

                    </div>


                    {/*//! START Menu List */}
                    <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">


                        <MenuCard />


                    </article>
                    {/*//? END Menu List */}


                </section>
                {/*//? END Persian Food Section */}


                {/*//! START non persian Food Section */}
                <section>

                    {/*//! Section Title */}
                    <div className="flex items-center justify-between">

                        <h2 className="lg:text-2.5xl text-1.5xl font-semibold">غذاهای غیر ایرانی</h2>

                    </div>


                    {/*//! START Menu List */}
                    <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">


                        <MenuCard />


                    </article>
                    {/*//? END Menu List */}


                </section>
                {/*//? END non persian Food Section */}


                {/*//! START Pizza Food Section */}
                <section>

                    {/*//! Section Title */}
                    <div className="flex items-center justify-between">

                        <h2 className="lg:text-2.5xl text-1.5xl font-semibold">پیتزاها</h2>

                    </div>


                    {/*//! START Menu List */}
                    <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">


                        <MenuCard />


                    </article>
                    {/*//? END Menu List */}


                </section>
                {/*//? END Pizza Food Section */}


                {/*//! START Sandwich Food Section */}
                <section>

                    {/*//! Section Title */}
                    <div className="flex items-center justify-between">

                        <h2 className="lg:text-2.5xl text-1.5xl font-semibold">ساندویچ ها</h2>

                    </div>


                    {/*//! START Menu List */}
                    <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 mt-10">


                        <MenuCard />


                    </article>
                    {/*//? END Menu List */}


                </section>
                {/*//? END Sandwich Food Section */}


            </main>


        </>
    );
}

export default MenuPage;