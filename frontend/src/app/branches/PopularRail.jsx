"use client";

import { useRef } from "react";
import MenuCard from "@/components/branchesPage/MenuCard";
import { ChevronIcon } from "@/assets/Icons";

// A single ranked rail across every category, replacing the old per-category
// "محبوب" sections — those repeated the same items whenever a category held
// fewer items than the fetch limit.
const PopularRail = ({ items, branchId, branchName }) => {
    const rail = useRef(null);

    if (items.length < 3) return null;

    const scroll = (dir) => rail.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

    return (
        <section className="container md:pt-16 pt-12">
            <div className="flex items-end justify-between gap-5 mb-6">
                <div>
                    <h2 className="md:text-2.5xl text-xl text-foreground font-semibold">
                        محبوب‌ترین‌های این شعبه
                    </h2>
                    <p className="text-muted-fg text-super-sm mt-1.5">
                        بر اساس امتیاز مشتری‌های شعبه {branchName} — از میان همهٔ دسته‌ها
                    </p>
                </div>

                <div className="hidden md:flex gap-2 shrink-0">
                    <button
                        onClick={() => scroll(1)}
                        aria-label="مورد قبلی"
                        className="w-10 h-10 rounded-xl border border-border-strong bg-surface text-muted-fg grid place-items-center hover:text-primary hover:border-primary hover:-translate-y-0.5 duration-200"
                    >
                        <ChevronIcon className="w-4 h-4 fill-current -rotate-90" />
                    </button>
                    <button
                        onClick={() => scroll(-1)}
                        aria-label="مورد بعدی"
                        className="w-10 h-10 rounded-xl border border-border-strong bg-surface text-muted-fg grid place-items-center hover:text-primary hover:border-primary hover:-translate-y-0.5 duration-200"
                    >
                        <ChevronIcon className="w-4 h-4 fill-current rotate-90" />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* edge fades so cards read as "more to scroll", not cut off */}
                <div className="pointer-events-none absolute inset-y-0 -right-px w-14 z-[3] bg-gradient-to-l from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 -left-px w-14 z-[3] bg-gradient-to-r from-background to-transparent" />

                <div ref={rail} className="flex gap-5 overflow-x-auto pt-1.5 pb-3.5 no-scrollbar">
                    {items.map((item, index) => (
                        <div key={item._id} className="shrink-0 w-[270px]">
                            <MenuCard {...item} branch={branchId} rank={index + 1} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularRail;
