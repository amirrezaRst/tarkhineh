"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import { Skeleton } from "@/components/panel/Skeleton";
import { LedgerCard } from "../courierWidgets";
import { shortId, faTime, faDate } from "../courierClientUtils";

const RANGES = [
    { key: "today", label: "امروز" },
    { key: "week", label: "هفته" },
    { key: "month", label: "ماه" },
    { key: "all", label: "همه" },
];

const CourierHistory = () => {
    const [range, setRange] = useState("week");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const c = new AbortController();
        setLoading(true);
        api.get(`/courier/history?range=${range}`, { signal: c.signal })
            .then((res) => setData(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));
        return () => c.abort();
    }, [range]);

    const sum = data?.summary || {};
    const orders = data?.orders || [];
    const deliveryMinutes = (o) => (o.assignedAt && o.deliveredAt ? Math.round((new Date(o.deliveredAt) - new Date(o.assignedAt)) / 60000) : null);

    return (
        <div className="w-full max-w-[1180px]">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold">تاریخچهٔ تحویل</h1>
                    <p className="text-muted-fg text-super-sm mt-1.5">سفارش‌هایی که تحویل داده‌اید</p>
                </div>
                <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                    {RANGES.map((r) => (
                        <button key={r.key} onClick={() => setRange(r.key)}
                            className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${range === r.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{r.label}</button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
                {/* main table */}
                <div className="min-w-0">
                    <Card className="overflow-hidden">
                        <div className="hidden sm:grid grid-cols-[auto_1.5fr_1fr_1fr_auto] gap-3 px-5 py-3 bg-surface-sunken text-super-xs font-bold text-muted-fg">
                            <span>سفارش</span><span>مشتری</span><span>مبلغ</span><span>زمان تحویل</span><span>وضعیت</span>
                        </div>
                        {loading ? (
                            <div className="p-5 space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-8" />)}</div>
                        ) : orders.length === 0 ? (
                            <p className="text-muted-fg text-super-sm text-center py-10">در این بازه تحویلی ثبت نشده است.</p>
                        ) : (
                            orders.map((o) => {
                                const mins = deliveryMinutes(o);
                                return (
                                    <div key={o._id} className="grid grid-cols-2 sm:grid-cols-[auto_1.5fr_1fr_1fr_auto] gap-x-3 gap-y-1 items-center px-5 py-3.5 border-t border-border text-super-sm">
                                        <span className="font-extrabold text-primary-hover text-super-xs">#{shortId(o._id)}</span>
                                        <span className="font-semibold truncate">{o.user?.fullName || o.user?.phoneNumber || "مشتری"}<span className="block text-super-xs text-subtle-fg font-normal">{faTime(o.deliveredAt)} · {faDate(o.deliveredAt)}</span></span>
                                        <span className="tabular-nums font-bold">{FormatPrice(o.finalPrice)}</span>
                                        <span className="tabular-nums text-muted-fg">{mins != null ? `${PersianNumber(mins)} دقیقه` : "—"}</span>
                                        <span className="justify-self-start sm:justify-self-auto text-super-xs font-bold bg-status-delivered-subtle text-status-delivered rounded-full px-2.5 py-1 whitespace-nowrap">تحویل شده</span>
                                    </div>
                                );
                            })
                        )}
                    </Card>
                </div>

                {/* rail summary */}
                <div className="flex flex-col gap-4">
                    {loading ? <Skeleton className="h-52 rounded-2xl" /> : (
                        <LedgerCard title="خلاصهٔ عملکرد" rows={[
                            { k: "کل تحویل‌ها", v: PersianNumber(sum.total ?? 0) },
                            { k: "این ماه", v: PersianNumber(sum.thisMonth ?? 0) },
                            { k: "مجموع هزینهٔ ارسال", v: `${FormatPrice(sum.totalFees ?? 0)} ت` },
                            { k: "میانگین زمان", v: sum.avgMinutes != null ? `${PersianNumber(sum.avgMinutes)} دقیقه` : "—" },
                        ]} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourierHistory;
