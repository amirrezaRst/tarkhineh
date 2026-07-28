"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { BagIcon, PersonIcon, ReviewStarIcon } from "@/app/admin/icons";

const POLL_MS = 45000;
const relative = (t) => {
    const m = Math.round((Date.now() - new Date(t)) / 60000);
    if (m < 1) return "همین حالا";
    if (m < 60) return `${PersianNumber(m)} دقیقه پیش`;
    const h = Math.round(m / 60);
    if (h < 24) return `${PersianNumber(h)} ساعت پیش`;
    return `${PersianNumber(Math.round(h / 24))} روز پیش`;
};

const TYPE_ICON = { order: BagIcon, user: PersonIcon, review: ReviewStarIcon };
const TONE = {
    order: "bg-primary-subtle text-primary",
    user: "bg-[hsl(var(--role-courier)/0.12)] text-[hsl(var(--role-courier))]",
    review: "bg-status-pending-subtle text-status-pending",
};

// Real activity bell for the admin topbar: a structurally-separate header
// (never scrolls) above an independently-scrolling event list, so items can
// never visually pass over the title/count row. Clicking an event deep-links
// straight to that specific order/review/user via an `openId` query param.
const AdminBell = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const wrap = useRef(null);

    const load = () => api.get("/admin/activity").then(setData).catch(() => { });
    useEffect(() => {
        load();
        const id = setInterval(load, POLL_MS);
        return () => clearInterval(id);
    }, []);
    useEffect(() => {
        const onClick = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
    }, []);

    const badge = data?.data?.badge || 0;
    const events = data?.data?.events || [];
    const counts = data?.data?.counts || {};

    const go = (link) => { setOpen(false); router.push(link); };

    return (
        <div className="relative" ref={wrap}>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-label="اعلان‌ها" aria-expanded={open}
                className="relative w-10 h-10 rounded-xl border border-border bg-surface-sunken grid place-items-center text-muted-fg hover:text-foreground hover:border-border-strong transition-colors">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {badge > 0 && <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-status-cancelled text-white text-[10px] font-extrabold grid place-items-center tabular-nums ring-2 ring-surface">{PersianNumber(badge > 99 ? "99+" : badge)}</span>}
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-2xl shadow-soft-lg z-50 flex flex-col stagger-in" style={{ maxHeight: "min(70vh, 480px)" }}>
                    {/* header — a separate, non-scrolling flex item; content can never render over it */}
                    <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface rounded-t-2xl">
                        <span className="font-extrabold text-super-sm">فعالیت‌های اخیر</span>
                        {badge > 0 && <span className="text-super-xs text-muted-fg whitespace-nowrap">{PersianNumber(counts.pendingReviews || 0)} نظر · {PersianNumber(counts.pendingOrders || 0)} سفارش در انتظار</span>}
                    </div>

                    {/* body — independently scrollable */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {events.length === 0 ? (
                            <p className="text-super-sm text-muted-fg text-center py-10">فعالیتی نیست.</p>
                        ) : events.map((e, i) => {
                            const Icon = TYPE_ICON[e.type] || BagIcon;
                            return (
                                <button key={i} onClick={() => go(e.link)} className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-surface-sunken text-right border-b border-border/60 last:border-0 transition-colors">
                                    <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${TONE[e.type] || TONE.order}`}><Icon className="w-4 h-4" /></span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-super-sm font-bold truncate">{e.title}</span>
                                        <span className="block text-super-xs text-muted-fg truncate">{e.subtitle}</span>
                                    </span>
                                    <span className="text-super-xs text-subtle-fg whitespace-nowrap shrink-0 mt-0.5">{relative(e.time)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBell;
