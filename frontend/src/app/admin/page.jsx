"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import MetricBar from "@/components/panel/MetricBar";
import StatHeroLedger from "@/components/panel/StatHeroLedger";
import InteractiveTrendChart from "@/components/panel/charts/InteractiveTrendChart";
import Donut from "@/components/panel/charts/Donut";
import { Skeleton } from "@/components/panel/Skeleton";
import { RolePill } from "./adminUtils";

const STATUS = [
    { key: "delivered", label: "تحویل‌شده", color: "hsl(var(--status-delivered))" },
    { key: "on_the_way", label: "در مسیر", color: "hsl(var(--status-on-the-way))" },
    { key: "preparing", label: "در حال آماده‌سازی", color: "hsl(var(--status-preparing))" },
    { key: "pending", label: "در انتظار تأیید", color: "hsl(var(--status-pending))" },
    { key: "cancelled", label: "لغوشده", color: "hsl(var(--status-cancelled))" },
];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const c = new AbortController();
        api.get("/admin/overview", { signal: c.signal })
            .then((res) => setData(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));
        return () => c.abort();
    }, []);

    if (loading) {
        return (
            <div className="w-full space-y-4">
                <Skeleton className="h-48 rounded-[22px]" />
                <Skeleton className="h-24 rounded-2xl" />
                <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div>
                <Skeleton className="h-80 rounded-2xl" />
            </div>
        );
    }

    const s = data?.stats || {};
    const lb = data?.leaderboard || [];
    const maxRev = Math.max(...lb.map((b) => b.revenue), 1);
    const statusTotal = STATUS.reduce((t, x) => t + (data?.statusToday?.[x.key] || 0), 0);
    const donut = STATUS.map((x) => ({ label: x.label, value: data?.statusToday?.[x.key] || 0, color: x.color }));

    return (
        <div className="w-full">
            <StatHeroLedger
                hero={{
                    label: "درآمد کل — این ماه",
                    value: FormatPrice(s.revenueMonth ?? 0),
                    unit: "تومان",
                    caption: `${PersianNumber(s.ordersMonth ?? 0)} سفارش تحویل‌شده`,
                    series: data?.revenueSeries || [],
                }}
                rows={[
                    { label: "کل کاربران", value: PersianNumber(s.totalUsers ?? 0), caption: `${PersianNumber(s.newUsersMonth ?? 0)} کاربر جدید این ماه` },
                    { label: "پیک فعال", value: `${PersianNumber(s.couriersOnline ?? 0)}/${PersianNumber(s.couriersTotal ?? 0)}` },
                    { label: "میانگین رضایت", value: s.avgRating != null ? PersianNumber(s.avgRating) : "—" },
                ]}
            />

            <div className="my-4">
                <MetricBar items={[
                    { value: FormatPrice(s.revenueToday ?? 0), label: "درآمد امروز (ت)" },
                    { value: PersianNumber(s.ordersToday ?? 0), label: "سفارش امروز" },
                    { value: `${PersianNumber(s.openBranches ?? 0)}/${PersianNumber(s.totalBranches ?? 0)}`, label: "شعبهٔ فعال" },
                    { value: PersianNumber(s.couriersOnline ?? 0), label: "پیک آنلاین" },
                    { value: PersianNumber(s.newUsersMonth ?? 0), label: "کاربر جدید ماه" },
                ]} />
            </div>

            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-super-base font-extrabold">روند درآمد کل پلتفرم</h2>
                        <span className="text-super-xs text-muted-fg">۱۴ روز اخیر</span>
                    </div>
                    <InteractiveTrendChart data={data?.revenueSeries || []} metric="value" height={230} />
                </Card>

                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">وضعیت سفارش‌های امروز</h2>
                    <div className="flex items-center gap-5">
                        <Donut segments={donut} centerValue={PersianNumber(statusTotal)} centerLabel="سفارش" size={140} thickness={18} />
                        <div className="flex-1 flex flex-col gap-2.5">
                            {STATUS.map((x) => (
                                <div key={x.key} className="flex items-center gap-2 text-super-sm">
                                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: x.color }} />
                                    <span className="text-muted-fg">{x.label}</span>
                                    <b className="mr-auto tabular-nums">{PersianNumber(data?.statusToday?.[x.key] || 0)}</b>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="mt-4 overflow-hidden">
                <div className="p-5 pb-3 flex items-center justify-between">
                    <h2 className="text-super-base font-extrabold">جدول رتبه‌بندی شعبه‌ها</h2>
                    <span className="text-super-xs text-muted-fg">این ماه</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-super-sm">
                        <thead>
                            <tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">#</th><th className="px-4 py-3 font-bold">شعبه</th>
                                <th className="px-4 py-3 font-bold">مدیر</th><th className="px-4 py-3 font-bold">سفارش</th>
                                <th className="px-4 py-3 font-bold">درآمد (ت)</th><th className="px-4 py-3 font-bold w-40">عملکرد</th>
                                <th className="px-4 py-3 font-bold">پیک</th><th className="px-4 py-3 font-bold">رضایت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lb.map((b, i) => (
                                <tr key={b._id} className="border-t border-border hover:bg-surface-sunken/50">
                                    <td className="px-4 py-3"><span className="w-7 h-7 rounded-lg bg-primary-subtle text-primary grid place-items-center font-extrabold text-super-xs tabular-nums">{PersianNumber(i + 1)}</span></td>
                                    <td className="px-4 py-3 font-extrabold">{b.name}</td>
                                    <td className="px-4 py-3">{b.manager ? <RolePill role="branch_manager">{b.manager.fullName || b.manager.phoneNumber}</RolePill> : <RolePill tone="warn">بدون مدیر</RolePill>}</td>
                                    <td className="px-4 py-3 tabular-nums font-bold">{PersianNumber(b.orders)}</td>
                                    <td className="px-4 py-3 tabular-nums font-bold">{FormatPrice(b.revenue)}</td>
                                    <td className="px-4 py-3"><div className="h-1.5 rounded-full bg-surface-sunken overflow-hidden min-w-[80px]"><span className="block h-full rounded-full bg-gradient-to-l from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]" style={{ width: `${Math.round((b.revenue / maxRev) * 100)}%` }} /></div></td>
                                    <td className="px-4 py-3 tabular-nums">{PersianNumber(b.couriers)}</td>
                                    <td className="px-4 py-3 tabular-nums">{b.avgRating != null ? PersianNumber(b.avgRating) : "—"}</td>
                                </tr>
                            ))}
                            {lb.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-muted-fg">شعبه‌ای ثبت نشده است.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
