"use client";

import { HeartIcon, LocationIcon, LogoutIcon, PersonalWalletIcon, SolidLocationIcon, SolidPersonalWalletIcon, SolidUserIcon, UserIcon } from "@/assets/Icons";
import NavItem from "./NavItem";

const links = [
    {
        outlineIcon: <UserIcon className="w-6 h-6 fill-[#353535]" />,
        solidIcon: <SolidUserIcon className="w-6 h-6 fill-[#417F56]" />,
        text: "پروفایل",
        path: "/profile"
    },
    {
        outlineIcon: <PersonalWalletIcon className="w-6 h-6 fill-[#417F56]" />,
        solidIcon: <SolidPersonalWalletIcon className="w-6 h-6 fill-[#353535]" />,
        text: "پیگیری سفارشات",
        path: "/profile/orders"
    },
    {
        outlineIcon: <HeartIcon className="w-6 h-6 fill-[#417F56]" />,
        solidIcon: <HeartIcon className="w-6 h-6 fill-[#417F56]" />,
        text: "علاقمندی‌ها",
        path: "/profile/interests"
    },
    {
        outlineIcon: <LocationIcon className="w-6 h-6 fill-[#417F56]" />,
        solidIcon: <SolidLocationIcon className="w-6 h-6 fill-[#353535]" />,
        text: "آدرس های من",
        path: "/profile/address"
    },
    {
        outlineIcon: <LogoutIcon className="w-6 h-6" />,
        solidIcon: <LogoutIcon className="w-6 h-6" />,
        text: "خروج",
    },
];


const SidebarNav = () => {
    return (
        <nav className="pt-7 pb-4">
            <ul className="flex flex-col gap-2">

                {links.map((item, index) =>
                    <NavItem key={index} oIcon={item.outlineIcon} sIcon={item.solidIcon} path={item.path} text={item.text} />
                )}

            </ul>
        </nav>
    );
}

export default SidebarNav;