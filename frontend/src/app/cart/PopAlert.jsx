import Overlay from "@/components/modal/Overlay";
import { useEffect, useState } from "react";

const PopAlert = ({ children, isOpen, setIsOpen }) => {
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
                onClick={() => setIsOpen(false)}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                >

                    {children}

                </div>
            </div>
        </Overlay>
    );
}

export default PopAlert;