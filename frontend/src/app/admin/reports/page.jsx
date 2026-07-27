"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import BarChart from "@/components/panel/charts/BarChart";
import InteractiveTrendChart from "@/components/panel/charts/InteractiveTrendChart";
import { Skeleton } from "@/components/panel/Skeleton";

const PERIODS = [{ key: "today", label: "امروز" }, { key: "week", label: "هفته" }, { key: "month", label: "ماه" }];
const STATUS = [
    { key: "delivered", label: "تحویل‌شده", color: "hsl(var(--status-delivered))" },
    { key: "on_the_way", label: "در مسیر", color: "hsl(var(--status-on-the-way))" },
    { key: "preparing", label: "آماده‌سازی", color: "hsl(var(--status-preparing))" },
    { key: "pending", label: "در انتظار", color: "hsl(var(--status-pending))" },
    { key: "cancelled", label: "لغوشده", color: "hsl(var(--status-cancelled))" },
];

const Bars = ({ rows, unit, gradient = "from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]" }) => {
    const max = Math.max(...rows.map((r) => r.value), 1);
    return (
        <div className="space-y-3">
            {rows.map((r) => (
                <div key={r.label}>
                    <div className="flex justify-between text-super-sm mb-1"><span className="font-bold truncate">{r.label}</span><span className="tabular-nums font-extrabold whitespace-nowrap">{r.display}</span></div>
                    <div className="h-2 rounded-full bg-surface-sunken overflow-hidden"><span className={`block h-full rounded-full bg-gradient-to-l ${gradient}`} style={{ width: `${Math.round((r.value / max) * 100)}%` }} /></div>
                </div>
            ))}
        </div>
    );
};

