"use client";

import { HeartIcon, LocationIcon, LogoutIcon, PersonalWalletIcon, SolidHeartIcon, SolidLocationIcon, SolidPersonalWalletIcon, SolidUserIcon, UserIcon } from "@/assets/Icons";
import NavItem from "./NavItem";

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
    return (
        <nav className="lg:pt-7 md:pt-9 lg:pb-4 md:pb-14 py-5">
            <ul className="flex md:flex-col flex-row md:justify-start justify-center lg:gap-2 gap-11">

                {links.map((item, index) =>
                    <NavItem key={index} oIcon={item.outlineIcon} sIcon={item.solidIcon} path={item.path} text={item.text} />
                )}

            </ul>
        </nav>
    );
}

export default SidebarNav;