"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { StatusPill } from "../adminUtils";
import OrderDetailModal from "./OrderDetailModal";

const STATUS_TABS = [
    { key: "all", label: "همه" }, { key: "pending", label: "در انتظار" }, { key: "preparing", label: "آماده‌سازی" },
    { key: "on_the_way", label: "در مسیر" }, { key: "delivered", label: "تحویل‌شده" }, { key: "cancelled", label: "لغوشده" },
];
const RANGES = [{ key: "today", label: "امروز" }, { key: "week", label: "هفته" }, { key: "month", label: "ماه" }, { key: "all", label: "همه" }];
const faTime = (d) => new Date(d).toLocaleString("fa-IR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const AdminOrders = () => {
    const [status, setStatus] = useState("all");
    const [range, setRange] = useState("week");
    const [branch, setBranch] = useState("all");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => { api.get("/admin/branches").then((r) => setBranches(r.data.branches)).catch(() => { }); }, []);

    const load = useCallback(async (signal) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/orders?status=${status}&range=${range}&branch=${branch}&q=${encodeURIComponent(q)}&page=${page}`, { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [status, range, branch, q, page]);

    useEffect(() => {
        const c = new AbortController();
        const t = setTimeout(() => load(c.signal), 250);
        return () => { clearTimeout(t); c.abort(); };
    }, [load]);

    const counts = data?.counts || {};
    const orders = data?.orders || [];
    const reset = (fn) => { setPage(1); fn(); };

    return (
        <div className="w-full">
            <PanelPageHeader title="سفارش‌های سراسری" subtitle="نظارت و مدیریت سفارش‌های همهٔ شعبه‌ها" />

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-surface-sunken border border-border rounded-xl px-3.5 py-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted-fg shrink-0"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" /><path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    <input value={q} onChange={(e) => reset(() => setQ(e.target.value))} placeholder="جستجو با کد سفارش، نام یا شماره…" className="bg-transparent text-super-sm w-full focus:outline-none" />
                </div>
                <select value={branch} onChange={(e) => reset(() => setBranch(e.target.value))} className="border border-border rounded-xl px-3 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="all">همهٔ شعبه‌ها</option>
                    {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                    {RANGES.map((r) => <button key={r.key} onClick={() => reset(() => setRange(r.key))} className={`text-super-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${range === r.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{r.label}</button>)}
                </div>
            </div>

            <div className="flex gap-1.5 mb-4 flex-wrap">
                {STATUS_TABS.map((t) => (
                    <button key={t.key} onClick={() => reset(() => setStatus(t.key))}
                        className={`text-super-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${status === t.key ? "bg-primary text-primary-fg border-primary" : "bg-surface border-border text-muted-fg hover:text-foreground"}`}>
                        {t.label}<span className="mr-1.5 tabular-nums opacity-70">{PersianNumber(counts[t.key] ?? 0)}</span>
                    </button>
                ))}
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-super-sm">
                        <thead>
                            <tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">کد</th><th className="px-4 py-3 font-bold">مشتری</th><th className="px-4 py-3 font-bold">شعبه</th>
                                <th className="px-4 py-3 font-bold">وضعیت</th><th className="px-4 py-3 font-bold">مبلغ (ت)</th><th className="px-4 py-3 font-bold">زمان</th><th className="px-4 py-3 font-bold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [0, 1, 2, 3, 4].map((i) => <tr key={i} className="border-t border-border"><td colSpan={7} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                                : orders.length === 0 ? <tr><td colSpan={7} className="text-center py-10 text-muted-fg">سفارشی یافت نشد.</td></tr>
                                    : orders.map((o) => (
                                        <tr key={o._id} onClick={() => setSelected(o)} className="border-t border-border hover:bg-surface-sunken/50 cursor-pointer">
                                            <td className="px-4 py-3 font-extrabold text-primary-hover tabular-nums">#{PersianNumber(String(o._id).slice(-5))}</td>
                                            <td className="px-4 py-3"><div className="font-semibold">{o.user?.fullName || "مشتری"}</div><div className="text-super-xs text-muted-fg tabular-nums">{o.user?.phoneNumber || ""}</div></td>
                                            <td className="px-4 py-3">{o.branch?.name || "—"}</td>
                                            <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                                            <td className="px-4 py-3 tabular-nums font-bold">{FormatPrice(o.finalPrice)}</td>
                                            <td className="px-4 py-3 tabular-nums text-muted-fg whitespace-nowrap">{faTime(o.createdAt)}</td>
                                            <td className="px-4 py-3 text-super-xs text-primary font-bold whitespace-nowrap">جزئیات ›</td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
                {data && data.pages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border text-super-xs">
                        <span className="text-muted-fg">صفحهٔ {PersianNumber(data.page)} از {PersianNumber(data.pages)} · {PersianNumber(data.total)} سفارش</span>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-border font-bold disabled:opacity-40">قبلی</button>
                            <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-border font-bold disabled:opacity-40">بعدی</button>
                        </div>
                    </div>
                )}
            </Card>

            <OrderDetailModal open={!!selected} onClose={() => setSelected(null)} order={selected} onChanged={() => load()} />
        </div>
    );
};

export default AdminOrders;
