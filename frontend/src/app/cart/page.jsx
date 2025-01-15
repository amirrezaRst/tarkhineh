import { PersonalWalletIcon, ShoppingCartIcon, SquareCheckmarkIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const CartPage = () => {
    return (
        <div className="py-20 space-y-12">

            {/*//! START Purchase Progress */}
            <section
                className="px-20"
            >
                <div className="container flex items-center justify-between gap-4">


                    <div className="flex items-center gap-1.5">
                        <ShoppingCartIcon className="fill-[#417F56] w-7 h-7" />
                        <p className="text-super-base font-medium text-[#417F56]">
                            سبد خرید
                        </p>
                    </div>
                    <div className="flex-1 border border-dashed border-[#CBCBCB]/80" />

                    <div className="flex items-center gap-1.5">
                        <SquareCheckmarkIcon className="fill-[#CBCBCB] w-7 h-7" />
                        <p className="text-super-base text-[#CBCBCB]">
                            تکمیل اطلاعات
                        </p>
                    </div>
                    <div className="flex-1 border border-dashed border-[#CBCBCB]/80" />

                    <div className="flex items-center gap-1.5">
                        <PersonalWalletIcon className="fill-[#CBCBCB] w-7 h-7" />
                        <p className="text-super-base text-[#CBCBCB]">
                            پرداخت
                        </p>
                    </div>


                </div>
            </section>
            {/*//? END Purchase Progress */}


            <main className="container">
                {/*//! Empty Cart */}
                <div className="relative min-h-96 border border-[#CBCBCB] rounded-lg overflow-hidden flex flex-col items-center justify-center">


                    <img src="/images/spider-background.png" alt="" className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] opacity-35" />

                    <div className="flex flex-col items-center gap-7 z-10">
                        <p className="text-1.5xl text-[#757575]">
                            شما در حال حاظر هیچ سفارشی ثبت نکرده اید!
                        </p>
                        <PreserveQueryLink
                            href="/menus"
                            className="border border-[#417F56] rounded-md text-[#417F56] text-lg px-12 py-2"
                        >
                            <button>
                                منوی رستوران
                            </button>
                        </PreserveQueryLink>
                    </div>

                </div>
            </main>


        </div>
    );
}

export default CartPage;