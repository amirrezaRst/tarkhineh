"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Overlay from "./Overlay";

const ModalContainer = ({ children, isOpen, setIsOpen, ariaLabel }) => {
    const [show, setShow] = useState(isOpen);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

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

    if (!mounted) return null;

    // Rendered through a portal on <body>: a `position: fixed` overlay is
    // positioned against the nearest ancestor that has a transform/filter
    // rather than the viewport, so any animated or transformed wrapper up the
    // tree would otherwise trap the modal inside itself.
    return createPortal(
        <Overlay show={show} setIsOpen={setIsOpen} ariaLabel={ariaLabel}>
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </Overlay>,
        document.body
    );
}

export default ModalContainer;
