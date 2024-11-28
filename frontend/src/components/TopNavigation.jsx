"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const TopNavigation = () => {

    const pathname = usePathname()

    const handleClass = (path) => {
        if (path === pathname) return "md:px-4 px-1 md:w-auto w-full text-center py-5 font-medium text-[#417F56] border-b border-b-[#417F56]"
        return "md:px-4 px-1 md:w-auto w-full text-center py-5"
    }

    return (
        <div className="bg-[#EDEDED] w-full">
            <div className="container">
                <div className="relative inline-block md:w-auto w-full">
                    <ul
                        className="flex items-center md:text-super-base text-[#717171] md:w-auto w-full"
                    >
                        <Link href="/faq">
                            <li className={handleClass("/faq")}>سوالات متداول</li>
                        </Link>
                        <Link href="/rules">
                            <li className={handleClass("/rules")}>قوانین ترخینه</li>
                        </Link>
                        <Link href="/privacy">
                            <li className={handleClass("/privacy")}>حریم خصوصی</li>
                        </Link>
                    </ul>

                </div>
            </div>
        </div>
    );
}

export default TopNavigation;