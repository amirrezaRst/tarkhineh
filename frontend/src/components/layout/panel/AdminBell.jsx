"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const POLL_MS = 45000;
const relative = (t) => {
    const m = Math.round((Date.now() - new Date(t)) / 60000);
    if (m < 1) return "همین حالا";
    if (m < 60) return `${PersianNumber(m)} دقیقه پیش`;
    const h = Math.round(m / 60);
    if (h < 24) return `${PersianNumber(h)} ساعت پیش`;
    return `${PersianNumber(Math.round(h / 24))} روز پیش`;
};

const TypeIcon = ({ type }) => {
    const cls = "w-4 h-4";
    if (type === "user") return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" /></svg>;
    if (type === "review") return <svg viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z" /></svg>;
    return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7"><path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>;
};
const TONE = { order: "bg-primary-subtle text-primary", user: "bg-[hsl(var(--role-courier)/0.12)] text-[hsl(var(--role-courier))]", review: "bg-status-pending-subtle text-status-pending" };

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
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const badge = data?.data?.badge || 0;
    const events = data?.data?.events || [];
    const counts = data?.data?.counts || {};

    const go = (link) => { setOpen(false); router.push(link); };

    return (
        <div className="relative" ref={wrap}>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-label="اعلان‌ها"
                className="relative w-10 h-10 rounded-xl border border-border bg-surface-sunken grid place-items-center text-muted-fg hover:text-foreground hover:border-border-strong transition-colors">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {badge > 0 && <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-status-cancelled text-white text-[10px] font-extrabold grid place-items-center tabular-nums">{PersianNumber(badge > 99 ? "99+" : badge)}</span>}
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-surface border border-border rounded-2xl shadow-soft-lg z-50 stagger-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-surface">
                        <span className="font-extrabold text-super-sm">فعالیت‌ها</span>
                        {badge > 0 && <span className="text-super-xs text-muted-fg">{PersianNumber(counts.pendingReviews || 0)} نظر · {PersianNumber(counts.pendingOrders || 0)} سفارش در انتظار</span>}
                    </div>
                    {events.length === 0 ? (
                        <p className="text-super-sm text-muted-fg text-center py-8">فعالیتی نیست.</p>
                    ) : events.map((e, i) => (
                        <button key={i} onClick={() => go(e.link)} className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-surface-sunken text-right border-b border-border/60 last:border-0">
                            <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${TONE[e.type] || TONE.order}`}><TypeIcon type={e.type} /></span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-super-sm font-bold truncate">{e.title}</span>
                                <span className="block text-super-xs text-muted-fg truncate">{e.subtitle}</span>
                            </span>
                            <span className="text-super-xs text-subtle-fg whitespace-nowrap shrink-0">{relative(e.time)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBell;
