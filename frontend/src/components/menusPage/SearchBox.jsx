"use client";

import { SearchIcon, XmarkIcon } from "@/assets/Icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBox = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("q") || "");

    useEffect(() => {
        setValue(searchParams.get("q") || "");
    }, [searchParams]);

    useEffect(() => {
        const t = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value.trim().length >= 2) params.set("q", value.trim());
            else params.delete("q");
            const next = params.toString();
            if (next !== searchParams.toString()) router.replace(`${pathname}?${next}`);
        }, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="relative xl:w-[450px] lg:w-[350px] md:w-[45%] w-full h-11 rounded-lg border border-border overflow-hidden"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="جستجو در منو..."
                className="w-full h-full bg-transparent px-4 text-foreground placeholder:text-foreground focus:ring-0 focus:outline-none"
            />
            {value ?
                <button type="button" onClick={() => setValue("")} className="w-11 h-11 absolute top-0 left-0 flex items-center justify-center">
                    <XmarkIcon className="w-4 h-4 fill-foreground" />
                </button> :
                <button type="submit" className="w-11 h-11 absolute top-0 left-0 flex items-center justify-center">
                    <SearchIcon className="fill-foreground" />
                </button>
            }
        </form>
    );
}

export default SearchBox;
