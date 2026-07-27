"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { StatusPill } from "@/app/admin/adminUtils";
import { SearchIcon, BagIcon, PersonIcon, HomeMiniIcon, CloseIcon } from "@/app/admin/icons";

const faTime = (d) => new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" });

// Global admin search: order id / customer name-phone / branch name — replaces
// the static "platform view" badge with something an admin actually uses.
const GlobalSearch = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const wrap = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

    useEffect(() => {
        const onClick = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
    }, []);

    useEffect(() => {
        const term = q.trim();
        if (term.length < 2) { setData(null); setLoading(false); return; }
        const c = new AbortController();
        setLoading(true);
        const t = setTimeout(() => {
            api.get(`/admin/search?q=${encodeURIComponent(term)}`, { signal: c.signal })
                .then((res) => setData(res.data))
                .catch((err) => { if (err.name !== "AbortError") setData({ orders: [], users: [], branches: [] }); })
                .finally(() => setLoading(false));
        }, 300);
        return () => { clearTimeout(t); c.abort(); };
    }, [q]);

    const close = () => { setOpen(false); setQ(""); setData(null); };
    const go = (path) => { close(); router.push(path); };

    const showPanel = open && q.trim().length >= 2;
    const hasResults = data && (data.orders.length || data.users.length || data.branches.length);

    return (
        <div ref={wrap} className="relative">
            {!open ? (
                <button type="button" onClick={() => setOpen(true)} aria-label="جستجوی سراسری"
                    className="w-10 h-10 rounded-xl border border-border bg-surface-sunken grid place-items-center text-muted-fg hover:text-foreground hover:border-border-strong transition-colors">
                    <SearchIcon className="w-[18px] h-[18px]" />
                </button>
            ) : (
                <div className="flex items-center gap-2 bg-surface border border-primary/40 ring-2 ring-primary/10 rounded-xl px-3 h-10 w-56 sm:w-80 transition-all">
                    <SearchIcon className="w-4 h-4 text-muted-fg shrink-0" />
                    <input
                        ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
                        placeholder="جستجوی سفارش، کاربر یا شعبه…"
                        className="bg-transparent text-super-sm w-full focus:outline-none min-w-0"
                    />
                    <button type="button" onClick={close} aria-label="بستن" className="text-subtle-fg hover:text-foreground shrink-0"><CloseIcon className="w-4 h-4" /></button>
                </div>
            )}

            {showPanel && (
                <div className="absolute left-0 mt-2 w-72 sm:w-96 bg-surface border border-border rounded-2xl shadow-soft-lg z-50 overflow-hidden stagger-in">
                    <div className="max-h-[65vh] overflow-y-auto">
                        {loading && <div className="text-super-sm text-muted-fg text-center py-8">در حال جستجو…</div>}
                        {!loading && data && !hasResults && <div className="text-super-sm text-muted-fg text-center py-8">نتیجه‌ای برای «{q.trim()}» یافت نشد.</div>}

                        {!loading && data?.branches?.length > 0 && (
                            <div className="py-2 border-b border-border/70 last:border-0">
                                <div className="px-4 py-1 text-super-xs font-bold text-muted-fg">شعبه‌ها</div>
                                {data.branches.map((b) => (
                                    <button key={b._id} onClick={() => go(`/admin/branches/${b._id}`)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-surface-sunken text-right">
                                        <span className="w-8 h-8 rounded-lg bg-primary-subtle text-primary grid place-items-center shrink-0"><HomeMiniIcon className="w-4 h-4" /></span>
                                        <span className="font-semibold text-super-sm">{b.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {!loading && data?.users?.length > 0 && (
                            <div className="py-2 border-b border-border/70 last:border-0">
                                <div className="px-4 py-1 text-super-xs font-bold text-muted-fg">کاربران</div>
                                {data.users.map((u) => (
                                    <button key={u._id} onClick={() => go(`/admin/users?openId=${u._id}`)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-surface-sunken text-right">
                                        <span className="w-8 h-8 rounded-lg bg-[hsl(var(--role-courier)/0.12)] text-[hsl(var(--role-courier))] grid place-items-center shrink-0"><PersonIcon className="w-4 h-4" /></span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-semibold text-super-sm truncate">{u.fullName || "بدون نام"}</span>
                                            <span className="block text-super-xs text-muted-fg tabular-nums">{u.phoneNumber}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {!loading && data?.orders?.length > 0 && (
                            <div className="py-2">
                                <div className="px-4 py-1 text-super-xs font-bold text-muted-fg">سفارش‌ها</div>
                                {data.orders.map((o) => (
                                    <button key={o._id} onClick={() => go(`/admin/orders?openId=${o._id}`)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-surface-sunken text-right">
                                        <span className="w-8 h-8 rounded-lg bg-status-preparing-subtle text-status-preparing grid place-items-center shrink-0"><BagIcon className="w-4 h-4" /></span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2 text-super-sm">
                                                <b className="font-extrabold text-primary-hover">#{PersianNumber(String(o._id).slice(-5))}</b>
                                                <span className="truncate text-muted-fg">{o.user?.fullName || "مشتری"}</span>
                                            </span>
                                            <span className="block text-super-xs text-subtle-fg tabular-nums">{faTime(o.createdAt)} · {FormatPrice(o.finalPrice)} ت</span>
                                        </span>
                                        <StatusPill status={o.status} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
