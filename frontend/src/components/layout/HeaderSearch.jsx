"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, XmarkIcon } from "@/assets/Icons";

// The desktop navbar search icon expands into an input in place, submits to
// the branch-scoped menu search (/menus?q=...). No branch context lives in
// the navbar, so a query here just lands on the branch-picker/menu flow.
const HeaderSearch = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const router = useRouter();
    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    const submit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        router.push(`/menus?q=${encodeURIComponent(value.trim())}`);
        setOpen(false);
        setValue("");
    };

    return (
        <div ref={wrapRef} className="relative lg:block hidden">
            {open ?
                <form onSubmit={submit} className="flex items-center bg-primary-subtle rounded-md overflow-hidden h-[36px]">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="جستجو در منو..."
                        className="bg-transparent px-3 h-full w-48 text-super-sm focus:outline-none"
                    />
                    <button type="button" onClick={() => setOpen(false)} className="p-2" aria-label="بستن جستجو">
                        <XmarkIcon className="w-4 h-4 fill-primary" />
                    </button>
                </form> :
                <button onClick={() => setOpen(true)} className="bg-primary-subtle rounded-md p-2" aria-label="جستجو">
                    <SearchIcon className="fill-primary max-xl:w-5 max-xl:h-5" />
                </button>
            }
        </div>
    );
};

export default HeaderSearch;
