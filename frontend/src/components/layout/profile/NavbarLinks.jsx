"use client";

import { ChevronIcon } from "@/assets/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DropdownMenu from "../DropdownMenu";


const NavbarLinks = () => {
    const pathname = usePathname();
    const [isDropOpen, setIsDropOpen] = useState(false);

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

                {/* <div className="relative">
                    <li className={handleActive("/branches")}>
                        <Link href="/branches">شعبه ها</Link>
                        <span className="cursor-pointer p-1 bg-red-400/20" onClick={() => setIsDropOpen(!isDropOpen)}><ChevronIcon className="inline" /></span>
                    </li>
                    //! Dropdown
                    <div
                        className="bg-white w-[150px] absolute mt-2 rounded-md left-[50%] translate-x-[-50%] border border-[#ededed]/40 shadow-2xl py-2 px-3"
                    >
                        <ul className="flex flex-col items-center text-[#353535] xl:text-base text-super-sm">
                            <Link
                                href={{ pathname: "/branches", query: { branch: "tehranpars" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>تهرانپارس</li>
                            </Link>
                            <Link
                                href={{ pathname: "/branches", query: { branch: "chalous" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>چالوس</li>
                            </Link>
                            <Link
                                href={{ pathname: "/branches", query: { branch: "aghdasiyeh" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>اقدسیه</li>
                            </Link>
                            <Link
                                href={{ pathname: "/branches", query: { branch: "vanak" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>ونک</li>
                            </Link>
                        </ul>
                    </div>
                </div> */}

                {/* <div className="relative">
                    <li className={handleActive("/branches")}>
                        <Link href="/branches">شعبه ها</Link>
                        <span
                            className="cursor-pointer p-1 bg-red-400/20"
                            onClick={() => setIsDropOpen(!isDropOpen)}
                        >
                            <ChevronIcon className={`inline ${isDropOpen?"rotate-180":"rotate-0"} duration-300`} />
                        </span>
                    </li>
                    Dropdown
                    <div
                        className={`bg-white w-[150px] absolute mt-2 rounded-md left-[50%] translate-x-[-50%] border border-[#ededed]/40 shadow-2xl py-2 px-3 transition-all duration-300 ease-in-out 
            ${isDropOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-[-10px]"}`}
                    >
                        <ul className="flex flex-col items-center text-[#353535] xl:text-base text-super-sm">
                            <Link
                                href={{ pathname: "/branches", query: { branch: "tehranpars" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>تهرانپارس</li>
                            </Link>
                            <Link
                                href={{ pathname: "/branches", query: { branch: "chalous" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>چالوس</li>
                            </Link>
                            <Link
                                href={{ pathname: "/branches", query: { branch: "aghdasiyeh" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>اقدسیه</li>
                            </Link>
                            <Link
                                href={{ pathname: "/branches", query: { branch: "vanak" } }}
                                className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                            >
                                <li>ونک</li>
                            </Link>
                        </ul>
                    </div>
                </div> */}

                <DropdownMenu handleActive={handleActive} text="شعبه ها" path="/branches">
                    <ul className="flex flex-col items-center text-[#353535] xl:text-base text-super-sm">
                        <Link
                            href={{ pathname: "/branches", query: { branch: "tehranpars" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>تهرانپارس</li>
                        </Link>
                        <Link
                            href={{ pathname: "/branches", query: { branch: "chalous" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>چالوس</li>
                        </Link>
                        <Link
                            href={{ pathname: "/branches", query: { branch: "aghdasiyeh" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>اقدسیه</li>
                        </Link>
                        <Link
                            href={{ pathname: "/branches", query: { branch: "vanak" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>ونک</li>
                        </Link>
                    </ul>
                </DropdownMenu>

                <DropdownMenu handleActive={handleActive} text="منو ها" path="/menus">
                    <ul className="flex flex-col items-center text-[#353535] xl:text-base text-super-sm">
                        <Link
                            href={{ pathname: "/menus", query: { category: "main" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>غذای اصلی</li>
                        </Link>
                        <Link
                            href={{ pathname: "/menus", query: { category: "side" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>پیش غذا</li>
                        </Link>
                        <Link
                            href={{ pathname: "/menus", query: { category: "dessert" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>دسر</li>
                        </Link>
                        <Link
                            href={{ pathname: "/menus", query: { category: "drink" } }}
                            className="w-full border-b border-b-[#ededed] last:border-b-0 py-2.5"
                        >
                            <li>نوشیدنی</li>
                        </Link>
                    </ul>
                </DropdownMenu>



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
        </nav >
    );
}

export default NavbarLinks;