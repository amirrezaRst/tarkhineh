"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import OrderStatusBadge from "@/components/panel/OrderStatusBadge";
import { SkeletonOrderRow } from "@/components/panel/Skeleton";
import AreaChart from "@/components/panel/charts/AreaChart";
import Donut from "@/components/panel/charts/Donut";
import BarChart from "@/components/panel/charts/BarChart";
import { FastFoodIcon, WalletMoneyIcon, ClockIcon, ChevronIcon } from "@/assets/Icons";

const Trend = ({ value, light = false }) => {
    if (value === null || value === undefined) return null;
    const up = value >= 0;
    const base = light
        ? "bg-white/15 text-white"
        : up ? "text-success bg-success/10" : "text-destructive bg-destructive/10";
    return (
        <span className={`inline-flex items-center gap-1 text-super-xs font-extrabold px-2 py-0.5 rounded-full ${base}`}>
            {up ? "▲" : "▼"} {PersianNumber(Math.abs(value))}٪
        </span>
    );
};

const STATUS_SEGMENTS = [
    { key: "delivered", label: "تحویل شده", color: "hsl(var(--status-delivered))" },
    { key: "on_the_way", label: "در حال ارسال", color: "hsl(var(--status-on-the-way))" },
    { key: "preparing", label: "در حال آماده‌سازی", color: "hsl(var(--status-preparing))" },
    { key: "pending", label: "در انتظار", color: "hsl(var(--status-pending))" },
    { key: "cancelled", label: "لغو شده", color: "hsl(var(--status-cancelled))" },
];

