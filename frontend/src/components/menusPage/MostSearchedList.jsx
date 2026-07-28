"use client";

import { ChevronIcon } from "@/assets/Icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const MostSearchedList = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const items = ["پاستا سبزیجات", "پیتزا سیر و استیک", "سالاد سزار"];

    const search = (term) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", term);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center flex-nowrap gap-3 flex-1 overflow-hidden">
            {items.map((item, index) => (
                <div
                    key={index}
                    onClick={() => search(item)}
                    className="bg-surface-sunken flex items-center flex-none gap-1.5 py-1 md:px-4 px-1.5 md:leading-7 leading-5 text-foreground md:text-base text-sm cursor-pointer rounded-full"
                >
                    <span>{item}</span>
                    <ChevronIcon className="fill-muted-fg inline rotate-90" />
                </div>
            ))}
        </div>
    );
}

export default MostSearchedList;
