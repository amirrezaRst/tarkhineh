"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import BarChart from "@/components/panel/charts/BarChart";
import { Skeleton } from "@/components/panel/Skeleton";

const PERIODS = [{ key: "today", label: "امروز" }, { key: "week", label: "هفته" }, { key: "month", label: "ماه" }];

const AdminReports = () => {
    const [period, setPeriod] = useState("month");
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

    const peak = (data?.peakHours || []).map((h) => ({ label: PersianNumber(h.hour), value: h.count }));
    const cats = data?.salesByCategory || [];
    const maxCat = Math.max(...cats.map((c) => c.quantity), 1);
    const couriers = data?.topCouriers || [];
    const branches = data?.revenueByBranch || [];
    const maxBranch = Math.max(...branches.map((b) => b.revenue), 1);

    return (
        <div className="w-full">
            <PanelPageHeader title="گزارشات و تحلیل کل" subtitle="تحلیل عملکرد پلتفرم در همهٔ شعبه‌ها"
                action={
                    <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                        {PERIODS.map((p) => (
                            <button key={p.key} onClick={() => setPeriod(p.key)}
                                className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${period === p.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{p.label}</button>
                        ))}
                    </div>
                } />

            {loading ? (
                <div className="grid lg:grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                    {/* peak hours */}
                    <Card className="p-5">
                        <h2 className="text-super-base font-extrabold mb-4">ساعات پرترافیک</h2>
                        <BarChart data={peak} height={150} />
                    </Card>

                    {/* revenue by branch */}
                    <Card className="p-5">
                        <h2 className="text-super-base font-extrabold mb-4">درآمد بر اساس شعبه</h2>
                        {branches.length === 0 ? <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p> : (
                            <div className="space-y-3">
                                {branches.map((b) => (
                                    <div key={b.name}>
                                        <div className="flex justify-between text-super-sm mb-1"><span className="font-bold">{b.name}</span><span className="tabular-nums font-extrabold">{FormatPrice(b.revenue)} ت</span></div>
                                        <div className="h-2 rounded-full bg-surface-sunken overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-l from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]" style={{ width: `${Math.round((b.revenue / maxBranch) * 100)}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* sales by category */}
                    <Card className="p-5">
                        <h2 className="text-super-base font-extrabold mb-4">فروش بر اساس دسته‌بندی</h2>
                        {cats.length === 0 ? <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p> : (
                            <div className="space-y-3">
                                {cats.map((c) => (
                                    <div key={c.category}>
                                        <div className="flex justify-between text-super-sm mb-1"><span className="font-bold">{c.category}</span><span className="tabular-nums font-extrabold">{PersianNumber(c.quantity)} پرس</span></div>
                                        <div className="h-2 rounded-full bg-surface-sunken overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-l from-[hsl(var(--brand-200))] to-[hsl(var(--brand-500))]" style={{ width: `${Math.round((c.quantity / maxCat) * 100)}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* top couriers */}
                    <Card className="p-5">
                        <h2 className="text-super-base font-extrabold mb-4">برترین پیک‌های پلتفرم</h2>
                        {couriers.length === 0 ? <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p> : (
                            <div className="space-y-2.5">
                                {couriers.map((c, i) => (
                                    <div key={c._id} className="flex items-center gap-3 text-super-sm">
                                        <span className="w-7 h-7 rounded-lg bg-primary-subtle text-primary grid place-items-center font-extrabold text-super-xs tabular-nums">{PersianNumber(i + 1)}</span>
                                        <span className="font-bold flex-1 truncate">{c.fullName || c.phoneNumber || "پیک"}</span>
                                        <span className="tabular-nums font-extrabold">{PersianNumber(c.deliveries)} تحویل</span>
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
