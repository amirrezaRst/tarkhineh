"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DropdownMenu from "../DropdownMenu";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import useBranches from "@/hooks/useBranches";


const NavbarLinks = () => {
    const pathname = usePathname();
    const branches = useBranches();

    const handleActive = (path) => {
        if (pathname === path) return "px-2 py-1 text-primary border-b-2 border-b-accent"
        return "px-2 py-1"
    }

    return (
        <nav className="lg:block hidden">
            <ul className="flex items-center xl:text-base text-super-sm xl:gap-3 gap-1.5 text-muted-fg">
                <PreserveQueryLink href="/">
                    <li className={handleActive("/")}>صفحه اصلی</li>
                </PreserveQueryLink>

                <DropdownMenu handleActive={handleActive} text="شعبه ها" pathname={pathname} path="/branches">
                    <ul className="flex flex-col items-center text-foreground xl:text-base text-super-sm">
                        {(branches || []).map((b) => (
                            <Link
                                key={b.id}
                                href={{ pathname: "/branches", query: { branch: b.id } }}
                                className="w-full border-b border-b-border-subtle last:border-b-0 py-2.5"
                            >
                                <li>{b.name}</li>
                            </Link>
                        ))}
                    </ul>
                </DropdownMenu>

                <DropdownMenu handleActive={handleActive} text="منو ها" pathname={pathname} path="/menus">
                    <ul className="flex flex-col items-center text-foreground xl:text-base text-super-sm">
                        <PreserveQueryLink
                            href="/menus"
                            query={{ category: "main" }}
                            className="w-full border-b border-b-border-subtle last:border-b-0 py-2.5"
                        >
                            <li>غذای اصلی</li>
                        </PreserveQueryLink>
                        <PreserveQueryLink
                            // href={{ pathname: "/menus", query: { category: "side" } }}
                            href="/menus"
                            query={{ category: "side" }}
                            className="w-full border-b border-b-border-subtle last:border-b-0 py-2.5"
                        >
                            <li>پیش غذا</li>
                        </PreserveQueryLink>
                        <PreserveQueryLink
                            // href={{ pathname: "/menus", query: { category: "dessert" } }}
                            href="/menus"
                            query={{ category: "dessert" }}
                            className="w-full border-b border-b-border-subtle last:border-b-0 py-2.5"
                        >
                            <li>دسر</li>
                        </PreserveQueryLink>
                        <PreserveQueryLink
                            // href={{ pathname: "/menus", query: { category: "drink" } }}
                            href="/menus"
                            query={{ category: "drink" }}
                            className="w-full border-b border-b-border-subtle last:border-b-0 py-2.5"
                        >
                            <li>نوشیدنی</li>
                        </PreserveQueryLink>
                    </ul>
                </DropdownMenu>



                <PreserveQueryLink href="/franchise">
                    <li className={handleActive("/franchise")}>اعطای نمایندگی</li>
                </PreserveQueryLink>
                <PreserveQueryLink href="/about-us">
                    <li className={handleActive("/about-us")}>درباره ما</li>
                </PreserveQueryLink>
                <PreserveQueryLink href="/contact-us">
                    <li className={handleActive("/contact-us")}>تماس با ما</li>
                </PreserveQueryLink>
            </ul>
        </nav >
    );
}

export default NavbarLinks;