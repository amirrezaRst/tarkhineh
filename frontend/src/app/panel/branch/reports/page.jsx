"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import StatHeroLedger from "@/components/panel/StatHeroLedger";
import Donut from "@/components/panel/charts/Donut";
import BarChart from "@/components/panel/charts/BarChart";
import InteractiveTrendChart from "@/components/panel/charts/InteractiveTrendChart";
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

// Report period -> orders-page date range (orders has no "month", so widen it).
const PERIOD_TO_RANGE = { today: "today", week: "7days", month: "all" };

const BranchPanelReports = () => {
    const router = useRouter();
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";
    const [period, setPeriod] = useState("week");
    const [metric, setMetric] = useState("value");
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

    const donutSegments = STATUS_SEGMENTS.map((s) => ({ key: s.key, label: s.label, value: stats?.statusBreakdown?.[s.key] || 0, color: s.color }));
    const openOrders = (statusKey) => router.push(`/panel/branch/orders?status=${statusKey}&range=${PERIOD_TO_RANGE[period] || "all"}`);
    const donutTotal = donutSegments.reduce((sum, s) => sum + s.value, 0);
    const topMax = Math.max(...(stats?.topItems || []).map((t) => t.quantity), 1);
    const weekdayData = (stats?.revenueSeries || []).map((d) => ({ label: weekdayShort(d.date), value: d.value }));

    const pay = stats?.paymentSplit || { online: 0, cash: 0 };
    const payTotal = pay.online + pay.cash;
    const onlinePct = payTotal ? Math.round((pay.online / payTotal) * 100) : 0;
    const cashPct = 100 - onlinePct;

    const exportExcel = async () => {
        if (!stats) return;
        const XLSX = await import("xlsx");
        const periodLabel = PERIODS.find((p) => p.key === period)?.label || period;
        const rows = [
            ["گزارش شعبه", branchName],
            ["بازه", periodLabel],
            [],
            ["شاخص", "مقدار"],
            ["فروش کل (تومان)", stats.revenue],
            ["تعداد سفارش", stats.ordersCount],
            ["میانگین سبد خرید (تومان)", stats.avgBasket],
            ["نرخ لغو (٪)", stats.cancellationRate],
            ["پرداخت آنلاین", stats.paymentSplit?.online ?? 0],
            ["پرداخت نقدی", stats.paymentSplit?.cash ?? 0],
            [],
            ["پرفروش‌ترین آیتم‌ها", "تعداد فروش"],
            ...(stats.topItems || []).map((t) => [t.menuItem.name, t.quantity]),
        ];
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws["!cols"] = [{ wch: 26 }, { wch: 16 }];
        const wb = XLSX.utils.book_new();
        wb.Workbook = { Views: [{ RTL: true }] };
        XLSX.utils.book_append_sheet(wb, ws, "گزارش");
        XLSX.writeFile(wb, `report-${branchName}-${period}.xlsx`);
    };

    const cardCls = "p-5 border border-border shadow-none";

    return (
        <div className="w-full">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold">گزارشات و تحلیل</h1>
                    <p className="text-muted-fg text-super-sm mt-1.5">عملکرد شعبه {branchName} در بازهٔ انتخابی</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                        {PERIODS.map((p) => (
                            <button key={p.key} onClick={() => setPeriod(p.key)}
                                className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${period === p.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg"}`}>{p.label}</button>
                        ))}
                    </div>
                    <button onClick={exportExcel} disabled={!stats} className="inline-flex items-center gap-1.5 bg-primary text-primary-fg rounded-xl px-4 py-2 text-super-xs font-bold hover:bg-primary-hover disabled:opacity-50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 3v5h5M14 3l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m9 12 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                        خروجی اکسل
                    </button>
                </div>
            </div>

            {/* KPI hero + ledger */}
            {loading ? (
                <div className="grid lg:grid-cols-[1.55fr_1fr] gap-4 mb-4"><Skeleton className="h-44 rounded-[22px]" /><Skeleton className="h-44 rounded-[22px]" /></div>
            ) : (
                <div className="mb-4">
                    <StatHeroLedger
                        hero={{
                            label: "فروش کل",
                            value: FormatPrice(stats?.revenue ?? 0),
                            unit: "تومان",
                            trend: stats?.trends?.revenue,
                            caption: "نسبت به دورهٔ قبل",
                            series: (stats?.trendSeries || []).map((d) => ({ value: d.value })),
                        }}
                        rows={[
                            { label: "تعداد سفارش", caption: "در این بازه", value: PersianNumber(stats?.ordersCount ?? 0), trend: stats?.trends?.orders },
                            { label: "میانگین سبد خرید", caption: "به‌ازای هر سفارش", value: FormatPrice(stats?.avgBasket ?? 0), trend: stats?.trends?.avgBasket },
                            { label: "نرخ لغو سفارش", caption: "سهم لغوشده‌ها", value: `${PersianNumber(stats?.cancellationRate ?? 0)}٪` },
                        ]}
                    />
                </div>
            )}

            {/* Trend + status donut */}
            <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4 mb-4">
                <Card className={cardCls}>
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <div>
                            <h2 className="text-super-base font-extrabold">روند فروش</h2>
                            <p className="text-super-xs text-muted-fg mt-0.5">
                                {period === "today" ? "امروز · ساعتی" : period === "week" ? "۷ روز گذشته" : "این ماه · روزانه"}
                            </p>
                        </div>
                        <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                            <button onClick={() => setMetric("value")} className={`text-super-xs font-bold px-3 py-1.5 rounded-lg ${metric === "value" ? "bg-surface text-primary shadow-sm" : "text-muted-fg"}`}>مبلغ فروش</button>
                            <button onClick={() => setMetric("orders")} className={`text-super-xs font-bold px-3 py-1.5 rounded-lg ${metric === "orders" ? "bg-surface text-primary shadow-sm" : "text-muted-fg"}`}>تعداد سفارش</button>
                        </div>
                    </div>
                    {loading ? <Skeleton className="h-56 rounded-xl" /> : <InteractiveTrendChart data={stats?.trendSeries || []} metric={metric} />}
                </Card>

                <Card className={cardCls}>
                    <div className="mb-4"><h2 className="text-super-base font-extrabold">وضعیت سفارش‌ها</h2><p className="text-super-xs text-muted-fg mt-0.5">این بازه · برای دیدن سفارش‌ها کلیک کنید</p></div>
                    <div className="flex items-center gap-4">
                        <Donut segments={donutSegments} centerValue={PersianNumber(donutTotal)} centerLabel="سفارش" onSegmentClick={(s) => openOrders(s.key)} />
                        <div className="flex-1 flex flex-col gap-1">
                            {STATUS_SEGMENTS.filter((s) => (stats?.statusBreakdown?.[s.key] || 0) > 0 || donutTotal === 0).map((s) => {
                                const v = stats?.statusBreakdown?.[s.key] || 0;
                                const pct = donutTotal ? Math.round((v / donutTotal) * 100) : 0;
                                return (
                                    <button key={s.key} onClick={() => openOrders(s.key)} disabled={v === 0}
                                        className="flex items-center gap-2.5 text-super-sm rounded-lg px-2 py-1.5 -mx-2 hover:bg-surface-sunken transition-colors disabled:opacity-60 disabled:hover:bg-transparent">
                                        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: s.color }} />
                                        <span className="text-muted-fg">{s.label}</span>
                                        <span className="mr-auto font-extrabold tabular-nums">{PersianNumber(pct)}٪</span>
                                        {v > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-subtle-fg"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top items + weekday/payment */}
            <div className="grid lg:grid-cols-2 gap-4">
                <Card className={cardCls}>
                    <div className="mb-4"><h2 className="text-super-base font-extrabold">پرفروش‌ترین آیتم‌ها</h2><p className="text-super-xs text-muted-fg mt-0.5">بر اساس تعداد فروش</p></div>
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
                    <div className="mb-4"><h2 className="text-super-base font-extrabold">فروش بر اساس روز هفته</h2><p className="text-super-xs text-muted-fg mt-0.5">۷ روز گذشته</p></div>
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

export default BranchPanelReports;
