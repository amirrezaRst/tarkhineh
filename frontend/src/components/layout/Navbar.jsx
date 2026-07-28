"use client";

import Link from "next/link";

import { MenuIcon, ShoppingCartIcon, UserIcon } from "@/assets/Icons";
import NavbarLinks from "./profile/NavbarLinks";
import useUserStore from "@/stores/useUserStore";
import ModalContainer from "../modal/ModalContainer";
import { useEffect, useState } from "react";
import RegisterModal from "../register/RegisterModal";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import useCartStore from "@/stores/useCartStore";
import HeaderSearch from "./HeaderSearch";

const Navbar = () => {
    const fetchUser = useUserStore((state) => state.fetchUser);
    const fetchCart = useCartStore(state => state.fetchCart);

    const user = useUserStore((state) => state.user);
    const cart = useCartStore(state => state.cart);
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


    return (
        <header className="sticky top-0 bg-white z-10 lg:border-b border-b-primary-subtle lg:shadow-none shadow">
            <div className="container flex items-center justify-between md:py-3.5 py-4.5">

                <button className="lg:hidden block">
                    <MenuIcon className="fill-primary w-7 h-7" />
                </button>

                <Link href="/">
                    <img src="/images/logo.png" alt="تریخینه لوگو" className="xl:w-[160px] md:w-[140px] w-32" />
                </Link>

                <NavbarLinks />

                <div className="flex gap-3 max-lg:justify-end max-lg:float-left">
                    <HeaderSearch />
                    <div onClick={!user ? () => setIsModalOpen(true) : null}>
                        <PreserveQueryLink href={user ? "/cart" : ""}>
                            <button className="relative bg-primary-subtle rounded-md p-2">
                                <ShoppingCartIcon className="fill-primary max-xl:w-5 max-xl:h-5" />
                                <span
                                    className={`w-5 h-5 rounded-full bg-primary absolute -top-1.5 -right-1.5 text-white text-super-xs ${!cart || cart?.length === 0 ? "opacity-0" : "opacity-100"}`}
                                >
                                    {cart?.length}
                                </span>
                            </button>
                        </PreserveQueryLink>
                    </div>
                    <div onClick={!user ? () => setIsModalOpen(true) : null}>
                        <PreserveQueryLink href={user ? "/profile" : ""} onClick={!user ? () => setIsModalOpen(true) : null}>
                            <button className="bg-primary-subtle rounded-md p-2">
                                <UserIcon className="fill-primary max-xl:w-5 max-xl:h-5" />
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