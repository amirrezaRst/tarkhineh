"use client";

import { useEffect } from "react";

// Lightweight centered modal: dim backdrop, click-outside + Esc to close, body
// scroll lock. Panel width via `size`. Content scrolls if it overflows.
const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" };

const Modal = ({ open, onClose, children, size = "md" }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-900/45 backdrop-blur-[2px]"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
            dir="rtl"
        >
            <div className={`w-full ${sizes[size]} my-6 bg-surface rounded-2xl shadow-soft-lg stagger-in`}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
