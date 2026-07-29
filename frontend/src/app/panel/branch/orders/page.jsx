"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { SkeletonOrderRow } from "@/components/Skeleton";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail";

const TABS = [
    { key: "all", label: "همه" },
    { key: "pending", label: "در انتظار تایید" },
    { key: "preparing", label: "در حال آماده‌سازی" },
    { key: "on_the_way", label: "ارسال شده" },
    { key: "delivered", label: "تحویل شده" },
    { key: "cancelled", label: "لغو شده" },
];
const RANGES = [
    { key: "today", label: "امروز" },
    { key: "yesterday", label: "دیروز" },
    { key: "7days", label: "۷ روز" },
    { key: "all", label: "همه" },
    { key: "custom", label: "بازهٔ دلخواه" },
];
const SORTS = [
    { key: "newest", label: "جدیدترین" },
    { key: "oldest", label: "قدیمی‌ترین" },
    { key: "amount", label: "بیشترین مبلغ" },
];
const PAGE_SIZE = 15;

const BranchPanelOrders = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";
    const params = useSearchParams();

    // Initial tab/range may be preset from a deep link (e.g. the reports donut).
    const qsStatus = params.get("status");
    const qsRange = params.get("range");
    const [activeTab, setActiveTab] = useState(TABS.some((t) => t.key === qsStatus) ? qsStatus : "all");
    const [range, setRange] = useState(RANGES.some((r) => r.key === qsRange) ? qsRange : "today");
    const [custom, setCustom] = useState({ from: "", to: "" });
    const [sort, setSort] = useState("newest");
    const [qInput, setQInput] = useState("");
    const [q, setQ] = useState("");

    const [orders, setOrders] = useState([]);
    const [counts, setCounts] = useState({});
    const [couriers, setCouriers] = useState([]);
    const [capacity, setCapacity] = useState(3);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const abortRef = useRef(null);

    // debounce the search box
    useEffect(() => {
        const t = setTimeout(() => setQ(qInput.trim()), 400);
        return () => clearTimeout(t);
    }, [qInput]);

    const buildParams = (pageNum) => {
        const p = new URLSearchParams({ status: activeTab, sort, page: String(pageNum), limit: String(PAGE_SIZE) });
        if (range === "custom") {
            if (custom.from || custom.to) { p.set("range", "custom"); if (custom.from) p.set("from", custom.from); if (custom.to) p.set("to", custom.to); }
        } else if (range !== "all") {
            p.set("range", range);
        }
        if (q) p.set("q", q);
        return p;
    };

    const fetchOrders = async (pageNum, append) => {
        if (!branch) return;
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        append ? setLoadingMore(true) : setLoading(true);
        try {
            const res = await api.get(`/branch-manager/orders/${branch}?${buildParams(pageNum)}`, { signal: controller.signal });
            const { orders: rows, counts: c, totalPages: tp } = res.data;
            setCounts(c || {});
            setTotalPages(tp || 1);
            setPage(pageNum);
            setOrders((prev) => {
                const next = append ? [...prev, ...rows] : rows;
                setSelectedId((sel) => (sel && next.some((o) => o._id === sel) ? sel : next[0]?._id || null));
                return next;
            });
        } catch (err) {
            if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        } finally {
            append ? setLoadingMore(false) : setLoading(false);
        }
    };

    // refetch (page 1) whenever a filter changes
    useEffect(() => {
        if (!branch) return;
        fetchOrders(1, false);
        return () => abortRef.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch, activeTab, range, sort, q, custom.from, custom.to]);

    const fetchCouriers = async (signal) => {
        if (!branch) return;
        try {
            const res = await api.get(`/branch-manager/couriers/${branch}`, { signal });
            setCouriers(res.data.couriers);
            setCapacity(res.data.courierCapacity ?? 3);
        } catch (err) { if (err.name !== "AbortError") { /* couriers only power the assign action */ } }
    };
    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        fetchCouriers(controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch]);

    const handleChanged = () => { fetchOrders(1, false); fetchCouriers(); };
    const selectedOrder = useMemo(() => orders.find((o) => o._id === selectedId) || null, [orders, selectedId]);

    return (
        <div className="w-full">
            <PanelPageHeader title="سفارش‌ها" subtitle={`مدیریت و پیگیری سفارش‌های شعبه ${branchName}`} />

            {/* toolbar: date range + search + sort */}
            <div className="flex items-center gap-2.5 flex-wrap mb-3">
                <div className="inline-flex bg-surface border border-border rounded-xl p-1 gap-1">
                    {RANGES.map((r) => (
                        <button key={r.key} onClick={() => setRange(r.key)}
                            className={`text-super-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${range === r.key ? "bg-primary text-primary-fg" : "text-muted-fg hover:text-foreground"}`}>
                            {r.label}
                        </button>
                    ))}
                </div>
                {range === "custom" && (
                    <div className="inline-flex items-center gap-1.5 bg-surface border border-border rounded-xl px-2.5 py-1.5">
                        <input type="date" value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} className="bg-transparent text-super-xs outline-none" aria-label="از تاریخ" />
                        <span className="text-subtle-fg text-super-xs">تا</span>
                        <input type="date" value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} className="bg-transparent text-super-xs outline-none" aria-label="تا تاریخ" />
                    </div>
                )}
                <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 min-w-[220px] flex-1 max-w-sm text-subtle-fg">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    <input value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="جستجوی شماره سفارش، نام یا تلفن مشتری…" className="flex-1 bg-transparent outline-none text-super-xs text-foreground" />
                    {qInput && <button onClick={() => setQInput("")} aria-label="پاک کردن" className="text-subtle-fg hover:text-foreground"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>}
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-surface border border-border rounded-xl px-3 py-2 text-super-xs font-bold text-muted-fg">
                    {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
            </div>

            {/* status tabs (counts reflect current filters) */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
                {TABS.map((tab) => {
                    const on = activeTab === tab.key;
                    const cnt = counts[tab.key];
                    return (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-super-sm font-bold border transition-colors ${on ? "bg-primary text-primary-fg border-primary" : "bg-surface text-muted-fg border-border hover:border-border-strong"}`}>
                            {tab.label}
                            {cnt !== undefined && (
                                <span className={`text-super-xs font-extrabold tabular-nums rounded-full px-1.5 min-w-[20px] text-center ${on ? "bg-white/20 text-primary-fg" : "bg-surface-sunken text-muted-fg"}`}>{PersianNumber(cnt)}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-4 items-start">
                <div className="flex flex-col gap-3">
                    {loading ? (
                        <><SkeletonOrderRow /><SkeletonOrderRow /><SkeletonOrderRow /></>
                    ) : orders.length === 0 ? (
                        <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">سفارشی با این فیلترها یافت نشد.</div>
                    ) : (
                        <>
                            {orders.map((order) => (
                                <OrderCard key={order._id} order={order} couriers={couriers} capacity={capacity}
                                    selected={order._id === selectedId} onSelect={() => setSelectedId(order._id)} onChanged={handleChanged} />
                            ))}
                            {page < totalPages && (
                                <button onClick={() => fetchOrders(page + 1, true)} disabled={loadingMore}
                                    className="mx-auto mt-1 bg-surface border border-border-strong text-muted-fg font-bold rounded-xl px-5 py-2.5 text-super-sm hover:text-foreground disabled:opacity-50">
                                    {loadingMore ? "در حال بارگذاری…" : "بارگذاری سفارش‌های بیشتر"}
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div className="hidden xl:block sticky top-2">
                    {selectedOrder ? (
                        <OrderDetail order={selectedOrder} couriers={couriers} capacity={capacity} onChanged={handleChanged} />
                    ) : (
                        <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">یک سفارش را برای مشاهده جزئیات انتخاب کنید.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// useSearchParams requires a Suspense boundary during prerender.
const OrdersPage = () => (
    <Suspense fallback={null}>
        <BranchPanelOrders />
    </Suspense>
);

export default OrdersPage;
