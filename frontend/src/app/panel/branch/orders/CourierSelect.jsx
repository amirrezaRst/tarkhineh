"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { courierImg, initials, courierState } from "../couriers/courierUtils";

// A styled, searchable courier picker (custom select). The dropdown renders in a
// portal with fixed positioning so it overlays the order card instead of being
// clipped by the card's overflow. Full/offline couriers are disabled so they
// can't be over-assigned.
const MiniAvatar = ({ courier, size = 34 }) => {
    const url = courierImg(courier.image);
    return url
        ? <img src={url} alt="" style={{ width: size, height: size }} className="rounded-[10px] object-cover shrink-0" />
        : <div style={{ width: size, height: size, fontSize: size * 0.36 }} className="rounded-[10px] shrink-0 grid place-items-center font-extrabold text-white bg-gradient-to-tl from-feature-from to-feature-mid">{initials(courier.fullName, courier.phoneNumber)}</div>;
};

const LoadDots = ({ active, capacity }) => (
    <span className="inline-flex gap-[2px] align-middle">
        {Array.from({ length: capacity }, (_, i) => (
            <i key={i} className={`inline-block w-[7px] h-1 rounded-full ${i < active ? (active >= capacity ? "bg-warning" : "bg-primary") : "bg-border-strong"}`} />
        ))}
    </span>
);

const badge = (state) => ({
    free: { t: "آزاد", c: "bg-primary-subtle text-primary" },
    busy: { t: "در حال تحویل", c: "bg-status-preparing-subtle text-status-preparing" },
    off: { t: "آفلاین", c: "bg-surface-sunken text-subtle-fg" },
}[state]);

const CourierSelect = ({ couriers = [], capacity = 3, value, onChange, full = false }) => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [pos, setPos] = useState(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    const place = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const width = full ? r.width : Math.max(r.width, 288);
        let left = r.right - width;                       // align right edges (RTL)
        left = Math.min(Math.max(left, 8), window.innerWidth - width - 8);
        setPos({ top: r.bottom + 6, left, width });
    }, [full]);

    useLayoutEffect(() => { if (open) place(); }, [open, place]);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e) => {
            if (triggerRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
            setOpen(false);
        };
        const onScrollResize = () => place();
        document.addEventListener("mousedown", onDoc);
        window.addEventListener("resize", onScrollResize);
        window.addEventListener("scroll", onScrollResize, true);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            window.removeEventListener("resize", onScrollResize);
            window.removeEventListener("scroll", onScrollResize, true);
        };
    }, [open, place]);

    const selected = couriers.find((c) => c._id === value) || null;
    const filtered = couriers.filter((c) => !q || (c.fullName || "").includes(q) || (c.phoneNumber || "").includes(q));

    const menu = pos && (
        <div
            ref={menuRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 60 }}
            className="bg-surface border border-border rounded-2xl shadow-soft-lg p-1.5"
            dir="rtl"
        >
            <div className="flex items-center gap-2 px-2.5 py-2 text-subtle-fg border-b border-border mb-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی پیک…" className="flex-1 bg-transparent outline-none text-super-xs" autoFocus />
            </div>
            <div className="max-h-64 overflow-y-auto">
                {filtered.length === 0 && <p className="text-super-xs text-muted-fg text-center py-3">پیکی یافت نشد.</p>}
                {filtered.map((c) => {
                    const state = courierState(c);
                    const disabled = state === "off" || c.activeOrders >= capacity;
                    const b = badge(state);
                    const isSel = c._id === value;
                    return (
                        <button
                            key={c._id}
                            type="button"
                            disabled={disabled}
                            onClick={() => { onChange(c._id); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-right ${isSel ? "bg-primary-subtle" : "hover:bg-surface-sunken"} ${disabled ? "opacity-55 cursor-not-allowed" : ""}`}
                        >
                            <MiniAvatar courier={c} />
                            <div className="min-w-0 flex-1">
                                <div className="text-super-xs font-extrabold truncate">{c.fullName || c.phoneNumber}</div>
                                <div className="text-[11px] text-muted-fg flex items-center gap-1.5"><LoadDots active={c.activeOrders} capacity={capacity} />{PersianNumber(c.activeOrders)} از {PersianNumber(capacity)}</div>
                            </div>
                            {isSel ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0"><path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            ) : (
                                <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${disabled && state !== "off" ? "bg-warning-subtle text-warning-fg" : b.c}`}>{c.activeOrders >= capacity && state !== "off" ? "ظرفیت پر" : b.t}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={full ? "w-full" : ""}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center justify-between gap-2.5 bg-surface rounded-xl px-3 py-2.5 text-super-xs font-bold transition-colors border ${full ? "w-full" : "min-w-[210px]"} ${open ? "border-primary ring-2 ring-primary-subtle" : "border-border-strong hover:border-primary"}`}
            >
                {selected ? (
                    <span className="flex items-center gap-2 min-w-0"><MiniAvatar courier={selected} size={22} /><span className="truncate">{selected.fullName || selected.phoneNumber}</span></span>
                ) : (
                    <span className="text-subtle-fg font-semibold">اختصاص پیک…</span>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {open && typeof document !== "undefined" && createPortal(menu, document.body)}
        </div>
    );
};

export default CourierSelect;