const BranchPanel = () => {
    const branch = useUserStore((state) => state.user?.branch);

    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();

        (async () => {
            setLoading(true);
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    api.get(`/branch-manager/stats/${branch}?period=today`, { signal: controller.signal }),
                    api.get(`/branch-manager/orders/${branch}?status=all&limit=5`, { signal: controller.signal }),
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data.orders);
            } catch (err) {
                if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [branch]);

    const donutSegments = STATUS_SEGMENTS.map((s) => ({
        label: s.label,
        value: stats?.statusBreakdown?.[s.key] || 0,
        color: s.color,
    }));
    const donutTotal = donutSegments.reduce((sum, s) => sum + s.value, 0);

    // Peak hours windowed to business hours (10:00–23:00).
    const peakData = (stats?.peakHours || []).slice(10, 24).map((h) => ({
        label: PersianNumber(h.hour),
        value: h.count,
    }));

    return (
        <div className="w-full">
            {/* ===== Bento: feature + stat tiles ===== */}
            <section className="grid grid-cols-2 md:grid-cols-4 auto-rows-[118px] gap-4">
                {/* Feature — revenue hero with embedded sparkline */}
                <div className="col-span-2 row-span-2 relative overflow-hidden rounded-[22px] p-6 text-white bg-gradient-to-tl from-feature-from via-feature-mid to-feature-to shadow-soft-lg flex flex-col">
                    <div className="absolute -top-16 -left-12 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="relative">
                        <p className="text-white/75 text-super-sm">درآمد امروز</p>
                        <p className="text-4.5xl font-extrabold tabular-nums leading-tight mt-1.5">
                            {loading ? "—" : FormatPrice(stats?.revenue ?? 0)}
                            <span className="text-base font-medium text-white/80 mr-2">تومان</span>
                        </p>
                        <div className="flex items-center gap-2.5 mt-2">
                            {!loading && <Trend value={stats?.trends?.revenue} light />}
                            <span className="text-white/60 text-super-xs">نسبت به دیروز</span>
                        </div>
                    </div>
                    <div className="relative mt-auto -mx-6 -mb-6">
                        {!loading && <AreaChart data={stats?.revenueSeries || []} variant="dark" stretch height={80} />}
                    </div>
                </div>

                {/* Orders today */}
                <div className="rounded-[18px] p-[17px] border border-primary-subtle bg-primary-subtle flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-[10px] bg-white/60 grid place-items-center text-primary">
                            <FastFoodIcon className="w-[18px] h-[18px] fill-current" />
                        </div>
                        {!loading && <Trend value={stats?.trends?.orders} />}
                    </div>
                    <div>
                        <div className="text-[27px] font-extrabold leading-none tabular-nums">{loading ? "—" : PersianNumber(stats?.ordersCount ?? 0)}</div>
                        <div className="text-super-xs text-muted-fg mt-1.5">سفارش‌های امروز</div>
                    </div>
                </div>

                {/* Avg basket */}
                <div className="rounded-[18px] p-[17px] border border-warning-subtle bg-warning-subtle flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-[10px] bg-white/60 grid place-items-center text-warning-fg">
                            <WalletMoneyIcon className="w-[18px] h-[18px] fill-current" />
                        </div>
                        {!loading && <Trend value={stats?.trends?.avgBasket} />}
                    </div>
                    <div>
                        <div className="text-[23px] font-extrabold leading-none tabular-nums">
                            {loading ? "—" : FormatPrice(stats?.avgBasket ?? 0)} <span className="text-xs font-semibold text-muted-fg">ت</span>
                        </div>
                        <div className="text-super-xs text-muted-fg mt-1.5">میانگین سبد خرید</div>
                    </div>
                </div>

                {/* Active orders (wide) */}
                <div className="col-span-2 rounded-[18px] p-[17px] border border-info-subtle bg-info-subtle flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-[10px] bg-white/60 grid place-items-center text-info">
                            <ClockIcon className="w-[18px] h-[18px] fill-current" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-super-xs font-extrabold px-2 py-0.5 rounded-full text-info bg-info/10">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-info" />
                            </span>
                            زنده
                        </span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-[27px] font-extrabold leading-none tabular-nums">{loading ? "—" : PersianNumber(stats?.activeOrders ?? 0)}</div>
                            <div className="text-super-xs text-muted-fg mt-1.5">سفارش‌های در جریان</div>
                        </div>
                        <div className="flex gap-3.5 text-center">
                            <div>
                                <div className="font-extrabold tabular-nums">{loading ? "—" : PersianNumber(stats?.activeBreakdown?.pending ?? 0)}</div>
                                <div className="text-[11px] text-muted-fg">در انتظار</div>
                            </div>
                            <div>
                                <div className="font-extrabold tabular-nums">{loading ? "—" : PersianNumber(stats?.activeBreakdown?.on_the_way ?? 0)}</div>
                                <div className="text-[11px] text-muted-fg">در حال ارسال</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Donut + Peak hours ===== */}
            <section className="grid md:grid-cols-[1fr_1.5fr] gap-4 mt-4">
                <Card className="p-5 border border-border shadow-none">
                    <div className="mb-4">
                        <h2 className="text-super-base font-extrabold">وضعیت سفارش‌ها</h2>
                        <p className="text-super-xs text-muted-fg mt-0.5">امروز</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Donut segments={donutSegments} centerValue={PersianNumber(donutTotal)} centerLabel="سفارش" />
                        <div className="flex-1 flex flex-col gap-3">
                            {STATUS_SEGMENTS.filter((s) => (stats?.statusBreakdown?.[s.key] || 0) > 0 || donutTotal === 0).slice(0, 4).map((s) => (
                                <div key={s.key} className="flex items-center gap-2.5 text-super-sm">
                                    <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: s.color }} />
                                    <span className="text-muted-fg">{s.label}</span>
                                    <span className="mr-auto font-extrabold tabular-nums">{PersianNumber(stats?.statusBreakdown?.[s.key] || 0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="p-5 border border-border shadow-none">
                    <div className="mb-4">
                        <h2 className="text-super-base font-extrabold">ساعات پرترافیک</h2>
                        <p className="text-super-xs text-muted-fg mt-0.5">تعداد سفارش بر اساس ساعت — امروز</p>
                    </div>
                    <BarChart data={peakData} formatValue={(v) => `${PersianNumber(v)} سفارش`} />
                </Card>
            </section>

            {/* ===== Best sellers + Recent orders ===== */}
            <section className="grid md:grid-cols-2 gap-4 mt-4">
                <Card className="p-5 border border-border shadow-none">
                    <div className="mb-3">
                        <h2 className="text-super-base font-extrabold">پرفروش‌ترین آیتم‌ها</h2>
                        <p className="text-super-xs text-muted-fg mt-0.5">امروز</p>
                    </div>
                    {!loading && (stats?.topItems?.length ?? 0) === 0 && (
                        <p className="text-muted-fg text-super-sm py-4">هنوز فروشی برای امروز ثبت نشده است.</p>
                    )}
                    <div className="flex flex-col">
                        {stats?.topItems?.map((item, i) => (
                            <div key={item.menuItem._id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                                <span className="w-6 text-center font-extrabold text-subtle-fg text-super-sm">{PersianNumber(i + 1)}</span>
                                <div
                                    className="w-11 h-11 rounded-xl bg-cover bg-center shrink-0 bg-surface-sunken"
                                    style={{ backgroundImage: item.menuItem.images?.[0] ? `url(${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.menuItem.images[0]})` : undefined }}
                                />
                                <span className="font-bold text-super-sm">{item.menuItem.name}</span>
                                <span className="mr-auto text-super-sm font-extrabold">{PersianNumber(item.quantity)} <span className="text-super-xs text-muted-fg font-semibold">فروش</span></span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5 border border-border shadow-none">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-super-base font-extrabold">سفارش‌های اخیر</h2>
                            <p className="text-super-xs text-muted-fg mt-0.5">۵ سفارش آخر</p>
                        </div>
                        <Link href="/panel/branch/orders" className="text-primary text-super-xs font-bold hover:text-primary-hover">مشاهده همه</Link>
                    </div>
                    {loading ? (
                        <div className="flex flex-col gap-2"><SkeletonOrderRow /><SkeletonOrderRow /></div>
                    ) : recentOrders.length === 0 ? (
                        <p className="text-muted-fg text-super-sm py-4">سفارشی ثبت نشده است.</p>
                    ) : (
                        <div className="flex flex-col">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                                    <span className="font-bold text-primary-hover text-super-sm">#{PersianNumber(String(order._id).slice(-5))}</span>
                                    <span className="text-super-sm font-semibold truncate">{order.user?.fullName || order.user?.phoneNumber}</span>
                                    <span className="mr-auto text-super-sm font-bold tabular-nums whitespace-nowrap">{FormatPrice(order.finalPrice)}</span>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </section>
        </div>
    );
};

export default BranchPanel;
