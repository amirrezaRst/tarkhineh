import { HomeIcon, MenuBoardIcon, ReceiptIcon, SearchIcon, SolidHomeIcon, SolidReceiptIcon, SolidUserIcon, UserIcon } from "@/assets/Icons";
import BottomNavbarItem from "./BottomNavbarItem";


const links = [
    {
        oIcon: <HomeIcon className="w-[26px] h-[26px] fill-[#717171]" />,
        sIcon: <SolidHomeIcon className="w-[26px] h-[26px] fill-[#417F56]" />,
        path: "/",
        text: "خانه"
    },
    {
        oIcon: <SearchIcon className="w-[26px] h-[26px] fill-[#717171]" />,
        sIcon: <SearchIcon className="w-[26px] h-[26px] fill-[#417F56]" />,
        text: "جست و جو"
    },
    {
        oIcon: <MenuBoardIcon className="w-[26px] h-[26px] fill-[#717171]" />,
        sIcon: <MenuBoardIcon className="w-[26px] h-[26px] fill-[#417F56]" />,
        path: "/menu",
        text: "منو"
    },
    {
        oIcon: <ReceiptIcon className="w-[26px] h-[26px] fill-[#717171]" />,
        sIcon: <SolidReceiptIcon className="w-[26px] h-[26px] fill-[#417F56]" />,
        path: "/profile/orders",
        text: "سفارشات"
    },
    {
        oIcon: <UserIcon className="w-[26px] h-[26px] fill-[#717171]" />,
        sIcon: <SolidUserIcon className="w-[26px] h-[26px] fill-[#417F56]" />,
        path: "/profile",
        text: "پروفایل"
    },
]


const BottomNavbar = () => {
    return (
        <nav
            className="w-full bg-white lg:hidden block z-10 fixed bottom-0 right-0 px-5 py-3.5 border-t border-t-[#E5F2E9]"
        >

            <ul className="flex items-center justify-between gap-1">

                {links.map(({ sIcon, oIcon, path, text }, index) =>
                    <BottomNavbarItem key={index} sIcon={sIcon} oIcon={oIcon} path={path} text={text} />
                )}

            </ul>

        </nav>
    );
}

export default BottomNavbar;