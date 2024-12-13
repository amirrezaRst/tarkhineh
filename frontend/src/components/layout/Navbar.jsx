import Link from "next/link";

import { MenuIcon, SearchIcon, ShoppingCardIcon, UserIcon } from "@/assets/Icons";
import NavbarLinks from "./profile/NavbarLinks";


const Navbar = () => {
    return (
        <header className="sticky top-0 lg:bg-white bg-[#417F56] z-10 lg:border-b border-b-[#E5F2E9]">
            <div className="w-full h-[4px] 3xl:bg-amber-400 2xl:bg-slate-600 xl:bg-stone-600 lg:bg-red-500 md:bg-yellow-400 sm:bg-violet-600 bg-teal-400" />
            <div className="container flex items-center justify-between md:py-3.5 py-4.5">

                <button className="lg:hidden block">
                    <MenuIcon className="fill-[#417F56] w-7 h-7" />
                </button>

                <Link href="/">
                    <img src="/images/logo.png" alt="تریخینه لوگو" className="xl:w-[160px] md:w-[140px] w-32" />
                </Link>

                <NavbarLinks />

                <div className="flex gap-3 max-lg:justify-end max-lg:float-left">
                    <button className="bg-[#E5F2E9] rounded-md p-2 lg:block hidden">
                        <SearchIcon className="fill-[#417F56] max-xl:w-5 max-xl:h-5" />
                    </button>
                    <Link href="/cart">
                        <button className="bg-[#E5F2E9] rounded-md p-2">
                            <ShoppingCardIcon className="fill-[#417F56] max-xl:w-5 max-xl:h-5" />
                        </button>
                    </Link>
                    <Link href="/profile">
                        <button className="bg-[#E5F2E9] lg:block hidden rounded-md p-2">
                            <UserIcon className="fill-[#417F56] max-xl:w-5 max-xl:h-5" />
                        </button>
                    </Link>
                </div>

            </div>
        </header>
    );
}

export default Navbar;