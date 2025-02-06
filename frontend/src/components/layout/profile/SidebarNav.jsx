"use client";

import { HeartIcon, LocationIcon, LogoutIcon, PersonalWalletIcon, SolidHeartIcon, SolidLocationIcon, SolidPersonalWalletIcon, SolidUserIcon, UserIcon } from "@/assets/Icons";
import NavItem from "./NavItem";
import Popup from "@/components/Popup";
import { useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/services/UserService";
import useCartStore from "@/stores/useCartStore";

const links = [
    {
        outlineIcon: <UserIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#353535]" />,
        solidIcon: <SolidUserIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#417F56]" />,
        text: "پروفایل",
        path: "/profile"
    },
    {
        outlineIcon: <PersonalWalletIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#353535]" />,
        solidIcon: <SolidPersonalWalletIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#417F56]" />,
        text: "پیگیری سفارشات",
        path: "/profile/orders"
    },
    {
        outlineIcon: <HeartIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 stroke-[#353535]" />,
        solidIcon: <SolidHeartIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#417F56]" />,
        text: "علاقمندی‌ها",
        path: "/profile/interests"
    },
    {
        outlineIcon: <LocationIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#353535]" />,
        solidIcon: <SolidLocationIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7 fill-[#417F56]" />,
        text: "آدرس های من",
        path: "/profile/address"
    },
    {
        outlineIcon: <LogoutIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7" />,
        solidIcon: <LogoutIcon className="lg:w-6 lg:h-6 md:w-[1.84rem] md:h-[1.84rem] w-7 h-7" />,
        text: "خروج",
    },
];


const SidebarNav = () => {
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const clearUser = useUserStore(state => state.clearUser);
    const clearCart = useCartStore(state => state.clearCart);
    const router = useRouter();



    return (
        <nav className="lg:pt-7 md:pt-9 lg:pb-4 md:pb-14 py-5">
            <ul className="flex md:flex-col flex-row md:justify-start justify-center lg:gap-2 gap-11">

                {links.map((item, index) =>
                    <NavItem key={index} oIcon={item.outlineIcon} sIcon={item.solidIcon} path={item.path} text={item.text} handler={() => setIsOpenPopup(true)} />
                )}

            </ul>

            <Popup isOpen={isOpenPopup} setIsOpen={setIsOpenPopup}>

                {/*//! Content */}
                <div className="min-h-36 flex flex-col justify-center gap-6 px-6">
                    <p className="text-super-base text-[#353535] text-center">
                        آیا مطمئن هستید که می‌خواهید خارج شوید؟
                    </p>

                    <div className="flex gap-3">
                        <button
                            className="rounded-md border border-[#417F56] text-[#417F56] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                            onClick={() => setIsOpenPopup(false)}
                        >
                            انصراف
                        </button>
                        <button
                            className="bg-[#FFF2F2] rounded-md border border-transparent text-[#C30000] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                            onClick={() => handleLogout(clearUser, clearCart, setIsOpenPopup, router)}
                        >
                            خروج از حساب
                        </button>
                    </div>
                </div>
            </Popup>

        </nav>
    );
}

export default SidebarNav;