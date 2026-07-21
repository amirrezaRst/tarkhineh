"use client";

import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import { usePathname } from "next/navigation";

const NavItem = ({ oIcon, sIcon, text, path, handler }) => {
    const pathname = usePathname();

    return (
        <PreserveQueryLink
            href={path || ""}
            onClick={path ? undefined : handler}
        >
            <li
                className={`h-full flex items-center lg:justify-start justify-center  ${path === pathname ? "text-primary font-normal" : "text-foreground font-light"}
        ${!path && "text-destructive hover:bg-destructive/5"} hover:bg-primary/5 text-super-base tracking-wide  rounded-lg`}
            >
                <div className={`w-[2.5px] h-11 bg-primary lg:block hidden rounded-l-full ml-3.5 ${path === pathname ? "opacity-100" : "opacity-0"}`} />

                {path === pathname ?
                    sIcon
                    :
                    oIcon
                }
                <span className="lg:block hidden mr-2.5">{text}</span>
            </li>
        </PreserveQueryLink>
    );
}

export default NavItem;