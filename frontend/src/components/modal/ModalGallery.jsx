"use client";

import { useState } from "react";
import Image from "next/image";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

// Menu-item gallery: one large image with the thumbnail strip *below* it, so
// the food is never covered (the shared <Gallery/> overlays its thumbnails,
// which is fine for the branch photo modal but hides the dish here).
const ModalGallery = ({ name, images = [], badge }) => {
    const [selected, setSelected] = useState(0);
    const list = images.length ? images : [null];

    return (
        <div className="bg-surface-sunken md:p-3.5 p-3 flex flex-col gap-2.5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted/40">
                <Image
                    src={`${IMAGE_URL}/${list[selected]}`}
                    alt={`ترخینه ${name}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 500px"
                    className="object-cover object-center"
                />
                {badge &&
                    <span className={`absolute top-3 right-3 text-super-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm text-white ${badge.tone === "danger" ? "bg-destructive" : "bg-primary"}`}>
                        {badge.text}
                    </span>
                }
            </div>

            {list.length > 1 &&
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {list.map((img, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`تصویر ${i + 1}`}
                            aria-current={i === selected}
                            onClick={() => setSelected(i)}
                            className={`relative shrink-0 w-[62px] h-[52px] rounded-xl overflow-hidden border-2 duration-200
                                ${i === selected ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-90"}`}
                        >
                            <Image src={`${IMAGE_URL}/${img}`} alt="" fill sizes="62px" className="object-cover object-center" />
                        </button>
                    ))}
                </div>
            }
        </div>
    );
};

export default ModalGallery;
