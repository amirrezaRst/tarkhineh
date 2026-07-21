"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavbarItem = ({ sIcon, oIcon, path, text }) => {
    const pathname = usePathname();

    return (
        <Link href={path || ""}>
            <li className="flex flex-col items-center gap-1.5">
                {path === pathname ?
                    sIcon :
                    oIcon
                }
                <span className={`flex-1 text-sm ${path === pathname ? "text-primary font-medium" : "text-muted-fg font-normal"}`}>
                    {text}
                </span>
            </li>
        </Link>
    );
}

export default BottomNavbarItem;