const AdminReports = () => {
    const [period, setPeriod] = useState("month");
    const [metric, setMetric] = useState("value");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const c = new AbortController();
        setLoading(true);
        api.get(`/admin/reports?period=${period}`, { signal: c.signal })
            .then((res) => setData(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));
        return () => c.abort();
    }, [period]);

    const d = data || {};
    const timings = d.timings || {};
    const pay = d.paymentSplit || { online: {}, cash: {} };
    const payTotal = (pay.online?.count || 0) + (pay.cash?.count || 0);
    const onlinePct = payTotal ? Math.round((pay.online.count / payTotal) * 100) : 0;

    const peak = (d.peakHours || []).map((h) => ({ label: PersianNumber(h.hour), value: h.count }));
    const users = (d.newUsersTrend || []).map((x) => ({ label: x.label, value: x.value }));
    const branchRows = (d.revenueByBranch || []).map((b) => ({ label: b.name, value: b.revenue, display: `${FormatPrice(b.revenue)} ت` }));
    const catRows = (d.salesByCategory || []).map((c) => ({ label: c.category, value: c.quantity, display: `${PersianNumber(c.quantity)} پرس` }));
    const itemRows = (d.topItems || []).map((i) => ({ label: i.name, value: i.qty, display: `${PersianNumber(i.qty)} · ${FormatPrice(i.revenue)} ت` }));

    const Timing = ({ v, label }) => (
        <div className="rounded-xl p-4 bg-surface-sunken"><div className="text-super-base font-extrabold tabular-nums">{v != null ? `${PersianNumber(v)} دقیقه` : "—"}</div><div className="text-super-xs text-muted-fg mt-0.5">{label}</div></div>
    );

    return (
        <div className="w-full">
            <PanelPageHeader title="گزارشات و تحلیل کل" subtitle="تحلیل عملکرد پلتفرم در همهٔ شعبه‌ها"
                action={<div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                    {PERIODS.map((p) => <button key={p.key} onClick={() => setPeriod(p.key)} className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${period === p.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{p.label}</button>)}
                </div>} />

            {loading ? (
                <div className="grid lg:grid-cols-2 gap-4">{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
            ) : (
                <div className="space-y-4">
                    {/* revenue trend + KPIs */}
                    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
                        <Card className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-super-base font-extrabold">روند درآمد و سفارش</h2>
                                <div className="inline-flex bg-surface-sunken border border-border rounded-lg p-0.5 gap-0.5">
                                    <button onClick={() => setMetric("value")} className={`text-super-xs font-bold px-2.5 py-1 rounded-md ${metric === "value" ? "bg-surface text-primary" : "text-muted-fg"}`}>درآمد</button>
                                    <button onClick={() => setMetric("orders")} className={`text-super-xs font-bold px-2.5 py-1 rounded-md ${metric === "orders" ? "bg-surface text-primary" : "text-muted-fg"}`}>سفارش</button>
                                </div>
                            </div>
                            <InteractiveTrendChart data={d.revenueTrend || []} metric={metric} height={230} />
                        </Card>
                        <div className="grid gap-4">
                            <Card className="p-5">
                                <h2 className="text-super-base font-extrabold mb-3">زمان‌ها (میانگین)</h2>
                                <div className="grid grid-cols-3 gap-2.5">
                                    <Timing v={timings.accept} label="تأیید سفارش" />
                                    <Timing v={timings.delivery} label="ارسال پیک" />
                                    <Timing v={timings.fulfillment} label="کل تا تحویل" />
                                </div>
                            </Card>
                            <Card className="p-5">
                                <div className="flex items-center justify-between mb-1"><h2 className="text-super-base font-extrabold">نرخ لغو</h2><span className="text-2xl font-extrabold tabular-nums text-status-cancelled">{PersianNumber(d.cancellationRate ?? 0)}٪</span></div>
                                <p className="text-super-xs text-muted-fg">{PersianNumber(d.statusCounts?.cancelled ?? 0)} لغو از {PersianNumber(d.totalOrders ?? 0)} سفارش</p>
                                <div className="flex h-2 rounded-full overflow-hidden mt-3">
                                    {STATUS.map((s) => { const w = d.totalOrders ? ((d.statusCounts?.[s.key] || 0) / d.totalOrders) * 100 : 0; return w > 0 ? <span key={s.key} style={{ width: `${w}%`, background: s.color }} title={s.label} /> : null; })}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* payment split + new users */}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <Card className="p-5">
                            <h2 className="text-super-base font-extrabold mb-4">تفکیک روش پرداخت</h2>
                            <div className="flex h-4 rounded-full overflow-hidden mb-3">
                                <span style={{ width: `${onlinePct}%` }} className="bg-[hsl(var(--brand-500))]" />
                                <span style={{ width: `${100 - onlinePct}%` }} className="bg-[hsl(var(--brand-200))]" />
                            </div>
                            <div className="flex justify-between text-super-sm">
                                <div><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-500))] ml-1.5" />آنلاین: <b className="tabular-nums">{PersianNumber(pay.online?.count || 0)}</b> · {FormatPrice(pay.online?.sum || 0)} ت</div>
                                <div><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-200))] ml-1.5" />نقدی: <b className="tabular-nums">{PersianNumber(pay.cash?.count || 0)}</b> · {FormatPrice(pay.cash?.sum || 0)} ت</div>
                            </div>
                        </Card>
                        <Card className="p-5">
                            <h2 className="text-super-base font-extrabold mb-4">کاربران جدید</h2>
                            <BarChart data={users} height={140} formatValue={(v) => `${PersianNumber(v)} کاربر`} />
                        </Card>
                    </div>

                    {/* peak hours + revenue by branch */}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <Card className="p-5"><h2 className="text-super-base font-extrabold mb-4">ساعات پرترافیک</h2><BarChart data={peak} height={150} formatValue={(v) => `${PersianNumber(v)} سفارش`} /></Card>
                        <Card className="p-5"><h2 className="text-super-base font-extrabold mb-4">درآمد بر اساس شعبه</h2>{branchRows.length ? <Bars rows={branchRows} /> : <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p>}</Card>
                    </div>

                    {/* categories + top items */}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <Card className="p-5"><h2 className="text-super-base font-extrabold mb-4">فروش بر اساس دسته‌بندی</h2>{catRows.length ? <Bars rows={catRows} gradient="from-[hsl(var(--brand-200))] to-[hsl(var(--brand-500))]" /> : <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p>}</Card>
                        <Card className="p-5"><h2 className="text-super-base font-extrabold mb-4">پرفروش‌ترین آیتم‌ها</h2>{itemRows.length ? <Bars rows={itemRows} /> : <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p>}</Card>
                    </div>

                    {/* top couriers */}
                    <Card className="p-5">
                        <h2 className="text-super-base font-extrabold mb-4">برترین پیک‌های پلتفرم</h2>
                        {(d.topCouriers || []).length === 0 ? <p className="text-muted-fg text-super-sm py-4 text-center">داده‌ای نیست.</p> : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {d.topCouriers.map((c, i) => (
                                    <div key={c._id} className="flex items-center gap-3 text-super-sm bg-surface-sunken rounded-xl px-3.5 py-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-primary-subtle text-primary grid place-items-center font-extrabold text-super-xs tabular-nums">{PersianNumber(i + 1)}</span>
                                        <span className="font-bold flex-1 truncate">{c.fullName || c.phoneNumber || "پیک"}</span>
                                        <span className="tabular-nums font-extrabold">{PersianNumber(c.deliveries)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
