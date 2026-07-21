import { useEffect, useState } from "react";
import Link from "next/link";

import { ChevronIcon } from "@/assets/Icons";
import { useSearchParams } from "next/navigation";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";


const DropdownMenu = ({ children, handleActive, text, pathname, path }) => {
    const [isDropOpen, setIsDropOpen] = useState(false);
    const [branchName, setBranchName] = useState(null);

    const branch = useSearchParams().get("branch");

    useEffect(() => {
        if (branch) {
            if (branch == "aghdasiyeh") setBranchName("اقدسیه");
            else if (branch == "tehranpars") setBranchName("تهرانپارس");
            else if (branch == "vanak") setBranchName("ونک");
            else if (branch == "chalous") setBranchName("چالوس");
        }
    }, [branch]);


    return (
        <div className="relative">
            <li className={handleActive(path)} onClick={() => isDropOpen && setIsDropOpen(false)}>
                {path == "/branches" ? branch ?
                    <span className="cursor-pointer" onClick={() => setIsDropOpen(!isDropOpen)}>شعبه {branchName}</span> :
                    <Link href={path}>{text}</Link> :
                    <PreserveQueryLink href={path}>{text}</PreserveQueryLink>
                }
                <span
                    className="cursor-pointer p-1"
                    onClick={() => setIsDropOpen(!isDropOpen)}
                >
                    <ChevronIcon className={`inline ${pathname === path ? "fill-primary" : "fill-muted-fg"} ${isDropOpen ? "rotate-180" : "rotate-0"} duration-300`} />
                </span>
            </li>

            {/*//! Dropdown */}
            <div
                className={`bg-white w-[150px] absolute mt-2 rounded-md left-[50%] translate-x-[-50%] border border-border-subtle/40 shadow-2xl py-2 px-3 transition-all duration-300 ease-in-out 
            ${isDropOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-[-10px]"}`}
                onClick={() => setIsDropOpen(false)}
            >
                {/*//! Dropdown Content */}
                {children}
            </div>
        </div>
    );
}

export default DropdownMenu;