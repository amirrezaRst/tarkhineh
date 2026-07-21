"use client";

import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import { usePathname } from "next/navigation";


const TopNavigation = () => {

    const pathname = usePathname()

    const handleClass = (path) => {
        if (path === pathname) return "md:px-4 px-1 text-center py-5 font-medium text-primary border-b border-b-primary"
        return "md:px-4 px-1 text-center py-5"
    }

    return (
        <div className="bg-surface-sunken w-full">
            <div className="container">
                <div className="relative inline-block md:w-auto w-full">
                    <ul
                        className="flex items-center xl:text-super-base md:text-base text-super-sm text-muted-fg md:w-auto w-full"
                    >
                        <PreserveQueryLink href="/faq" className="md:w-auto w-full">
                            <li className={handleClass("/faq")}>سوالات متداول</li>
                        </PreserveQueryLink>
                        <PreserveQueryLink href="/rules" className="md:w-auto w-full">
                            <li className={handleClass("/rules")}>قوانین ترخینه</li>
                        </PreserveQueryLink>
                        <PreserveQueryLink href="/privacy" className="md:w-auto w-full">
                            <li className={handleClass("/privacy")}>حریم خصوصی</li>
                        </PreserveQueryLink>
                    </ul>

                </div>
            </div>
        </div>
    );
}

export default TopNavigation;