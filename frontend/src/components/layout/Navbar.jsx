"use client";

import Link from "next/link";

import { MenuIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "@/assets/Icons";
import NavbarLinks from "./profile/NavbarLinks";
import useUserStore from "@/stores/useUserStore";
import ModalContainer from "../modal/ModalContainer";
import { useEffect, useState } from "react";
import RegisterModal from "../register/RegisterModal";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const Navbar = () => {
    const fetchUser = useUserStore((state) => state.fetchUser);
    const fetchCart = useUserStore(state => state.fetchCart);

    const user = useUserStore((state) => state.user);
    const cart = useUserStore(state => state.cart);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
        if (!cart) {
            fetchCart();
        }
        fetchUser();
        fetchCart();
    }, []);

    useEffect(() => {
        console.log(cart);
    }, [cart])

    return (
        <header className="sticky top-0 bg-white z-10 lg:border-b border-b-[#E5F2E9] lg:shadow-none shadow">
            <div className="w-full h-[4px] 3xl:bg-amber-400 2xl:bg-slate-600 xl:bg-stone-600 lg:bg-red-500 md:bg-yellow-400 sm:bg-violet-600 bg-teal-400" />
            <div className="container flex items-center justify-between md:py-3.5 py-4.5">

                <button>
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
                    <div onClick={!user ? () => setIsModalOpen(true) : null}>
                        <PreserveQueryLink href={user ? "/cart" : ""}>
                            <button className="relative bg-[#E5F2E9] rounded-md p-2">
                                <ShoppingCartIcon className="fill-[#417F56] max-xl:w-5 max-xl:h-5" />
                                <span
                                    className={`w-5 h-5 rounded-full bg-[#417F56] absolute -top-1.5 -right-1.5 text-white text-super-xs ${!cart || cart?.length === 0 ? "opacity-0" : "opacity-100"}`}
                                >
                                    {cart?.length}
                                </span>
                            </button>
                        </PreserveQueryLink>
                    </div>
                    <div onClick={!user ? () => setIsModalOpen(true) : null}>
                        <PreserveQueryLink href={user ? "/profile" : ""} onClick={!user ? () => setIsModalOpen(true) : null}>
                            <button className="bg-[#E5F2E9] rounded-md p-2">
                                <UserIcon className="fill-[#417F56] max-xl:w-5 max-xl:h-5" />
                            </button>
                        </PreserveQueryLink>
                    </div>
                </div>

            </div>

            <ModalContainer isOpen={isModalOpen} setIsOpen={setIsModalOpen}>

                <RegisterModal setIsOpen={setIsModalOpen} />

            </ModalContainer>

        </header>
    );
}

export default Navbar;