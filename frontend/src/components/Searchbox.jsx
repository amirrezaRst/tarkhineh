"use client";

import { SearchIcon } from "@/assets/Icons";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Searchbox = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [value, setValue] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        router.push(`/menus?q=${encodeURIComponent(value.trim())}`);
    };

    if (pathname === "/") return (
        <div className="container mt-6">
            <form
                onSubmit={submit}
                className="relative w-full h-11 md:hidden block rounded-lg border border-border overflow-hidden"
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="جستجو در منو..."
                    className="w-full h-full bg-transparent px-4 text-foreground placeholder:text-foreground focus:ring-0 focus:outline-none"
                />
                <button type="submit" className="w-11 h-11 absolute top-0 left-0 flex items-center justify-center" aria-label="جستجو">
                    <SearchIcon className="fill-foreground" />
                </button>
            </form>
        </div>
    );
    return (null)
}

export default Searchbox;
