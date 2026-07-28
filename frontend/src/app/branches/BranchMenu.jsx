"use client";

import { useMemo, useState } from "react";
import MenuCard from "@/components/branchesPage/MenuCard";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const CATEGORIES = [
    { key: "main", label: "غذای اصلی" },
    { key: "side", label: "پیش‌غذا" },
    { key: "dessert", label: "دسر" },
    { key: "drink", label: "نوشیدنی" },
];

const EMPTY_COPY = {
    main: { title: "هنوز غذای اصلی برای این شعبه ثبت نشده", sub: "منوی این شعبه در حال تکمیل است." },
    side: { title: "هنوز پیش‌غذایی برای این شعبه ثبت نشده", sub: "منوی پیش‌غذای این شعبه در حال تکمیل است." },
    dessert: { title: "هنوز دسری برای این شعبه ثبت نشده", sub: "منوی دسر این شعبه در حال تکمیل است." },
    drink: { title: "هنوز نوشیدنی‌ای برای این شعبه ثبت نشده", sub: "منوی نوشیدنی این شعبه در حال تکمیل است." },
};

const BranchMenu = ({ items, branchId, branchName }) => {
    const grouped = useMemo(() => {
        const g = { main: [], side: [], dessert: [], drink: [] };
        items.forEach((it) => { if (g[it.category]) g[it.category].push(it); });
        return g;
    }, [items]);

    // Land on the first category that actually has something to show.
    const firstFilled = CATEGORIES.find((c) => grouped[c.key].length)?.key || "main";
    const [active, setActive] = useState(firstFilled);

    const current = grouped[active] || [];
    const filledCount = CATEGORIES.filter((c) => grouped[c.key].length).length;

    return (
        <section className="md:pt-16 pt-12">
            <div className="container">
                <h2 className="md:text-2.5xl text-xl text-foreground font-semibold">
                    منوی شعبه {branchName}
                </h2>
                <p className="text-muted-fg text-super-sm mt-1.5 mb-3.5">
                    {PersianNumber(items.length)} آیتم در {PersianNumber(filledCount)} دسته موجود است
                </p>
            </div>

            {/* category tabs — an empty category is visibly disabled instead of
                rendering an empty band further down the page */}
            <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border">
                <div className="container">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar" role="tablist">
                        {CATEGORIES.map((c) => {
                            const count = grouped[c.key].length;
                            const isActive = active === c.key;
                            return (
                                <button
                                    key={c.key}
                                    role="tab"
                                    aria-selected={isActive}
                                    disabled={!count}
                                    onClick={() => setActive(c.key)}
                                    className={`relative shrink-0 inline-flex items-center gap-2 px-4 py-4 text-super-base font-bold duration-200
                                        ${!count ? "text-subtle-fg cursor-not-allowed"
                                            : isActive ? "text-primary" : "text-muted-fg hover:text-foreground"}`}
                                >
                                    {c.label}
                                    <span className={`min-w-6 rounded-full px-2 text-super-xs font-bold tabular-nums
                                        ${isActive ? "bg-primary-subtle text-primary" : "bg-surface-sunken"}`}>
                                        {count ? PersianNumber(count) : "—"}
                                    </span>
                                    <span className={`absolute bottom-0 inset-x-4 h-[3px] rounded-t bg-primary duration-300 origin-center
                                        ${isActive ? "scale-x-100" : "scale-x-0"}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container">
                {current.length > 0 ? (
                    <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 md:pt-8 pt-6 stagger-in">
                        {current.map((item, i) => (
                            <div key={item._id} style={{ "--i": i % 8 }}>
                                <MenuCard {...item} branch={branchId} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyCategory
                        copy={EMPTY_COPY[active]}
                        others={CATEGORIES.filter((c) => grouped[c.key].length)}
                        onPick={setActive}
                    />
                )}
            </div>
        </section>
    );
};

const EmptyCategory = ({ copy, others, onPick }) => (
    <div className="md:mt-8 mt-6 bg-surface border border-dashed border-border-strong rounded-3xl text-center px-6 md:py-14 py-10">
        <div className="w-[76px] h-[76px] mx-auto mb-5 rounded-[22px] bg-primary-subtle text-primary grid place-items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <path d="M4 9h16" />
                <path d="M6 9V7a2 2 0 012-2h8a2 2 0 012 2v2" />
                <path d="M5 9l1.2 9.3A2 2 0 008.2 20h7.6a2 2 0 002-1.7L19 9" />
                <path d="M10 13.5h4" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground">{copy.title}</h3>
        <p className="text-muted-fg text-super-sm mt-2 max-w-md mx-auto">{copy.sub}</p>

        {others.length > 0 &&
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                {others.map((c, i) => (
                    <button
                        key={c.key}
                        onClick={() => onPick(c.key)}
                        className={`rounded-xl border px-5 py-2.5 text-super-sm font-bold duration-200
                            ${i === 0
                                ? "bg-primary border-primary text-primary-fg hover:bg-primary-hover hover:border-primary-hover"
                                : "border-primary text-primary hover:bg-primary-subtle"}`}
                    >
                        دیدن {c.label}
                    </button>
                ))}
            </div>
        }
    </div>
);

export default BranchMenu;
