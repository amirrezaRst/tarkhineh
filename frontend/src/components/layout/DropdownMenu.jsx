import { useState } from "react";
import Link from "next/link";

import { ChevronIcon } from "@/assets/Icons";


const DropdownMenu = ({ children, handleActive, text, path }) => {
    const [isDropOpen, setIsDropOpen] = useState(false);

    return (
        <div className="relative">
            <li className={handleActive(path)} onClick={() => isDropOpen && setIsDropOpen(false)}>
                <Link href={path}>{text}</Link>
                <span
                    className="cursor-pointer p-1"
                    onClick={() => setIsDropOpen(!isDropOpen)}
                >
                    <ChevronIcon className={`inline ${isDropOpen ? "rotate-180" : "rotate-0"} duration-300`} />
                </span>
            </li>

            {/*//! Dropdown */}
            <div
                className={`bg-white w-[150px] absolute mt-2 rounded-md left-[50%] translate-x-[-50%] border border-[#ededed]/40 shadow-2xl py-2 px-3 transition-all duration-300 ease-in-out 
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