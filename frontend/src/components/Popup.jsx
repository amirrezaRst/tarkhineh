"use client";

import { useEffect, useState } from "react";
import Overlay from "./modal/Overlay";
import { XmarkIcon } from "@/assets/Icons";

const Popup = ({ children, isOpen, setIsOpen, title }) => {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '17.5px';
            setShow(true);
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
            setTimeout(() => setShow(false), 300);
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <Overlay show={show} setIsOpen={setIsOpen}>
            <div
                className="w-full h-full flex items-center justify-center"
                onClick={()=>setIsOpen(false)}
            >
                <div
                    className="bg-white md:w-[450px] w-[90%] rounded-lg py-5 px-7"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/*//! Title */}
                    <div className="relative w-full mb-4">
                        <h6 className="text-center text-foreground font-medium md:text-xl text-lg">{title ? title : "حذف آدرس"}</h6>
                        <button className="absolute left-0 -top-1 p-1" onClick={() => setIsOpen(false)}>
                            <XmarkIcon className="fill-muted-fg w-7 h-7" />
                        </button>
                    </div>

                    {/*//! Content */}
                    {children}

                </div>
            </div>
        </Overlay>
    );
}

export default Popup;