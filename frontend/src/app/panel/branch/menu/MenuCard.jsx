"use client";

import { useState } from "react";
import FormatPrice from "@/utils/FormatPrice";

const CATEGORY_LABEL = { main: "غذای اصلی", side: "پیش‌غذا", dessert: "دسر", drink: "نوشیدنی" };

const MenuCard = ({ _id, name, description, price, images, category, available, onToggle }) => {
    const [busy, setBusy] = useState(false);
    const handleToggle = async () => {
        setBusy(true);
        await onToggle(_id, !available);
        setBusy(false);
    };

    const img = images?.[0] ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}` : null;

    return (
        <div className={`flex bg-surface rounded-2xl shadow-soft overflow-hidden transition-all duration-200 hover:shadow-soft-lg ${!available ? "opacity-95" : ""}`}>
            <div className="w-[118px] shrink-0 bg-surface-sunken bg-cover bg-center"
                style={{ backgroundImage: img ? `url(${img})` : undefined, filter: available ? undefined : "grayscale(0.7)" }} />

            <div className="flex-1 p-4 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-super-base font-extrabold truncate">{name}</h3>
                    {category && (
                        <span className="shrink-0 text-super-xs font-bold text-primary bg-primary-subtle rounded-full px-2 py-0.5">
                            {CATEGORY_LABEL[category] || category}
                        </span>
                    )}
                </div>

                <p className="text-super-xs text-muted-fg mt-1.5 leading-5 line-clamp-2 flex-1">{description}</p>

                <div className="flex items-center justify-between gap-2 mt-3">
                    <span className="font-extrabold text-super-sm tabular-nums">{FormatPrice(price)} تومان</span>
                    <div className="flex items-center gap-2.5">
                        <span className={`text-super-xs font-bold ${available ? "text-primary" : "text-subtle-fg"}`}>
                            {available ? "موجود" : "ناموجود"}
                        </span>
                        <button
                            onClick={handleToggle}
                            disabled={busy}
                            aria-pressed={available}
                            aria-label={available ? "غیرفعال کردن در منوی شعبه" : "افزودن به منوی شعبه"}
                            className={`shrink-0 w-11 h-6 rounded-full relative transition-colors disabled:opacity-50 ${available ? "bg-primary" : "bg-border-strong"}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${available ? "right-0.5" : "right-[22px]"}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
