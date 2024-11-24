import Link from "next/link";

import { ChevronIcon, MenuIcon, SearchIcon, ShoppingCardIcon, UserIcon } from "@/assets/Icons";


const Navbar = () => {
    return (
        <header className="sticky top-0 bg-white z-10">
            <div className="w-full h-[4px] 3xl:bg-amber-400 2xl:bg-slate-600 xl:bg-stone-600 lg:bg-red-500 md:bg-yellow-400 sm:bg-violet-600 bg-teal-400" />
            <div className="container lg:flex items-center justify-between grid grid-cols-3 md:py-3.5 py-4.5">

                <button className="lg:hidden block">
                    <MenuIcon className="w-7 h-7" />
                </button>

                <Link href="/" className="max-lg:mx-auto">
                    <img src="/images/logo.png" alt="تریخینه لوگو" className="xl:w-[160px] md:w-[140px] w-32" />
                </Link>

                <nav className="lg:block hidden">
                    <ul className="flex items-center xl:text-base text-super-sm xl:gap-3 gap-1.5 text-[#717171]">
                        <li className="px-2 py-1 text-[#417F56] border-b border-b-[#417F56]">صفحه اصلی</li>
                        <li className="px-2 py-1">شعبه ها <ChevronIcon className="inline" /></li>
                        <li className="px-2 py-1">منو <ChevronIcon className="inline" /></li>
                        <li className="px-2 py-1">اعطای نمایندگی</li>
                        <li className="px-2 py-1">درباره ما</li>
                        <li className="px-2 py-1">تماس با ما</li>
                    </ul>
                </nav>

                <div className="flex gap-3 max-lg:justify-end max-lg:float-left">
                    <button className="bg-[#E5F2E9] rounded-md p-2 md:block hidden">
                        <SearchIcon className="max-xl:w-5 max-xl:h-5" />
                    </button>
                    <button className="bg-[#E5F2E9] rounded-md p-2">
                        <ShoppingCardIcon className="max-xl:w-5 max-xl:h-5" />
                    </button>
                    <button className="bg-[#E5F2E9] rounded-md p-2">
                        <UserIcon className="max-xl:w-5 max-xl:h-5" />
                    </button>
                </div>

            </div>
        </header>
    );
}

export default Navbar;