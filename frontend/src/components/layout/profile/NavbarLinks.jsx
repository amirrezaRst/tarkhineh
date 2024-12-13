"use client";

import { ChevronIcon } from "@/assets/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";


const NavbarLinks = () => {
    const pathname = usePathname();

    const handleActive = (path) => {
        if (pathname === path) return "px-2 py-1 text-[#417F56] border-b-2 border-b-[#499b64]"
        return "px-2 py-1"
    }

    return (
        <nav className="lg:block hidden">
            <ul className="flex items-center xl:text-base text-super-sm xl:gap-3 gap-1.5 text-[#717171]">
                <Link href="/">
                    <li className={handleActive("/")}>صفحه اصلی</li>
                </Link>
                <Link href="/branches">
                    <li className={handleActive("/branches")}>شعبه ها <ChevronIcon className="inline" /></li>
                </Link>
                <Link href="/menu">
                    <li className={handleActive("/menu")}>منو <ChevronIcon className="inline" /></li>
                </Link>
                <Link href="/franchise">
                    <li className={handleActive("/franchise")}>اعطای نمایندگی</li>
                </Link>
                <Link href="/about-us">
                    <li className={handleActive("/about-us")}>درباره ما</li>
                </Link>
                <Link href="/contact-us">
                    <li className={handleActive("/contact-us")}>تماس با ما</li>
                </Link>
            </ul>
        </nav>
    );
}

export default NavbarLinks;