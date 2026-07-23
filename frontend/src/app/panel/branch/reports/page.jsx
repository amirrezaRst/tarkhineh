"use client";

import { useEffect, useMemo, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import MiniStat from "@/components/panel/MiniStat";
import Card from "@/components/panel/Card";
import AreaChart from "@/components/panel/charts/AreaChart";
import Donut from "@/components/panel/charts/Donut";
import BarChart from "@/components/panel/charts/BarChart";
import { Skeleton } from "@/components/panel/Skeleton";

const PERIODS = [
    { key: "today", label: "امروز" },
    { key: "week", label: "هفته" },
    { key: "month", label: "ماه" },
];

const STATUS_SEGMENTS = [
    { key: "delivered", label: "تحویل شده", color: "hsl(var(--status-delivered))" },
    { key: "on_the_way", label: "در حال ارسال", color: "hsl(var(--status-on-the-way))" },
    { key: "preparing", label: "در حال آماده‌سازی", color: "hsl(var(--status-preparing))" },
    { key: "pending", label: "در انتظار", color: "hsl(var(--status-pending))" },
    { key: "cancelled", label: "لغو شده", color: "hsl(var(--status-cancelled))" },
];

const weekdayShort = (iso) => new Date(iso).toLocaleDateString("fa-IR", { weekday: "short" });

const BranchPanelReports = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";
    const [period, setPeriod] = useState("week");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        setLoading(true);
        api.get(`/branch-manager/stats/${branch}?period=${period}`, { signal: controller.signal })
            .then((res) => setStats(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [branch, period]);

    const donutSegments = STATUS_SEGMENTS.map((s) => ({ label: s.label, value: stats?.statusBreakdown?.[s.key] || 0, color: s.color }));
    const donutTotal = donutSegments.reduce((sum, s) => sum + s.value, 0);

    const topMax = Math.max(...(stats?.topItems || []).map((t) => t.quantity), 1);
    const weekdayData = (stats?.revenueSeries || []).map((d) => ({ label: weekdayShort(d.date), value: d.value }));

    const pay = stats?.paymentSplit || { online: 0, cash: 0 };
    const payTotal = pay.online + pay.cash;
    const onlinePct = payTotal ? Math.round((pay.online / payTotal) * 100) : 0;
    const cashPct = 100 - onlinePct;

    const exportCsv = () => {
        if (!stats) return;
        const rows = [
            ["گزارش شعبه", branchName],
            ["بازه", PERIODS.find((p) => p.key === period)?.label || period],
            [],
            ["شاخص", "مقدار"],
            ["فروش کل (تومان)", stats.revenue],
            ["تعداد سفارش", stats.ordersCount],
            ["میانگین سبد خرید", stats.avgBasket],
            ["نرخ لغو (٪)", stats.cancellationRate],
            [],
            ["پرفروش‌ترین آیتم‌ها", "تعداد فروش"],
            ...(stats.topItems || []).map((t) => [t.menuItem.name, t.quantity]),
        ];
        const csv = "﻿" + rows.map((r) => r.join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url; a.download = `report-${branchName}-${period}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const cardCls = "p-5 border border-border shadow-none";

    return (
        <div className="max-w-[1240px]">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold">گزارشات و تحلیل</h1>
                    <p className="text-muted-fg text-super-sm mt-1.5">عملکرد شعبه {branchName} در بازهٔ انتخابی</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                        {PERIODS.map((p) => (
                            <button key={p.key} onClick={() => setPeriod(p.key)}
                                className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${period === p.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg"}`}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={exportCsv} disabled={!stats}
                        className="bg-primary text-primary-fg rounded-xl px-4 py-2 text-super-xs font-bold hover:bg-primary-hover disabled:opacity-50">
                        خروجی CSV
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-4">
                {loading ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[92px] rounded-2xl" />) : (
                    <>
                        <MiniStat value={FormatPrice(stats?.revenue ?? 0)} label="فروش کل (تومان)" trend={stats?.trends?.revenue} />
                        <MiniStat value={PersianNumber(stats?.ordersCount ?? 0)} label="تعداد سفارش" trend={stats?.trends?.orders} />
                        <MiniStat value={FormatPrice(stats?.avgBasket ?? 0)} label="میانگین سبد خرید" trend={stats?.trends?.avgBasket} />
                        <MiniStat value={`${PersianNumber(stats?.cancellationRate ?? 0)}٪`} label="نرخ لغو سفارش" />
                    </>
                )}
            </div>

            {/* Sales trend + status donut */}
            <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4 mb-4">
                <Card className={cardCls}>
                    <CardHead title="روند فروش" note="۷ روز گذشته" />
                    <AreaChart data={stats?.revenueSeries || []} variant="light" stretch height={170} />
                    <div className="flex justify-between mt-2 px-1">
                        {weekdayData.map((d, i) => <span key={i} className="text-super-xs text-subtle-fg">{d.label}</span>)}
                    </div>
                </Card>

                <Card className={cardCls}>
                    <CardHead title="وضعیت سفارش‌ها" note="این بازه" />
                    <div className="flex items-center gap-4">
                        <Donut segments={donutSegments} centerValue={PersianNumber(donutTotal)} centerLabel="سفارش" />
                        <div className="flex-1 flex flex-col gap-2.5">
                            {STATUS_SEGMENTS.filter((s) => (stats?.statusBreakdown?.[s.key] || 0) > 0 || donutTotal === 0).map((s) => {
                                const v = stats?.statusBreakdown?.[s.key] || 0;
                                const pct = donutTotal ? Math.round((v / donutTotal) * 100) : 0;
                                return (
                                    <div key={s.key} className="flex items-center gap-2.5 text-super-sm">
                                        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: s.color }} />
                                        <span className="text-muted-fg">{s.label}</span>
                                        <span className="mr-auto font-extrabold tabular-nums">{PersianNumber(pct)}٪</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top items + weekday/payment */}
            <div className="grid lg:grid-cols-2 gap-4">
                <Card className={cardCls}>
                    <CardHead title="پرفروش‌ترین آیتم‌ها" note="بر اساس تعداد فروش" />
                    {(stats?.topItems?.length ?? 0) === 0 ? (
                        <p className="text-muted-fg text-super-sm py-4">در این بازه فروشی ثبت نشده است.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {stats.topItems.map((t) => (
                                <div key={t.menuItem._id} className="flex items-center gap-3">
                                    <span className="w-24 text-super-sm font-semibold truncate shrink-0">{t.menuItem.name}</span>
                                    <div className="flex-1 h-[22px] bg-surface-sunken rounded-lg overflow-hidden">
                                        <div className="h-full rounded-lg bg-gradient-to-l from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]" style={{ width: `${(t.quantity / topMax) * 100}%` }} />
                                    </div>
                                    <span className="w-10 text-left text-super-sm font-extrabold tabular-nums shrink-0">{PersianNumber(t.quantity)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className={cardCls}>
                    <CardHead title="فروش بر اساس روز هفته" note="۷ روز گذشته" />
                    <BarChart data={weekdayData} />

                    <div className="mt-5">
                        <div className="text-super-sm font-bold mb-2">تفکیک روش پرداخت</div>
                        <div className="flex h-3.5 rounded-full overflow-hidden bg-surface-sunken">
                            <div className="bg-primary" style={{ width: `${onlinePct}%` }} />
                            <div className="bg-warning" style={{ width: `${cashPct}%` }} />
                        </div>
                        <div className="flex gap-4 mt-2 text-super-xs">
                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> آنلاین {PersianNumber(onlinePct)}٪</span>
                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> نقدی {PersianNumber(cashPct)}٪</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CardHead = ({ title, note }) => (
    <div className="mb-4">
        <h2 className="text-super-base font-extrabold">{title}</h2>
        <p className="text-super-xs text-muted-fg mt-0.5">{note}</p>
    </div>
);

export default BranchPanelReports;
