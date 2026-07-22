"use client";

import { useState } from "react";
import FormatPrice from "@/utils/FormatPrice";

const MenuCard = ({ _id, name, description, price, images, available, onToggle }) => {
    const [busy, setBusy] = useState(false);

    const handleToggle = async () => {
        setBusy(true);
        await onToggle(_id, !available);
        setBusy(false);
    };

    return (
        <div
            className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[200px] flex 2xl:gap-2 border border-border rounded-lg overflow-hidden hover:shadow-lg duration-300"
        >
            <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images?.[0]}`}
                alt={`ترخینه ${name}`}
                className="h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] object-cover"
            />

            <div className="w-full md:p-4 p-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="3xl:text-2xl md:text-1.5xl text-super-base text-foreground font-semibold">
                        {name}
                    </h3>
                    <button
                        onClick={handleToggle}
                        disabled={busy}
                        aria-pressed={available}
                        aria-label={available ? "غیرفعال کردن در منوی شعبه" : "افزودن به منوی شعبه"}
                        className={`shrink-0 w-11 h-6 rounded-full relative transition-colors disabled:opacity-50 ${available ? "bg-primary" : "bg-border"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${available ? "translate-x-0.5" : "translate-x-5"
                                }`}
                        />
                    </button>
                </div>

                <p className="text-muted-fg 3xl:text-super-base md:text-super-sm text-super-xs leading-5 flex-1 line-clamp-2 mt-1">
                    {description}
                </p>

                <div className="flex items-center justify-between md:mt-3.5 mt-1.5">
                    <span className="text-foreground 3xl:text-lg md:text-super-base text-sm font-semibold">
                        {FormatPrice(price)} تومان
                    </span>
                    <span className={`text-super-xs font-medium ${available ? "text-primary" : "text-muted-fg"}`}>
                        {available ? "در منوی شعبه" : "غیرفعال"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
