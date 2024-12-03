"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ oIcon, sIcon, text, path }) => {
    const pathname = usePathname();

    return (
        <Link href={path ? path : ""}>
            <li
                className={`flex items-center h-full  ${path === pathname ? "text-[#417F56] font-normal" : "text-[#353535] font-light"}
        ${!path && "text-[#C30000] hover:bg-[#C30000]/5"} hover:bg-[#417F56]/5 text-super-base tracking-wide  rounded-lg`}
            >
                <div className={`w-[2.5px] h-11 bg-[#417F56] rounded-l-full ml-3.5 ${path === pathname ? "opacity-100" : "opacity-0"}`} />

                {path === pathname ?
                    sIcon
                    :
                    oIcon
                }
                <span className="mr-2.5">{text}</span>
            </li>
        </Link>
    );
}

export default NavItem;